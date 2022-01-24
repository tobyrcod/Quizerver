// TODO: add sorting/filtering by author
// TODO: Get all questions by author
// TODO: Score of author by how their questions have been rated
const dBrowse = document.getElementById('browse');
const txtMessage = dBrowse.querySelector('#message');

class Browse {
  constructor (divBrowse) {
    this.form = divBrowse.querySelector('form');
    this.tableBody = divBrowse.querySelector('table tbody');
  }

  Reset () {
    this.form.reset();
    this.tableBody.innerHTML = '';
  }
}

class BrowseQuestions extends Browse {
  constructor (divBrowse) {
    super(divBrowse);
    this.selectGenre = this.form.querySelector('select#genre');
    this.selectAuthor = this.form.querySelector('select#authorName');
    this.selectSort = this.form.querySelector('select#sort');
  }

  // Sets up the Browse Questions section
  async Initialise () {
    // Add the Genres to the Dropdown Selection
    let addGenres = [];
    try {
      // Try to get the possible question browse genres
      const responce = await fetch('/get-genres');
      // If the genres data isnt avaliable
      if (responce.status === 404) {
        // Throw a 404 error
        throw new Error('404');
      } else {
        // The genres data was avaliable and returned as JSON
        const genresText = await responce.text();
        const genres = JSON.parse(genresText);

        // Save the genres to search but prepend an 'all' search
        // => 'all' isnt a type of question but we do want to be
        // able to search by it
        addGenres = [{ id: 'all', text: 'All' }].concat(genres);
      }
    } catch (e) {
      // Default values if we cannot access the server
      // or the server didnt have what we asked for
      addGenres = [{ id: 'all', text: 'All' }];
    }
    // For every genre, add the option to the genre dropdown menu
    addGenres.forEach(genre => {
      this.selectGenre.innerHTML += `<option value="${genre.id}">${genre.text}</option>`;
    });

    // Add the Authors to the Dropdown Selection
    let addAuthors = [];
    try {
      // Try to get the possible question browse authors
      const responce = await fetch('/get-authors');
      // If the authors data isnt avaliable
      if (responce.status === 404) {
        // Throw a 404 error
        throw new Error('404');
      } else {
        // The authors data was avaliable and returned as JSON
        const authors = await responce.json();
        // Make a new array to hold the authors in the correct format for the
        // select dropdown menu to be able to show them
        const selectAuthors = [];
        authors.forEach(author => {
          selectAuthors.push({
            id: author.author_id,
            text: author.name
          });
        });
        // Save the authors to search but prepend an 'all' search
        // => 'all' isnt a type of question but we do want to be
        // able to search by it
        addAuthors = [{ id: 'all', text: 'All' }].concat(selectAuthors);
      }
    } catch (e) {
      // Default values if we cannot access the server
      // or the server didnt have what we asked for
      addAuthors = [{ id: 'all', text: 'All' }];
    }
    // For every genre, add the option to the genre dropdown menu
    addAuthors.forEach(author => {
      this.selectAuthor.innerHTML += `<option value="${author.id}">${author.text}</option>`;
    });

    // Add the sort options to the Dropdown Selection
    let addSortOrders = [];
    try {
      // Try to get the different sort methods from server
      const responce = await fetch('/get-question-sorts');
      // If the sorts data isnt avaliable
      if (responce.status === 404) {
        // Throw a new 404 error
        throw new Error('404');
      } else {
        // The sorts data was avaliable and returned as JSON
        const sortsText = await responce.text();
        const sorts = JSON.parse(sortsText);

        // Save the sorts so we can apply them to the select dropdown menu
        addSortOrders = sorts;
      }
    } catch (e) {
      // We coudn't connect to the server

      // Default values if we cannot access the server
      addSortOrders = [{ id: 'alpha', text: 'Alphabetical' }];
    }
    // For every way to sort the questions, add the option to the sort dropdown menu
    addSortOrders.forEach(sort => {
      this.selectSort.innerHTML += `<option value="${sort.id}">${sort.text}</option>`;
    });

    // On Filter Questions Form Submitted
    this.form.addEventListener('submit', (event) => this.SubmitQuestionForm(event));
  }

  // Handle to Question Request Form being submitted
  async SubmitQuestionForm (event) {
    // Stop the form from being submitted
    event.preventDefault();

    // Get the data from the form
    const data = new FormData(this.form);
    // Get the parameters from the query
    const params = new URLSearchParams(data);
    // Make the GET request
    // Get the question set
    const info = await this.GetQuestionSetInfo(params);
    // If we came across an error while getting the question set
    if (info.error_message !== null) {
      // Display this error to the user
      txtMessage.innerHTML = info.error_message;
      txtMessage.classList.remove('hidden');
      browseQuestions.tableBody.innerHTML = '';
    } else {
      // Display info in table

      // Get the question set
      const questionSet = info.questionSet;

      // Open a string to start building the inner HTML of the table
      let tblHTML = '';

      // For every question in the question set
      for (let i = 0; i < questionSet.length; i++) {
        // Add all of the questions attributes to a row
        const questionInfo = questionSet[i];
        let qsHTML = '';
        qsHTML += '<tr>';
        qsHTML += `<th scope="row">${i}</th>`;
        qsHTML += `<td>${questionInfo.question}</td>`;
        qsHTML += `<td>${questionInfo.answer}</td>`;
        qsHTML += `<td>${questionInfo.authorName}</td>`;
        qsHTML += `<td>${questionInfo.rating.likes} ^</td>`;
        qsHTML += `<td>${questionInfo.rating.dislikes} v</td>`;
        qsHTML += '</tr>';

        // Append this row to the table HTML
        tblHTML += qsHTML;
      };

      // Apply the table HTML to the table
      this.tableBody.innerHTML = tblHTML;

      // Handle the Message Box
      txtMessage.innerHTML = '';
      txtMessage.classList.add('hidden');
    }
  }

  // Function to Retrieve all the information about all questions
  // which match a specific search query
  async GetQuestionSetInfo (params) {
    // Try to get all the questions that match this query
    try {
      // Get the set of question infos based on the parameters
      const responce = await fetch('/get-question-info-set?' + params);
      // If we succesfully retrieved a question set
      if (responce.status === 200) {
        // Get the question set as JSON
        const questionSetText = await responce.text();
        const questionSet = JSON.parse(questionSetText);

        // If we have no questions that match this query
        if (questionSet.length <= 0) {
          // NOTE: this isn't an error, having nothing is a valid result
          return { questionSet: null, error_message: 'No Questions Avaliable' };
        }

        // If we have questions to display
        return { questionSet: questionSet, error_message: null };
      } else {
        // The query wasn't valid
        return { questionSet: null, error_message: 'Invalid Search Query' };
      }
    } catch (e) {
      // We failed to connect to the server
      return { questionSet: null, error_message: 'Unable to Connect to Server, Please try again' };
    }
  };
}

class BrowseAuthors extends Browse {
  constructor (divBrowse) {
    super(divBrowse);
    this.selectAuthor = this.form.querySelector('select#authorName');
    this.selectSort = this.form.querySelector('select#sort');
  }

  async Initialise () {
    // Add the Authors to the Dropdown Selection
    let addAuthors = [];
    try {
      // Try to get the possible question browse authors
      const responce = await fetch('/get-authors');
      // If the authors data isnt avaliable
      if (responce.status === 404) {
        // Throw a 404 error
        throw new Error('404');
      } else {
        // The authors data was avaliable and returned as JSON
        const authors = await responce.json();
        // Make a new array to hold the authors in the correct format for the
        // select dropdown menu to be able to show them
        const selectAuthors = [];
        authors.forEach(author => {
          selectAuthors.push({
            id: author.author_id,
            text: author.name
          });
        });
        // Save the authors to search but prepend an 'all' search
        // => 'all' isnt a type of question but we do want to be
        // able to search by it
        addAuthors = [{ id: 'all', text: 'All' }].concat(selectAuthors);
      }
    } catch (e) {
      // Default values if we cannot access the server
      // or the server didnt have what we asked for
      addAuthors = [{ id: 'all', text: 'All' }];
    }
    // For every genre, add the option to the genre dropdown menu
    addAuthors.forEach(author => {
      this.selectAuthor.innerHTML += `<option value="${author.id}">${author.text}</option>`;
    });

    // Add the sort options to the Dropdown Selection
    let addSortOrders = [];
    try {
      // Try to get the different sort methods from server
      const responce = await fetch('/get-author-sorts');
      // If the sorts data isnt avaliable
      if (responce.status === 404) {
        // Throw a new 404 error
        throw new Error('404');
      } else {
        // The sorts data was avaliable and returned as JSON
        const sortsText = await responce.text();
        const sorts = JSON.parse(sortsText);

        // Save the sorts so we can apply them to the select dropdown menu
        addSortOrders = sorts;
      }
    } catch (e) {
      // We coudn't connect to the server

      // Default values if we cannot access the server
      addSortOrders = [{ id: 'alpha', text: 'Alphabetical' }];
    }
    // For every way to sort the questions, add the option to the sort dropdown menu
    addSortOrders.forEach(sort => {
      this.selectSort.innerHTML += `<option value="${sort.id}">${sort.text}</option>`;
    });

    // On Filter Authors Form Submitted
    this.form.addEventListener('submit', (event) => this.SubmitAuthorsForm(event));
  }

  // Handle Author Request Form being submitted
  async SubmitAuthorsForm (event) {
    // Stop the form from being submitted
    event.preventDefault();

    // Get the data from the form
    const data = new FormData(this.form);
    // Get the parameters from the query
    const params = new URLSearchParams(data);
    // Make the GET request
    // Get the question set
    const info = await this.GetAuthorSetInfo(params);
    // If we came across an error while getting the question set
    if (info.error_message !== null) {
      // Display this error to the user
      txtMessage.innerHTML = info.error_message;
      txtMessage.classList.remove('hidden');
      browseQuestions.tableBody.innerHTML = '';
    } else {
      // Display info in table

      // Get the question set
      const authorInfoSet = info.authorInfoSet;

      // Open a string to start building the inner HTML of the table
      let tblHTML = '';

      // For every question in the question set
      for (let i = 0; i < authorInfoSet.length; i++) {
        // Add all of the questions attributes to a row
        const authorInfo = authorInfoSet[i];
        let qsHTML = '';
        qsHTML += '<tr>';
        qsHTML += `<th scope="row">${i}</th>`;
        qsHTML += `<td>${authorInfo.name}</td>`;
        qsHTML += `<td>${authorInfo.question_count}</td>`;
        qsHTML += `<td>${authorInfo.favourite_genre}</td>`;
        qsHTML += `<td>${authorInfo.author_score}</td>`;
        qsHTML += '</tr>';

        // Append this row to the table HTML
        tblHTML += qsHTML;
      };

      // Apply the table HTML to the table
      this.tableBody.innerHTML = tblHTML;

      // Handle the Message Box
      txtMessage.innerHTML = '';
      txtMessage.classList.add('hidden');
    }
  }

  // Function to Retrieve all the information about all authors
  // which match a specific search query
  async GetAuthorSetInfo (params) {
    // Try to get all the authors that match this query
    try {
      // Get the set of author infos based on the parameters
      const responce = await fetch('/get-author-info-set?' + params);
      // If we succesfully retrieved an author set
      if (responce.status === 200) {
        // Get the author set as JSON
        const authorSet = await responce.json();

        // If we have no authors that match this query
        if (authorSet.length <= 0) {
          // NOTE: this isn't an error, having nothing is a valid result
          return { authorInfoSet: null, error_message: 'No Authors Avaliable' };
        }

        // If we have authors to display
        return { authorInfoSet: authorSet, error_message: null };
      } else {
        // The query wasn't valid
        return { authorInfoSet: null, error_message: 'Invalid Search Query' };
      }
    } catch (e) {
      // We failed to connect to the server
      return { authorInfoSet: null, error_message: 'Unable to Connect to Server, Please try again' };
    }
  }
}

const browseAreas = {
  questions: 'questions',
  authors: 'authors'
};

const browseStates = {
  questions: true,
  authors: false
};

const divBrowseQuestions = dBrowse.querySelector('#browse_questions');
const browseQuestions = new BrowseQuestions(divBrowseQuestions);

const divBrowseAuthors = dBrowse.querySelector('#browse_authors');
const browseAuthors = new BrowseAuthors(divBrowseAuthors);

const browseDivs = {
  questions: divBrowseQuestions,
  authors: divBrowseAuthors
};

const btnQuestions = dBrowse.querySelector('button#question');
const btnAuthors = dBrowse.querySelector('button#author');

const browseButtons = {
  questions: btnQuestions,
  authors: btnAuthors
};

const btnReset = dBrowse.querySelector('button#reset');
btnReset.addEventListener('click', (event) => {
  browseQuestions.Reset();
  browseAuthors.Reset();
    // Handle the Message Box
    txtMessage.innerHTML = '';
    txtMessage.classList.add('hidden');
});

// On DOM (page) loaded
window.addEventListener('DOMContentLoaded', async function (event) {
  browseQuestions.Initialise();
  browseAuthors.Initialise();

  btnQuestions.addEventListener('click', () => ShowBrowse(browseAreas.questions));
  btnAuthors.addEventListener('click', () => ShowBrowse(browseAreas.authors));
  ShowBrowse(browseAreas.questions);
});

function ShowBrowse (browseArea) {
  for (const key in browseStates) {
    browseStates[key] = false;
  }

  browseStates[browseArea] = true;
  for (const key in browseStates) {
    browseDivs[key].classList.toggle('hidden', !browseStates[key]);
    browseButtons[key].classList.toggle('active', browseStates[key]);
  }
}
