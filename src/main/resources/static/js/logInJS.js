document.addEventListener("DOMContentLoaded", () => {
  const title = document.getElementById("title");
  const innerContainer = document.getElementById("inner-container");
  document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    displayWelcomeMessage();

  })

  function displayWelcomeMessage() {

    title.classList.add("moveDown");
    innerContainer.classList.add("fadeOut");
    console.log("Adding fadeOut:", innerContainer);
    setTimeout(tempGoToCalendar,4000);
  }
  function tempGoToCalendar() {
    window.location.href = "/calendar";
  }
})
