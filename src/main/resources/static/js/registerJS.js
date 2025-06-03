document.addEventListener("DOMContentLoaded", () => {

    const returnBtn = document.getElementById('return-button');
    const form = document.getElementById("register-form");
    const submitBtn = form.querySelector('button[type="submit"]');
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const usernameError = document.getElementById("username-error");
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");

    const updateSubmitButton = () => {
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        submitBtn.disabled = !(username && email && password);
    }

    usernameInput.addEventListener('input', updateSubmitButton);
    emailInput.addEventListener('input', updateSubmitButton);
    passwordInput.addEventListener('input', updateSubmitButton);

    updateSubmitButton();

    /*document.getElementById("register-form").addEventListener("submit", async (e) => {
        e.preventDefault();

     */
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        usernameError.style.display = "none";
        emailError.style.display = "none";
        passwordError.style.display = "none";

        let errors = [];
        if (!username) {
            errors.push("Please fill in username");
            usernameError.style.display = "block";
        }
        if (!email) {
            errors.push("Please fill in email");
            emailError.style.display = "block";
        }
        if (!password) {
            errors.push("Please fill in password");
            passwordError.style.display = "block";
        }

        if (errors.length > 0) {
            alert(errors.join("\n"));
            return;
        }


        const response = await fetch('api/users/register', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({username, email, password})
        });

        if (response.ok) {
            alert('Successfully registered account, Welcome ' + username + '!')
            window.location.href = '/';
        } else {
            alert('Failed to register account.');
        }
    });

    returnBtn.addEventListener('click', async (e) => {
        window.location.href = "/";
    })
})