//Get DOM elements
const button = document.getElementById('btn');
const txt_question = document.getElementById('question');
const txt_answer = document.getElementById('answer');
const txt_author = document.getElementById('author');

//Quiz Logic
let currentQuestion = null;

button.addEventListener('click', (event) => {
  Next()
});

async function Next() {
  if (currentQuestion === null) {
    currentQuestion = await getRandomQuestion();
    
    //Write the Question to the Page
    txt_question.innerHTML = currentQuestion.question;
    
    //Get the author of the question
    author = await getAuthorFromQuestionID(currentQuestion.question_id);
    txt_author.innerHTML = `- Question From ${author.name}`;

    txt_answer.innerHTML = '';
    button.innerHTML = 'Reveal Answer';
  }
  else {
    revealAnswer();
  }
}

async function getRandomQuestion() {
  try {
    let responce = await fetch('/rq/');
    let question_json = await responce.text();
    let question = JSON.parse(question_json);
    return await question;
  } catch (e) {
    alert(e);
  }
}

async function getAuthorFromQuestionID(question_id) {
  try {
    let responce = await fetch(`/afqid/${question_id}`);
    let author_json = await responce.text();
    let author = JSON.parse(author_json)
    return author;
  } catch (e) {
    alert(e);
  }
}

function revealAnswer() {
  txt_answer.innerHTML = currentQuestion.answer
  button.innerHTML = 'Next Question';

  currentQuestion = null;
}