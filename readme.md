## Code Quizzer
The objective of this project is to create a platform for build coding quizes for programming languages using google sheets as datasource.
This can be useful in code certification sources.

[![paypal](https://raw.githubusercontent.com/Menda0/code-quizzer/master/buymecoffee.png)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=9UN7YK72L3ME6)



## Install and Run
Run the following code:
```
npm install && node server.js
```

Now go to[http://localhost:8080](http://localhost:8080)

## Simple Use / Demo
Go to[http://codequizzer.betacode.tech](http://codequizzer.betacode.tech)


## Create Data Source
Data sources are created using googlesheets.

We need to have 3 sheets in every file.

- Question
- Options
- Explanations

![Spreadsheet printscreen](https://raw.githubusercontent.com/Menda0/code-quizzer/master/print1.png)

The first line of each sheet is legend for the columns data. The algorithm will ignore this line.

### Question Sheet
Question sheet have the following structure:

- ID (Unique identifier of the question)
- Question (The question to be asked)
- Code (The code provided for the question, this can be empty for pure teorical question)
- Type (Two values allowed here, single and multiple. Single for single choice answer, multiple for multiple choice)

![Spreadsheet printscreen](https://raw.githubusercontent.com/Menda0/code-quizzer/master/print2.png)

### Options Sheet
Options sheet have the following structure: 
- Question (Unique identifier of the question, referrers to the ID provided in sheet Question)
- Option (Unique identifier of the option, can be repeated if the question is different)
- Description (Textual descripition of the answer)
- Correct (True/False, True if the answer is the correct answer for the question, false otherwise. Multiple choice may have multiple answer with True assigned)
- Explanation (Textual explanation why the answer is correct or incorrect)

**Note:**
Explanation an corrections will be only displayed when the answer is evaluated or the quiz is finished 

![Spreadsheet printscreen](https://raw.githubusercontent.com/Menda0/code-quizzer/master/print3.png)

### Explanations Sheets
Explanations sheet have the following structure:

- Question (Unique identifier of the question, referrers to the ID provided in sheet Question)
- Explanation (Textual explanation used to justified or help the answers provided, answer may not have explanation so this value can omitted for some questions)

**Note:**
Explanation an corrections will be only displayed when the answer is evaluated or the quiz is finished 

![Spreadsheet printscreen](https://raw.githubusercontent.com/Menda0/code-quizzer/master/print4.png)

### Very very Important ... :)
You have to published the sheet via url so the quizzer can work.

![Spreadsheet printscreen](https://raw.githubusercontent.com/Menda0/code-quizzer/master/print5.png)


You can check this[link](https://docs.google.com/spreadsheets/d/1MTD1givsY2n2dZcFJ7oHImEX_ngmk60OGdja45onVZc/edit?usp=sharing)to see a real example of a working sheet.




