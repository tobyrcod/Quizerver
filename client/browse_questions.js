// TODO: add sorting/filtering by author
// TODO: Get all questions by author
// TODO: Score of author by how their questions have been rated
const dBrowse = document.getElementById('browse');
const frmFilter = dBrowse.querySelector('form');
const txtMessage = dBrowse.querySelector('#message');
const tblBody = dBrowse.querySelector('table tbody');

// On DOM (page) loaded
window.addEventListener('DOMContentLoaded', async function (event) {
  // Add the Genres to the Dropdown Selection
  const selectGenre = frmFilter.querySelector('select#genre');
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
  addGenres.forEach(genre => {
    selectGenre.innerHTML += `<option value="${genre.id}">${genre.text}</option>`;
  });

  // Add the sort options to the Dropdown Selection
  const selectSort = frmFilter.querySelector('select#sort');
  let addSortOrders = [];
  try {
    // Try to get the different sort methods from server
    const responce = await fetch('/get-sorts');
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
    addSortOrders = [{ id: 'alphDesc', text: 'Alphabet Decending' }];
  }

  // For every way to sort the questions, add the option to the sort dropdown menu
  addSortOrders.forEach(sort => {
    selectSort.innerHTML += `<option value="${sort.id}">${sort.text}</option>`;
  });
});

// On Filter Questions Form Submitted
frmFilter.addEventListener('submit', async function (event) {
  // Stop the form from being submitted
  event.preventDefault();

  // Get the data from the form
  const data = new FormData(frmFilter);
  // Get the parameters from the query
  const params = new URLSearchParams(data);
  // Make the GET request
  // Get the question set
  const info = await GetQuestionSetInfo(params);
  // If we came across an error while getting the question set
  if (info.error_message !== null) {
    // Display this error to the user
    txtMessage.innerHTML = info.error_message;
    txtMessage.classList.remove('hidden');
    tblBody.innerHTML = '';
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
      qsHTML += `<td>${questionInfo.rating.likes} ^</td>`;
      qsHTML += `<td>${questionInfo.rating.dislikes} v</td>`;
      qsHTML += '</tr>';

      // Append this row to the table HTML
      tblHTML += qsHTML;
    };

    // Apply the table HTML to the table
    tblBody.innerHTML = tblHTML;

    // Handle the Message Box
    txtMessage.innerHTML = '';
    txtMessage.classList.add('hidden');
  }
});

// Function to Retrieve all the information about all questions
// which match a specific search query
async function GetQuestionSetInfo (params) {
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
