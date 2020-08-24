const tweetForm = document.querySelector("form");
const loadingSpiral = document.querySelector(".loading");

loadingSpiral.style.display = "none";

tweetForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // 1. Extract data from Form
  const tweetFormData = new FormData(tweetForm);
  const name = tweetFormData.get("name");
  const tweet = tweetFormData.get("tweet");
  const tweetData = { name, tweet };
  console.log(tweetData);

  // Update UI
  loadingSpiral.style.display = "";
  tweetForm.style.display = "none";
});
