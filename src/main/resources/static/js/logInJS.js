document.addEventListener("DOMContentLoaded", () => {
  const title = document.getElementById("title");
  const innerContainer = document.getElementById("inner-container");
  const createAccountBtn = document.getElementById("createAccount");
  const resetPWBtn = document.getElementById("resetPW");
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
      const data = await response.json();
      localStorage.setItem('userId', data.id);
      displayWelcomeMessage();
      alert('Logged in as ' + username)
    } else {
      alert('Incorrect username or password');
    }
  });

  createAccountBtn.addEventListener("click", async (e) => {
    window.location.href = "/register";
  })

  resetPWBtn.addEventListener("click", async (e) => {
    window.location.href = "/verify-email";
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
