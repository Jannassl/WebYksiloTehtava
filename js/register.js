
let registerButton = document.getElementById("register_btn");
let registerForm = document.querySelector('#registerForm');
let registerClose = document.getElementById("register_close_btn");
let registerDialog = document.querySelector("#registerDialog");

async function registerFormSubmitHandler(event) {
    event.preventDefault();
    await registerUser(); 
}

registerButton.addEventListener('click', function() {
    registerDialog.showModal();
    registerForm.addEventListener('submit', registerFormSubmitHandler);
});

registerClose.addEventListener('click', function() {
    registerDialog.close();
    registerForm.removeEventListener('submit', registerFormSubmitHandler);
});


async function checkUsername(username) { // Add username parameter
    let response = await fetch(`https://10.120.32.94/restaurant/api/v1/users/available/${username}`);

    if (response.ok) { // check if HTTP status is 200-299
        let data = await response.json();
        console.log(data) // Parse the JSON response from the server
        if (data.available) {
            console.log('Username is available');
            return true;
        } else {
            console.log('Username is taken');
            return false;
        }
    } else {
        console.log('Failed to check username');
        return false;
    }
}

async function registerUser() {
    let username = registerForm.username.value;
    let email = registerForm.email.value;
    let password = registerForm.password.value;
    let confirmPassword = registerForm.confirmPassword.value;
    
    if (!username || !email || !password || !confirmPassword) {
        alert("Kaikki kentät täytyy täyttää");
        return;
    }

    if (password !== confirmPassword) {
        alert("Salasanat eivät täsmää");
        return;
    }

    let isUsernameAvailable = await checkUsername(username); 
    if (!isUsernameAvailable) {
        alert("Käyttäjänimi varattu");
        return;
    }

    let response = await fetch("https://10.120.32.94/restaurant/api/v1/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password,
        }),
    });

    if (response.ok) { // check if HTTP status is 200-299
        console.log('User registered successfully');
    } else {
        console.log('Failed to register user');
    }
}

/*
POST /users
Content-Type: application/json

{
  "username": "john.doe",
  "password": "password123",
  "email": "john.doe@example.com",
}
*/