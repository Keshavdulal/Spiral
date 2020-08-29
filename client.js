const API_URL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/tweet'
    : 'https://tranquil-hamlet-17420.herokuapp.com/tweet';

const tweetForm = document.querySelector('form');
const loadingSpiral = document.querySelector('.loading');
const xpiralsElemDiv = document.querySelector('.xpirals-list');
const loadMoreElem = document.querySelector('#loadMore');

let skip = 0;
let limit = 5;
let isLoading = false;
let finished = false;

loadingSpiral.style.display = '';
// loadMoreElem.style.display = 'none';

// loadMoreButton.addEventListener('click', loadMore);
// switiching to ♾ scroll
document.addEventListener('scroll', () => {
  const rect = loadMoreElem.getBoundingClientRect();
  if (rect.top < window.innerHeight && !isLoading && !finished) {
    loadMore();
  }
});

// get all xpirals from server
listAllXpirals();

tweetForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // 1. Extract data from Form
  const tweetFormData = new FormData(tweetForm);
  const name = tweetFormData.get('name');
  const tweet = tweetFormData.get('tweet');
  const tweetData = { name, tweet };
  // console.log('Sending frontend data 🌈 ', tweetData);

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
    .then((createdXpiral) => {
      listAllXpirals();
      // console.log('🌈🌈', createdXpiral);
      // update UI Again & reset form data
      loadingSpiral.style.display = 'none';
      tweetForm.reset();

      // hide form for 10seconds
      setTimeout(() => {
        tweetForm.style.display = '';
      }, 5000);
    });
});

function listAllXpirals(reset = true) {
  if (reset) {
    // reset feed
    xpiralsElemDiv.innerHTML = '';
    skip = 0;
    isLoading = false;
    finished = false;
  }
  fetch(`${API_URL}?skip=${skip}&limit=${limit}`)
    .then((resp) => resp.json())
    .then((resp) => {
      // console.log('xpiralsData', resp.xpirals);

      // update UI
      loadingSpiral.style.display = 'none';
      loadMoreElem.style.display = resp.meta.has_more ? '' : 'none';
      finished = !resp.meta.has_more;
      isLoading = false;

      resp.xpirals.forEach((item) => {
        const div = document.createElement('div');
        const header = document.createElement('h3');
        const xpiralInfo = document.createElement('p');
        const xpiralDate = document.createElement('small');

        header.textContent = item.name;
        xpiralInfo.textContent = item.tweet;
        xpiralDate.textContent = new Date(item.created);

        div.appendChild(header);
        div.appendChild(xpiralDate);
        div.appendChild(xpiralInfo);
        xpiralsElemDiv.appendChild(div);
      });
    });
}

function loadMore() {
  // console.log('@loadMore');
  skip += limit;
  isLoading = true;
  listAllXpirals(false);
}
