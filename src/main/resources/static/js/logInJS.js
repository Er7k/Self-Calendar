document.addEventListener("DOMContentLoaded", () => {
  const title = document.getElementById("title");
  const innerContainer = document.getElementById("inner-container");
  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch('api/users/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({username, password})
    });

    if (response.ok) {
      displayWelcomeMessage();
      alert('Logged in as ' + username)
    } else {
      alert('Incorrect username or password');
    }
  });

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
