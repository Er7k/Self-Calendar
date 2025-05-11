document.addEventListener("DOMContentLoaded", () => {

    const returnBtn = document.getElementById('return-button');
    const container = document.getElementById('reset-password-container');
    const emailForm = document.getElementById('email-form');
    const newPasswordForm = document.getElementById('new-password-form');
    const title = document.getElementById('inner-container-title');
    let email;

    document.getElementById("email-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        email = document.getElementById("email").value;

        const response = await fetch('api/users/verify-email', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            alert('temp success')
            history.pushState(null, "", "/reset-password");
            container.classList.add("expand");
            emailForm.classList.add("fadeout")
            title.classList.add("fadeout");
            setTimeout(() => {
                emailForm.remove();
                title.classList.remove("fadeout");
                title.innerHTML = "Create new Password";
                title.classList.add("fadein");
                newPasswordForm.classList.add("fadein");
                }, 1200);
        } else {
            alert('temp fail');
        }
    });

    document.getElementById("new-password-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const password1 = document.getElementById("password1").value;
        const password2 = document.getElementById("password2").value;

        console.log(password1, password2);

        if (password1 === password2) {

            const response = await fetch('api/users/reset-password', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ email, newPassword: password1 })
            });

            if (response.ok) {
                alert('password changed successfully')
                window.location.href = "/index";
            }
            else {
                alert('failed to change password')
            }
        }
        else {
            alert("Password does not match")
        }
    })

    returnBtn.addEventListener('click', async (e) => {
        window.location.href = "/";
    })
})