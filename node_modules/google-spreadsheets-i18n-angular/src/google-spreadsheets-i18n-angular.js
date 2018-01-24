
angular.module('google.spreadsheet.i18n.angular',[])
  .service('googleSpreadsheetI18nAngular', ["$http", function($http) {

    var provider = this

    provider.init = function (spreendsheet,key,lang) {
      provider.i18n = {}
      provider.spreendsheet = spreendsheet
      provider.key = key
      provider.lang = lang
    }

    provider.changeLang = function(lang){
      provider.lang = lang
    }

    provider.message = function (code) {
      if (provider.i18n && provider.lang in provider.i18n) {
        return provider.i18n[provider.lang][code]
      } else {
        return null
      }
    }

    provider.getLanguage = function(lang){
      var url = "https://sheets.googleapis.com/v4/spreadsheets/"+provider.spreendsheet+"/values/"+lang+"?key="+provider.key
      $http.get(url).then(function(response) {

        console.log(response)

        for(var i in response.data.values){
          var codeMessage = response.data.values[i]
          if(!provider.i18n[lang]){
            provider.i18n[lang] = {}
          }
          provider.i18n[lang][codeMessage[0]] = codeMessage[1]
        }
      })
    }

    return provider
}]);