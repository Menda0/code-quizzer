


angular.module('Educa', ['google.spreadsheet.i18n.angular','ngSanitize','betsol.timeCounter','checklist-model','angularLazyImg'])
  .controller('EducaController', function($scope,$compile,$http,$timeout, $interval, googleSpreadsheetI18nAngular) {

    $scope.getRandomInt = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    $scope.formatDateNumber = function (number) {
      return ("0" + number).slice(-2)
    }

    $scope.calculateProgress = function () {
      $scope.progress = (parseInt($scope.examInfo.currentQuestion)/$scope.examInfo.totalQuestions)*100
    }

    $scope.nextQuestion = function(){
      var nextQuestion = parseInt($scope.examInfo.currentQuestion)+1

      $scope.examInfo.currentQuestion = ""+nextQuestion
      $scope.currentQuestion = $scope.questions[$scope.examInfo.currentQuestion]

    }

    $scope.previowsQuestion = function () {
      var previowsQuestion = parseInt($scope.examInfo.currentQuestion)-1

      $scope.examInfo.currentQuestion = ""+previowsQuestion
      $scope.currentQuestion = $scope.questions[$scope.examInfo.currentQuestion]

    }

    $scope.finish = function () {

      function doFinish() {
        for(var i in $scope.questions){
          var question = $scope.questions[i]

          $scope._evaluateQuestion(question)
        }

        $scope.examInfo.finish = true


        $scope.examInfo.finishTime = moment.duration(moment().diff($scope.examInfo.startTime));


        $scope.$digest()
      }

      swal({
        title: "Finish the exam?",
        text: "Are you sure you want to finish the exam, this action cannot be undone",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          doFinish()
        } else {
          swal.close()
        }
      });

    }

    $scope._evaluateQuestion = function(currentQuestion) {
      var isCorrect = true

      // if(!Array.isArray(currentQuestion.answer[i])){
      //   currentQuestion.answer = [currentQuestion.answer]
      // }

      for(var i in currentQuestion.answer){
        var answer = currentQuestion.answer[i]

        if(!currentQuestion.correct.includes(answer)){
          isCorrect = false
          break
        }
      }

      for(var i in currentQuestion.correct){
        var correctAnswer = currentQuestion.correct[i]

        if(!currentQuestion.answer.includes(correctAnswer)){
          isCorrect = false
          break
        }
      }

      currentQuestion.isEvaluated = true
      currentQuestion.isCorrect = isCorrect

      $scope.$digest()
    }

    $scope.evaluateQuestion = function (currentQuestion) {

      swal({
        title: "Are you sure?",
        text: "Are you sure you want to evaluate this question, this action cannot be undone",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          $scope._evaluateQuestion(currentQuestion)
        } else {
          swal.close()
        }
      });

    }

    $scope.getExamQuestions = function (examUrl) {
      $scope.initExam()

      var sheet = "Question";
      var url = "https://sheets.googleapis.com/v4/spreadsheets/"+examUrl+"/values/"+sheet+"?key="+$scope.key
      return $http.get(
        url
      ).then(function(response) {
        var values = response.data.values

        for(var i=1;i<values.length;i++) {
          var value = values[i]
          var id = value[0]
          var question = value[1]
          var code = value[2]
          var type = value[3]

          $scope.questions[id] = {
            id:id,
            question: question?question.replace(/(?:\r\n|\r|\n)/g, '<br />'):question,
            code: code,
            type:type,
            isEvaluated:false,
            isCorrect:false,
            answer:[],
            options:[],
            wrong:[],
            correct:[],
            explanation:null
          }

          var sheet = "Options";
          var url = "https://sheets.googleapis.com/v4/spreadsheets/" + examUrl + "/values/" + sheet + "?key=" + $scope.key

        }

        return $http.get(url)

      }).then(function(response) {
        var values = response.data.values

        for (var i = 1; i < values.length; i++) {
          var value = values[i]
          var questionId = value[0]
          var id = value[1]
          var description = value[2]
          var correct = value[3].toLowerCase() == "true"?true:false
          var explanation = value[4]

          var questionOption = {
            id:id,
            description:description?description.replace(/(?:\r\n|\r|\n)/g, '<br />'):description,
            correct:correct,
            explanation:explanation?"\""+explanation.replace(/(?:\r\n|\r|\n)/g, '<br />')+"\"":explanation,
          }

          $scope.questions[questionId].options.push(questionOption)

          if(correct){
            $scope.questions[questionId].correct.push(questionOption.id)
          }else{
            $scope.questions[questionId].wrong.push(questionOption.id)
          }
        }

        var sheet = "Explanations";
        var url = "https://sheets.googleapis.com/v4/spreadsheets/" + examUrl + "/values/" + sheet + "?key=" + $scope.key

        return $http.get(url)


      }).then(function(response) {

        var values = response.data.values

        for (var i = 1; i < values.length; i++) {
          var value = values[i]
          var questionId = value[0]
          var explanation = value[1]

          $scope.questions[questionId].explanation = explanation.replace(/(?:\r\n|\r|\n)/g, '<br />')
        }

        $scope.currentQuestion = $scope.questions[Object.keys($scope.questions)[0]]
        $scope.examInfo.currentQuestion = $scope.currentQuestion.id
      })

    }

    // $scope.$watch('examUrl',function (newValue,oldValue) {
    //   if(newValue){
    //     $scope.getExamQuestions(newValue)
    //   }
    // },true)

    $scope.calculateExamStatics = function (questions) {

      var correctAwnsers = 0
      var wrongAwnsers = 0
      var notResponded = 0
      var totalQuestions = Object.keys($scope.questions).length


      for(var i in questions){
        var question = questions[i]

        if(!question.isEvaluated && (!question.answer || question.answer.length == 0)){
          notResponded++
        }else if(question.isEvaluated && question.isCorrect){
          correctAwnsers++
        }else if(question.isEvaluated && !question.isCorrect){
          wrongAwnsers++
        }
      }

      $scope.examInfo.notResponded = notResponded
      $scope.examInfo.wrongAwnsers = wrongAwnsers
      $scope.examInfo.correctAwnsers = correctAwnsers
      $scope.examInfo.totalQuestions = totalQuestions

    }

    $scope.$watch('currentQuestion',function (newValue,oldValue) {
      if(newValue){
        $scope.calculateProgress()
        $timeout(function () {
          $(".prettyprint").removeClass("prettyprinted");
          PR.prettyPrint();
        },100)
      }
    })

    $scope.$watch('questions',function (newValue,oldValue) {

      if(newValue != oldValue){
        $scope.calculateExamStatics(newValue)
      }

    },true)

    $scope.askForExamCode = function(){
      swal({
        title: "Welcome to this quiz?",
        text: 'Please insert a exam code. You can find this code on the link of the sheet containing the exam data. Please unsure that the sheet is public shared via url.',
        icon:'info',
        content: "input",
        closeOnClickOutside:false,
        closeOnEsc:false,
        button: {
          text: "Load",
          closeModal: false,
        },
      }).then(examUrl => {
        if (!examUrl) throw "Exam Url can be empty";

        return $scope.getExamQuestions(examUrl)
      }).then(response => {
        swal.stopLoading();
        swal.close();
        $scope.$digest()
      }).catch(err => {
        if (err) {
          swal(
            "Oh noes!",
            "The code provided does not exist, please check if the data is public shared via url",
            "error"
          ).then(function () {
            $scope.askForExamCode()
          });
        } else {
          swal.stopLoading();
          swal.close();
        }
      });

    }

    $scope.$watch('examUrl',function (newValue,oldValue) {
      if(!newValue){
        $scope.askForExamCode()
      }
    },true)

    $scope.toogleInfo = function () {
      $scope.infoOn = !$scope.infoOn
    }

    $scope.initExam = function () {
      document.documentElement.style.background = "url() no-repeat center center fixed";
      document.documentElement.style.backgroundSize ="cover";

      $scope.examInfo = {
        notResponded:0,
        correctAwnser:0,
        wrongAwnser:0,
        totalQuestions:0,
        currentQuestion:0,
        time:new Date(),
        startTime:moment(),
        finish:false,
        finishTime:null
      }


    }

    $scope.shuffle = function(a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    $scope.bgImageArray = ["background1.jpg", "background2.jpg", "background3.jpg", "background4.jpg", "background5.jpg"]
    $scope.secs = 10;
    $scope.bgImageArray.forEach(function(img){
      new Image().src = img;
      // caches images, avoiding white flash between background replacements
    });

    $scope.backgroundSequence = function () {
      $scope.shuffle($scope.bgImageArray)
      window.clearTimeout();
      var k = 0;
      for (i = 0; i < $scope.bgImageArray.length; i++) {
        setTimeout(function(){
          if($scope.examInfo.totalQuestions > 0){
            document.documentElement.style.background = "url() no-repeat center center fixed";
            document.documentElement.style.backgroundSize ="cover";
          }else{
            document.documentElement.style.background = "url(" + $scope.bgImageArray[k] + ") no-repeat center center fixed";
            document.documentElement.style.backgroundSize ="cover";
          }
          if ((k + 1) === $scope.bgImageArray.length) {
            setTimeout(
              function() {
                $scope.backgroundSequence()
              }, ($scope.secs * 1000))} else { k++; }
        }, ($scope.secs * 1000) * i)
      }
    }

    $scope.init = function () {
      PR.prettyPrint();
      $scope.infoOn = false
      $scope.examUrl = null
      $scope.initExam()
      $scope.progress = 0
      $scope.key = "AIzaSyCxSH72Rf0S_ccA2he5rn9Xuvkmcjnagys";
      $scope.questions = {}
      $scope.currentQuestion = null

      $scope.backgroundSequence()

    }

  })