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
    // TODO: break hiding and showing of all buttons and text and what not for
    // start / ask / reveal answer into a method
    this.txtTopText = divQuiz.querySelector('#top_text');
    this.txtError = divQuiz.querySelector('#error');
    this.btnAskQuestion = divQuiz.querySelector('#btn_ask_question');
    this.btnRevealAnswer = divQuiz.querySelector('#btn_reveal_answer');
    this.btnStartQuiz = divQuiz.querySelector('#btn_start_quiz');
    this.btnEndQuiz = divQuiz.querySelector('#btn_end_quiz');
  };

  Initialise (quiz) {
    // UI Responce to Events

    // On Ask Question Event
    document.addEventListener('OnAskQuestionEvent', (e) => {
      const newQuestion = e.detail.question;
      if (newQuestion != null) {
        // Change the Top Text
        // TODO: replace the quiz methods with actual quiz method things to get thing
        this.txtTopText.innerHTML = `Question # ${quiz.currentQuestionIndex + 1} / ${quiz.questionSet.length}`;

        // Write the Question to the Page
        this.front.txtQuestion.innerHTML = newQuestion.question;

        this.back.divBack.classList.add('hidden');
        this.back.txtAnswer.innerHTML = '';
        this.back.divRatings.likes.text.innerHTML = `+ ${newQuestion.rating.likes}`;
        this.back.divRatings.dislikes.text.innerHTML = `- ${newQuestion.rating.dislikes}`;

        this.btnRevealAnswer.classList.remove('hidden');
        this.btnAskQuestion.classList.add('hidden');

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
    document.addEventListener('OnReceiveAuthorEvent', (e) => {
      const author = e.detail.author;
      const authorName = (author === null) ? 'Unknown Author' : author.name;
      this.front.txtAuthor.innerHTML = `- Question From ${authorName}`;
    });
    // Clicked Like Button
    this.back.divRatings.likes.button.addEventListener('click', (event) => {
      quiz.UpvoteCurrentQuestion();
    });
    // On Likes Count Updated Event
    document.addEventListener('olcue', (e) => {
      this.back.divRatings.likes.text.innerHTML = `+ ${e.detail.newLikesCount}`;
    });
    // Clicked Dislike Button
    this.back.divRatings.dislikes.button.addEventListener('click', (event) => {
      quiz.DownvoteCurrentQuestion();
    });
    // On Dislikes Count Updated Event
    document.addEventListener('odcue', (e) => {
      this.back.divRatings.dislikes.text.innerHTML = `- ${e.detail.newDislikesCount}`;
    });
    // Button that Starts the Quiz
    this.btnStartQuiz.addEventListener('click', async function (event) {
      // Get the question set
      if (quiz.questionSet === null) {
        const error = await quiz.InitializeQuestionSet();
        if (error) {
          // TODO: make this message visible to user
          quizUI.txtError.innerHTML = error.message;
          quizUI.txtError.classList.remove('hidden');
        } else {
          quiz.AskNextQuestion();
          quizUI.front.divFront.classList.remove('hidden');
          quizUI.btnStartQuiz.classList.add('hidden');
        }
      }
    });
    // Button That gets the next question
    this.btnAskQuestion.addEventListener('click', function (event) {
      // Ask the question
      quiz.AskNextQuestion();
    });
    // Button that Reveals the answer
    this.btnRevealAnswer.addEventListener('click', (event) => {
      this.RevealAnswer();
    });
  }

  RevealAnswer () {
    this.back.txtAnswer.innerHTML = quiz.currentQuestion.answer;
    this.btnAskQuestion.innerHTML = 'Next Question';
    this.back.divBack.classList.remove('hidden');
    this.btnRevealAnswer.classList.add('hidden');
    // TODO: abstract final question logic inside quiz
    // If we just revealed the answer for the final question
    if (quiz.currentQuestionIndex >= quiz.questionSet.length - 1) {
      this.btnEndQuiz.classList.remove('hidden');
    } else {
      // We have more questions to ask
      this.btnAskQuestion.classList.remove('hidden');
    }
  };
};

class Quiz {
  constructor () {
    this.currentQuestionIndex = -1;
    this.questionSet = null;

    this.currentQuestion = null;
  }

  async AskNextQuestion () {
    // CurrentQuestionIndex refers to the last question we got for certain from the server
    console.log(`remaining ${this.currentQuestionIndex} / ${this.questionSet.length}`);
    if (this.currentQuestionIndex >= this.questionSet.length - 1) {
      // We have reached the end of the question set
      console.log('end of questiosn0000');
    } else {
      // Get the next Question from the server
      const newQuestion = await this.GetQuestionFromQuestionId(this.questionSet[this.currentQuestionIndex + 1]);

      // If the request was valid
      if (newQuestion != null) {
        // We are now on the next question
        this.currentQuestionIndex += 1;
        this.currentQuestion = newQuestion;
        // Get the author of the question
        const author = await this.GetAuthorFromQuestionId(newQuestion.question_id);
        const OnRetrievedAuthorEvent = new CustomEvent('OnReceiveAuthorEvent', {
          detail: { author: author }
        });
        document.dispatchEvent(OnRetrievedAuthorEvent);
      }

      const OnAskQuestionEvent = new CustomEvent('OnAskQuestionEvent', {
        detail: {
          question: newQuestion
        }
      });
      document.dispatchEvent(OnAskQuestionEvent);
    }
  }

  async GetQuestionFromQuestionId (questionId) {
    try {
      const responce = await fetch(`/qfqid/${questionId}`);
      // TODO: add this line to every time i use fetch
      if (responce.status === 404) {
        throw new Error('404 Error!');
      }
      const question = await responce.text();
      return JSON.parse(question);
    } catch (e) {
      return null;
    }
  }

  // TODO: Figure out how to make this method private
  async GetAuthorFromQuestionId (questionId) {
    try {
      const responce = await fetch(`/afqid/${questionId}`);
      const authorJson = await responce.text();
      const author = JSON.parse(authorJson);
      return author;
    } catch (e) {
      return null;
    }
  };

  // TODO: Add parameters for only questions that match some conditions
  async InitializeQuestionSet () {
    try {
      const responce = await fetch('/qs/');
      const questionSetText = await responce.text();
      const questionSet = JSON.parse(questionSetText);
      if (questionSet.length <= 0) {
        return new Error('No Questions Avaliable');
      }
      this.questionSet = questionSet;
      return false;
    } catch (e) {
      return new Error('Unable to Connect to Server, Please try again');
    }
  }

  async UpvoteCurrentQuestion () {
    try {
      // POST Request with Fetch()
      // https://www.youtube.com/watch?v=Kw5tC5nQMRY
      const data = { question_id: this.questionSet[this.currentQuestionIndex] };
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };
      const responce = await fetch('/upvote', options);
      const json = await responce.json();
      const newLikesCount = json.data.likes;
      const OnLikesCountUpdatedEvent = new CustomEvent('olcue', {
        detail: { newLikesCount: newLikesCount }
      });
      document.dispatchEvent(OnLikesCountUpdatedEvent);
    } catch (e) {
      // TODO: Return true or false so the UI can handle it
      return null;
    }
  }

  async DownvoteCurrentQuestion () {
    try {
      // POST Request with Fetch()
      // https://www.youtube.com/watch?v=Kw5tC5nQMRY
      const data = { question_id: this.questionSet[this.currentQuestionIndex] };
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };
      const responce = await fetch('/downvote', options);
      const json = await responce.json();
      const newDislikesCount = json.data.dislikes;
      const OnDislikesCountUpdatedEvent = new CustomEvent('odcue', {
        detail: { newDislikesCount: newDislikesCount }
      });
      document.dispatchEvent(OnDislikesCountUpdatedEvent);
    } catch (e) {
      // TODO: Return true or false so the UI can handle it
      return null;
    }
  }
};

// Quiz Logic
const quiz = new Quiz();

// Get DOM elements
// Quiz UI
const divQuizUI = document.getElementById('quiz');
const quizUI = new QuizUI(divQuizUI);
quizUI.Initialise(quiz);