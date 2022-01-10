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
    this.btnProceed = divQuiz.querySelector('#btn');
  };

  Initialise (quiz) {
    // UI Responce to Events

    // On Recieved New Question Event
    document.addEventListener('ornqe', (e) => {
      const newQuestion = e.detail.question;
      if (newQuestion != null) {
        // Write the Question to the Page
        this.front.txtQuestion.innerHTML = newQuestion.question;

        this.back.divBack.classList.add('hidden');
        this.back.txtAnswer.innerHTML = '';
        this.back.divRatings.likes.text.innerHTML = `+ ${newQuestion.rating.likes}`;
        this.back.divRatings.dislikes.text.innerHTML = `- ${newQuestion.rating.dislikes}`;

        this.btnProceed.innerHTML = 'Reveal Answer';

        // No Errors Detected
        this.txtError.innerHTML = '';
        this.txtError.classList.add('hidden');
      } else {
        // Coudn't Retrieve a question
        this.txtError.innerHTML = 'Server is Unresponsive, Please try again';
        this.txtError.classList.remove('hidden');
      }
    });
    // On Recieved Author Event
    document.addEventListener('orae', (e) => {
      const author = e.detail.author;
      const authorName = (author === null) ? 'Unknown Author' : author.name;
      this.front.txtAuthor.innerHTML = `- Question From ${authorName}`;
    });
    // Clicked Like Button
    this.back.divRatings.likes.button.addEventListener('click', (event) => {
      alert('upvote');
    });
    // Clicked Dislike Button
    this.back.divRatings.dislikes.button.addEventListener('click', (event) => {
      alert('downvote');
    });

    // Proceed Button
    this.btnProceed.addEventListener('click', (event) => {
      if (quiz.currentQuestionInfo === null) {
        quiz.UpdateQuestionInfo();
      } else {
        this.RevealAnswer();
      }
    });
  }

  RevealAnswer () {
    this.back.txtAnswer.innerHTML = quiz.currentQuestionInfo.question.answer;
    this.btnProceed.innerHTML = 'Next Question';
    this.back.divBack.classList.remove('hidden');

    quiz.currentQuestionInfo = null;
  };
};

class QuestionInfo {
  constructor (question, author) {
    this.question = question;
    this.author = author;
  };
}
class Quiz {
  constructor () {
    this.currentQuestionInfo = null;
  }

  // TODO: Figure out how to make this method private
  async GetRandomQuestion () {
    try {
      const responce = await fetch('/rq/');
      const questionJson = await responce.text();
      const question = JSON.parse(questionJson);
      return await question;
    } catch (e) {
      return null;
    }
  };

  // TODO: Figure out how to make this method private
  async GetAuthorFromQuestionID (questionId) {
    try {
      const responce = await fetch(`/afqid/${questionId}`);
      const authorJson = await responce.text();
      const author = JSON.parse(authorJson);
      return author;
    } catch (e) {
      return null;
    }
  };

  UpdateCurrentQuestionInfo (newQuestionInfo) {
    this.currentQuestionInfo = newQuestionInfo;
  }

  async UpdateQuestionInfo () {
    // Get a new Random Question
    const newQuestion = await this.GetRandomQuestion();
    const OnRetrievedNewQuestionEvent = new CustomEvent('ornqe', {
      detail: { question: newQuestion }
    });
    document.dispatchEvent(OnRetrievedNewQuestionEvent);
    // If there where no errors getting a new question
    if (newQuestion != null) {
      // Get the author of the question
      const author = await this.GetAuthorFromQuestionID(newQuestion.question_id);
      const OnRetrievedAuthorEvent = new CustomEvent('orae', {
        detail: { author: author }
      });
      document.dispatchEvent(OnRetrievedAuthorEvent);

      this.UpdateCurrentQuestionInfo(new QuestionInfo(newQuestion, author));
    };
  };
};

// Quiz Logic
const quiz = new Quiz();

// Get DOM elements
// Quiz UI
const divQuizUI = document.getElementById('quiz');
const quizUI = new QuizUI(divQuizUI);
quizUI.Initialise(quiz);
