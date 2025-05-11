document.addEventListener("DOMContentLoaded", () => {

    const returnBtn = document.getElementById('return-button');

    document.getElementById("register-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

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