class QuizUI {
  constructor (divQuiz) {
    const divFront = divQuiz.querySelector('#front');
    this.front = {
      divFront: divFront,
      txtQuestion: divFront.querySelector('#question'),
      txtAuthor: divQuiz.querySelector('#author')
    };

    // TODO: Break down into more classes/objects instead of this set hell
    const divBack = divQuiz.querySelector('#back');
    const divRatings = divBack.querySelector('#ratings');
    const divlikes = divRatings.querySelector('#likes');
    const divDislikes = divRatings.querySelector('#dislikes');
    const likes = {
      text: divlikes.querySelector('p'),
      button: divlikes.querySelector('button')
    };
    const dislikes = {
      text: divDislikes.querySelector('p'),
      button: divDislikes.querySelector('button')
    };
    const ratings = {
      likes: likes,
      dislikes: dislikes
    };
    this.back = {
      divBack: divBack,
      txtAnswer: divBack.querySelector('#answer'),
      divRatings: ratings
    };
    this.txtError = divQuiz.querySelector('#error');
    this.btnNext = divQuiz.querySelector('#btn');
  }
};

class Quiz {
  constructor () {
    this.currentQuestion = null;
  }
}

// Get DOM elements
const divQuizUI = document.getElementById('quiz');
const quizUI = new QuizUI(divQuizUI);

// Quiz Logic
const quiz = new Quiz();
quizUI.btnNext.addEventListener('click', (event) => {
  Next();
});

// TODO: encapsulate all quiz functions inside the quiz class
async function Next () {
  // If we don't have a question
  if (quiz.currentQuestion === null) {
    // Get a new Random Question
    quiz.currentQuestion = await getRandomQuestion();
    // If there where no errors getting a new question
    if (quiz.currentQuestion != null) {
      // Get the author of the question
      const author = await getAuthorFromQuestionID(quiz.currentQuestion.question_id);
      const authorName = (author === null) ? 'Unknown Author' : author.name;
      quizUI.front.txtAuthor.innerHTML = `- Question From ${authorName}`;

      // Write the Question to the Page
      quizUI.front.txtQuestion.innerHTML = quiz.currentQuestion.question;

      quizUI.back.divBack.classList.add('hidden');
      quizUI.back.txtAnswer.innerHTML = '';
      quizUI.back.divRatings.likes.text.innerHTML = `+ ${quiz.currentQuestion.rating.likes}`;
      quizUI.back.divRatings.dislikes.text.innerHTML = `- ${quiz.currentQuestion.rating.dislikes}`;

      quizUI.btnNext.innerHTML = 'Reveal Answer';

      // No Errors Detected
      quizUI.txtError.innerHTML = '';
      quizUI.txtError.classList.add('hidden');
    } else {
      // Coudn't Retrieve a question
      console.log('Failed to retrieve a question');
      quizUI.txtError.innerHTML = 'Server is Unresponsive, Please try again';
      quizUI.txtError.classList.remove('hidden');
    }
  } else {
    revealAnswer();
  }
}

async function getRandomQuestion () {
  try {
    const responce = await fetch('/rq/');
    const questionJson = await responce.text();
    const question = JSON.parse(questionJson);
    return await question;
  } catch (e) {
    alert(e);
    return null;
  }
}

async function getAuthorFromQuestionID (questionId) {
  try {
    const responce = await fetch(`/afqid/${questionId}`);
    const authorJson = await responce.text();
    const author = JSON.parse(authorJson);
    return author;
  } catch (e) {
    alert(e);
    return null;
  }
}

function revealAnswer () {
  quizUI.back.txtAnswer.innerHTML = quiz.currentQuestion.answer;
  quizUI.btnNext.innerHTML = 'Next Question';

  quizUI.back.divBack.classList.remove('hidden');

  quiz.currentQuestion = null;
}
