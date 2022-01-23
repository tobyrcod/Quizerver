// TODO: document everything
// Quiz UI Class to handle all the UI changes and responces to user input
class QuizUI {
  // Gets all the DOM elements needed for the Quiz and organises them
  // in an easy to access hierarchical structure
  constructor (divQuiz) {
    const divFront = divQuiz.querySelector('#front');
    this.front = {
      divFront: divFront,
      txtQuestion: divFront.querySelector('#question'),
      txtAuthor: divQuiz.querySelector('#author')
    };

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
    this.txtTopText = divQuiz.querySelector('#top_text');
    this.txtError = divQuiz.querySelector('#error');

    this.divSetup = divQuiz.querySelector('#setup');
    this.divAsking = divQuiz.querySelector('#asking');

    this.btnAskQuestion = divQuiz.querySelector('#btn_ask_question');
    this.btnRevealAnswer = divQuiz.querySelector('#btn_reveal_answer');
    this.btnEndQuiz = divQuiz.querySelector('#btn_end_quiz');

    this.frmQuizSetup = divQuiz.querySelector('#setup form');
    this.selectGenre = this.frmQuizSetup.querySelector('select');
    this.rangeCount = this.frmQuizSetup.querySelector('#question_count');
    this.rangeCountOutput = this.frmQuizSetup.querySelector('#range_count_output');
  };

  // Sets up the Quiz UI and connect it to the quiz logic
  // TODO: document
  Initialise (quiz) {
    // Load the Genres
    this.LoadGenres();

    this.rangeCountOutput.innerHTML = this.rangeCount.value;
    this.rangeCount.addEventListener('input', () => {
      this.rangeCountOutput.innerHTML = this.rangeCount.value;
    }, false);

    // UI Responce to Events
    // On Ask Question Event
    document.addEventListener('OnAskQuestionEvent', (e) => {
      const newQuestion = e.detail.question;
      if (newQuestion != null) {
        // Change the Top Text
        this.txtTopText.innerHTML = `Question # ${quiz.currentQuestionIndex + 1} / ${quiz.questionIDSet.length}`;

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
    this.back.divRatings.likes.button.addEventListener('click', async function (event) {
      const error = await quiz.UpvoteCurrentQuestion();
      if (error) {
        quizUI.txtError.innerHTML = error.message;
        quizUI.txtError.classList.remove('hidden');
      } else {
        quizUI.txtError.classList.add('hidden');
        quizUI.txtError.innerHTML = '';
      }
    });
    // On Likes Count Updated Event
    document.addEventListener('olcue', (e) => {
      this.back.divRatings.likes.text.innerHTML = `+ ${e.detail.newLikesCount}`;
    });
    // Clicked Dislike Button
    this.back.divRatings.dislikes.button.addEventListener('click', async function (event) {
      const error = await quiz.DownvoteCurrentQuestion();
      if (error) {
        quizUI.txtError.innerHTML = error.message;
        quizUI.txtError.classList.remove('hidden');
      } else {
        quizUI.txtError.classList.add('hidden');
        quizUI.txtError.innerHTML = '';
      }
    });
    // On Dislikes Count Updated Event
    document.addEventListener('odcue', (e) => {
      this.back.divRatings.dislikes.text.innerHTML = `- ${e.detail.newDislikesCount}`;
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
    // Button that ends the quiz
    this.btnEndQuiz.addEventListener('click', (event) => {
      this.EndQuiz();
    });
    // Button that Starts the Quiz
    this.frmQuizSetup.addEventListener('submit', async function (event) {
      // POST method as seen in the Goats Example
      // https://github.com/stevenaeola/goats/blob/main/client/script.js

      // Stop the form from being submitted
      event.preventDefault();

      // Get the data from the form
      const data = new FormData(quizUI.frmQuizSetup);
      // Get the parameters from the query
      const params = new URLSearchParams(data);
      // Make the GET request. Get the question set
      const error = await quiz.InitializeQuestionSet(params);
      // If we returned an error
      if (error) {
        // Display the error message to the user
        quizUI.txtError.innerHTML = error.message;
        quizUI.txtError.classList.remove('hidden');
      } else {
        // We succesfully got the question set

        // Setup the UI to display the quiz and ask the first question
        quiz.AskNextQuestion();
        quizUI.frmQuizSetup.reset();
        quizUI.divSetup.classList.add('hidden');
        quizUI.divAsking.classList.remove('hidden');
        quizUI.btnEndQuiz.classList.remove('hidden');
      }
    });
  }

  // Gets the possible Question Genres from the server and
  // adds them as options to the dropdown select option
  async LoadGenres () {
    let filterGenres = [];
    try {
      // Try to get the possible question genres from the server
      const responce = await fetch('/get-genres');
      // If the genres data isn't avaliable
      if (responce.status === 404) {
        // Throw a 404 error
        throw new Error('404');
      } else {
        // The genres data was avaliable and returned as JSON
        const genresText = await responce.text();
        const genres = JSON.parse(genresText);

        // Save the genres so we can apply them to the drop down menu
        // prepend 'all' becuase while all isnt a genre itself, we do
        // want to be able to search by it
        filterGenres = [{ id: 'all', text: 'All' }].concat(genres);
      }
    } catch (e) {
      // Default values if we cannot access the server
      // or the genres data wasn't avaliable from the server
      filterGenres = [{ id: 'all', text: 'All' }];
    }

    // Add the filters to the filter drop down menu
    filterGenres.forEach(genre => {
      this.selectGenre.innerHTML += `<option value="${genre.id}">${genre.text}</option>`;
    });
  }

  // Reveal the answer of the question that is being asked
  RevealAnswer () {
    this.back.txtAnswer.innerHTML = quiz.currentQuestion.answer;
    this.btnAskQuestion.innerHTML = 'Next Question';
    this.back.divBack.classList.remove('hidden');
    this.btnRevealAnswer.classList.add('hidden');
    // If we have more questions to ask
    if (!quiz.IsFinished()) {
      // Show the next Question Button
      this.btnAskQuestion.classList.remove('hidden');
    }
  };

  // Ends the Quiz and Resets the UI back to the home page
  EndQuiz () {
    quiz.Reset();
    this.btnEndQuiz.classList.add('hidden');
    this.btnRevealAnswer.classList.add('hidden');
    this.btnAskQuestion.classList.add('hidden');
    this.divAsking.classList.add('hidden');
    this.divSetup.classList.remove('hidden');
    this.txtTopText.innerHTML = 'Start the Quiz now!';
    this.txtError.classList.add('hidden');
    this.txtError.innerHTML = '';
    this.rangeCountOutput.innerHTML = this.rangeCount.value;
  };
};

// Quiz Class to handle all Question Asking Logic
class Quiz {
  constructor () {
    // Integer representing the current index of the questions being asked
    this.currentQuestionIndex = -1;
    // List of the Ids of all the Questions to be asked by the Quiz
    this.questionIDSet = null;
    // The Question Object that is currently being asked
    this.currentQuestion = null;
  }

  // Reset the values of the attributes of the quiz
  // ready for another round of questions
  Reset () {
    this.currentQuestionIndex = -1;
    this.questionIDSet = null;

    this.currentQuestion = null;
  }

  // Gets the next question from the server and sets it as the new current Question
  async AskNextQuestion () {
    // CurrentQuestionIndex refers to the last question we got for certain from the server

    // If we have more questions to ask
    if (!this.IsFinished()) {
      try {
        // Try to get the next Question from the server
        const newQuestion = await this.GetQuestionFromQuestionId(this.questionIDSet[this.currentQuestionIndex + 1]);
        // If the request was invalid
        if (newQuestion === null) {
          // Throw an error
          throw new Error('Could not get the next question, please try again');
        }

        // We got the new question succesfully

        // We are now on the next question
        this.currentQuestionIndex += 1;
        this.currentQuestion = newQuestion;

        // Try to get the author of the question
        const author = await this.GetAuthorFromQuestionId(newQuestion.question_id);
        // If the request was invalid
        if (author === null) {
          // Throw an error
          throw new Error('Could not get the next author, please try again');
        }

        // We succesully got the new question and author of the question
        const OnRetrievedAuthorEvent = new CustomEvent('OnReceiveAuthorEvent', {
          detail: { author: author }
        });
        document.dispatchEvent(OnRetrievedAuthorEvent);

        const OnAskQuestionEvent = new CustomEvent('OnAskQuestionEvent', {
          detail: {
            question: newQuestion
          }
        });
        document.dispatchEvent(OnAskQuestionEvent);

        // No Errors Detected
        quizUI.txtError.innerHTML = '';
        quizUI.txtError.classList.add('hidden');
      } catch (e) {
        // We failed to retrieve a new question

        // We don't need to tell the user how it failed though as it isn't under
        // Their control, instead just display a generic error message
        quizUI.txtError.innerHTML = 'Could not get the next question, please try again';
        quizUI.txtError.classList.remove('hidden');
      }
    }
  }

  // Gets the Question JSON from a question Id
  async GetQuestionFromQuestionId (questionId) {
    try {
      // Try to get the question from id from the server
      const responce = await fetch(`/qfqid/${questionId}`);
      // If the server responce was valid
      if (responce.status === 200) {
        // Get the question JSON from the responce
        const question = await responce.json();
        // return the question
        return question;
      } else {
        // No question with that Id could be found.
        // As for this website no questions can be deleted,
        // so this is a catastrophic error somewhere as all the ids,
        // came from the server
        throw new Error('No Question Found with this Id');
      }
    } catch (e) {
      // We cound't reach the server or
      // no question could be found with this id

      // In this specific case, we dont care what the error is,
      // only that there was one
      return null;
    }
  }

  // Gets the author of a question from its question Id
  async GetAuthorFromQuestionId (questionId) {
    try {
      // Try to get the author from id from the server
      const responce = await fetch(`/afqid/${questionId}`);
      // If the server responce was valid
      if (responce.status === 200) {
        // Get the author JSON from responce
        const authorJson = await responce.text();
        const author = JSON.parse(authorJson);

        // Return the author
        return author;
      } else {
        // No author with that Id could be found.
        throw new Error('No Author Found with this Id');
      }
    } catch (e) {
      // We cound't reach the server or
      // no author could be found with this id

      // In this specific case, we dont care what the error is,
      // only that there was one
      return null;
    }
  };

  // Gets the set of questions to be asked by the quiz based on the
  // quiz options from the 'Start Quiz' option select screen
  async InitializeQuestionSet (params) {
    try {
      // Try to get the question set from the server
      const responce = await fetch('/get-question-id-set?' + params);
      // If the responce was valid
      if (responce.status === 200) {
        // Get the question id set in JSON
        const questionIdSetText = await responce.text();
        const questionIdSet = JSON.parse(questionIdSetText);

        // If we received no questions which match the query
        if (questionIdSet.length <= 0) {
          // return an appropriate error
          return new Error('No Questions Avaliable');
        }

        // Reset the quiz and set it up for playing again
        this.Reset();
        this.questionIDSet = questionIdSet;

        // Return that no error occured
        return false;
      } else {
        // The responce from the server wasn't valid

        // Get the error message from the server
        const json = await responce.json();
        // Return a new error with this message
        return new Error(json.message);
      }
    } catch (e) {
      // We coudn't reach the server at all
      return new Error('Unable to Connect to Server, Please try again');
    }
  }

  // Adds one Upvote to the ratings counter of the current question
  // Upvoting/Downvoting is an update method, not a GET or POST,
  // I added it to make playing the quiz and sorting questions / authors more fun
  async UpvoteCurrentQuestion () {
    try {
      // POST Request with Fetch()
      // https://www.youtube.com/watch?v=Kw5tC5nQMRY

      // Get the id of the question you want to upvote
      const data = { question_id: this.questionIDSet[this.currentQuestionIndex] };
      // Try to upvote the question and get the new likes count
      const responce = await fetch(`/upvote/${data.question_id}`, { method: 'POST' });
      // If the responce was valid
      if (responce.status === 200) {
        // Get the new likes count JSON
        const json = await responce.json();
        const newLikesCount = json.likes;
        // Invoke the On Likes Count Updated Event
        // The UI listens to this and will update the text
        const OnLikesCountUpdatedEvent = new CustomEvent('olcue', {
          detail: { newLikesCount: newLikesCount }
        });
        document.dispatchEvent(OnLikesCountUpdatedEvent);

        // Return that no error occured
        return false;
      } else {
        // The responce from the server wasnt valid

        // Get the error message from the server
        const json = await responce.json();
        // throw and appropriate error
        throw new Error(json.message);
      }
    } catch (e) {
      // We coudn't connect to the server
      // we dont need to tell the user what the error was,
      // as it wasn't under their control so we just
      // need to tell them that an error occured, so return a simple message
      return new Error('Could not upvote question, please try again');
    }
  }

  // Adds one Downvote to the ratings counter of the current question
  // Upvoting/Downvoting is an update method, not a GET or POST,
  // I added it to make playing the quiz and sorting questions / authors more fun
  async DownvoteCurrentQuestion () {
    try {
      // POST Request with Fetch()
      // https://www.youtube.com/watch?v=Kw5tC5nQMRY

      // Get the id of the question you want to downvote
      const data = { question_id: this.questionIDSet[this.currentQuestionIndex] };
      // Try to downvote the question and get the new dislikes count
      const responce = await fetch(`/downvote/${data.question_id}`, { method: 'POST' });
      // If the responce was valid
      if (responce.status === 200) {
        // Get the new dislikes count
        const json = await responce.json();
        const newDislikesCount = json.dislikes;
        // Invoke the On Dislikes Count Updated Event
        // The UI listens to this and will update the text
        const OnDislikesCountUpdatedEvent = new CustomEvent('odcue', {
          detail: { newDislikesCount: newDislikesCount }
        });
        document.dispatchEvent(OnDislikesCountUpdatedEvent);

        // return that no error occured
        return false;
      } else {
        // The responce from the server wasnt valid

        // Get the error message from the server
        const json = await responce.json();
        // throw an appropriate error message
        throw new Error(json.message);
      }
    } catch (e) {
      // We coudn't connect to the server
      // we dont need to tell the user what the error was,
      // as it wasn't under their control so we just
      // need to tell them that an error occured, so return a simple message
      return new Error('Could not downvote question, please try again');
    }
  }

  // Returns true or false depending of if we have reached the last index of the question set
  IsFinished () {
    return quiz.currentQuestionIndex >= quiz.questionIDSet.length - 1;
  }
};

// Make a new Quiz
const quiz = new Quiz();

// Get DOM elements

// Quiz UI
const divQuizUI = document.getElementById('quiz');
const quizUI = new QuizUI(divQuizUI);
// Connect the UI to the quiz Object
quizUI.Initialise(quiz);
