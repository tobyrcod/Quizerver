const dBrowse = document.getElementById('browse');
const frmFilter = dBrowse.querySelector('form');
const txtMessage = dBrowse.querySelector('#message');
const tblBody = dBrowse.querySelector('table tbody');

// Add the Genres to the Dropdown Selection
window.addEventListener('DOMContentLoaded', async function (event) {
  const selectGenre = frmFilter.querySelector('select');
  let addGenres = [];
  try {
    const responce = await fetch('/get-genres');
    if (responce.status !== 200) {
      throw new Error('Server Unresponsive');
    } else {
      const genresText = await responce.text();
      const genres = JSON.parse(genresText);
      addGenres = genres;
    }
  } catch (e) {
    // Default values if for some reason we
    // cannot access the server
    addGenres = [{ id: 'other', text: 'Other' }];
  }

  addGenres.forEach(genre => {
    selectGenre.innerHTML += `<option value="${genre.id}">${genre.text}</option>`;
  });
});

// Filter Questions Form
frmFilter.addEventListener('submit', async function (event) {
  // Stop the form from being submitted
  event.preventDefault();

  // Get the data from the form
  const data = new FormData(frmFilter);
  // Get the parameters from the query
  const params = new URLSearchParams(data);
  // Make the GET request. Get the question set
  const info = await GetQuestionSetInfo(params);
  if (info.error_message !== null) {
    txtMessage.innerHTML = info.error_message;
    txtMessage.classList.remove('hidden');
    tblBody.innerHTML = '';
  } else {
    // Display info in table
    // Open the table body
    const questionSet = info.questionSet;
    let tblHTML = '';
    questionSet.forEach(questionInfo => {
      let qsHTML = '';
      qsHTML += '<tr>';
      qsHTML += `<th scope="row">${questionInfo.question_id}</th>`;
      qsHTML += `<td>${questionInfo.question}</td>`;
      qsHTML += `<td>${questionInfo.answer}</td>`;
      qsHTML += '</tr>';
      tblHTML += qsHTML;
    });

    tblBody.innerHTML = tblHTML;

    // Handle the Message Box
    txtMessage.innerHTML = '';
    txtMessage.classList.add('hidden');
  }
});

async function GetQuestionSetInfo (params) {
  // Try to get all the questions that match this query
  try {
    const responce = await fetch('/get-question-info-set?' + params);
    if (responce.status === 404) {
      return { questionSet: null, error_message: '404 Error!' };
    }

    const questionSetText = await responce.text();
    const questionSet = JSON.parse(questionSetText);
    if (questionSet.length <= 0) {
      return { questionSet: null, error_message: 'No Questions Avaliable' };
    }

    return { questionSet: questionSet, error_message: null };
  } catch (e) {
    return { questionSet: null, error_message: 'Unable to Connect to Server, Please try again' };
  }
};
