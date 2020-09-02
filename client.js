const API_URL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/tweet'
    : 'https://tranquil-hamlet-17420.herokuapp.com/tweet';

const tweetForm = document.querySelector('form');
const loadingSpiral = document.querySelector('.loading');
const spiralsElemDiv = document.querySelector('.spirals-list');
const loadMoreElem = document.querySelector('#loadMore');

let skip = 0;
let limit = 5;
let isLoading = false;
let finished = false;

loadingSpiral.style.display = '';

// switiching to an infinite scroll
document.addEventListener('scroll', () => {
  const rect = loadMoreElem.getBoundingClientRect();
  if (rect.top < window.innerHeight && !isLoading && !finished) {
    loadMore();
  }
});

// get all spirals from server
listAllSpirals();

tweetForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // Extract data from form
  const tweetFormData = new FormData(tweetForm);
  const name = tweetFormData.get('name');
  const tweet = tweetFormData.get('tweet');
  const tweetData = { name, tweet };

  // Update UI
  loadingSpiral.style.display = '';
  tweetForm.style.display = 'none';

  // send tweet to server
  fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(tweetData),
    headers: {
      'content-type': 'application/json',
    },
  })
    .then((resp) => resp.json())
    .then((createdspiral) => {
      listAllSpirals();
      // update UI Again & reset form data
      loadingSpiral.style.display = 'none';
      tweetForm.reset();

      // hide form for 10seconds
      setTimeout(() => {
        tweetForm.style.display = '';
      }, 5000);
    });
});

function listAllSpirals(reset = true) {
  if (reset) {
    // reset feed
    spiralsElemDiv.innerHTML = '';
    skip = 0;
    isLoading = false;
    finished = false;
  }
  fetch(`${API_URL}?skip=${skip}&limit=${limit}`)
    .then((resp) => resp.json())
    .then((resp) => {
      // console.log('spiralsData', resp.spirals);

      // update UI
      loadingSpiral.style.display = 'none';
      loadMoreElem.style.display = resp.meta.has_more ? '' : 'none';
      finished = !resp.meta.has_more;
      isLoading = false;

      resp.spirals.forEach((item) => {
        const div = document.createElement('div');
        const header = document.createElement('h3');
        const spiralInfo = document.createElement('p');
        const spiralDate = document.createElement('small');

        header.textContent = item.name;
        spiralInfo.textContent = item.tweet;
        spiralDate.textContent = new Date(item.created);

        div.appendChild(header);
        div.appendChild(spiralDate);
        div.appendChild(spiralInfo);
        spiralsElemDiv.appendChild(div);
      });
    });
}

function loadMore() {
  // console.log('@loadMore');
  skip += limit;
  isLoading = true;
  listAllSpirals(false);
}
