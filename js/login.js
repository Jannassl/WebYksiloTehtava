let loginButton = document.getElementById("login_btn");
let logoutBtn = document.getElementById("logout_btn");
let registerBtn = document.getElementById("register_btn");
let profileBtn = document.getElementById("profile_btn");
let loginDialog = document.querySelector("#loginDialog");
let loginForm = document.querySelector("#loginForm");
let loginClose = document.getElementById("login_close_btn");


window.onload = function() {
    if (sessionStorage.getItem('data')) {
        // User is logged in
        loginButton.style.display = 'none';
        registerBtn.style.display = 'none';
        profileBtn.style.display = 'block';
        logoutBtn.style.display = 'block';
    } else {
        // User is not logged in
        loginButton.style.display = 'block';
        registerBtn.style.display = 'block';
        profileBtn.style.display = 'none';
        logoutBtn.style.display = 'none';
    }
}

async function loginFormSubmitHandler(event) {
    event.preventDefault();
    await loginUser();
    loginDialog.close();
}

loginButton.addEventListener('click', function() {
    loginDialog.showModal();
    loginForm.addEventListener('submit', loginFormSubmitHandler);
});

loginClose.addEventListener('click', function() {
    loginDialog.close();
    loginForm.removeEventListener('submit', loginFormSubmitHandler);
});

logoutBtn.addEventListener('click', function() {
    if (sessionStorage.getItem('data')) {
        let userData = JSON.parse(sessionStorage.getItem('data'));
        let usernameLogged = userData.data.username;
        console.log("User logged out:", usernameLogged);
        sessionStorage.removeItem('data');
        localStorage.removeItem(usernameLogged);
        localStorage.removeItem(usernameLogged + 'favorite');
        localStorage.removeItem('favorites');
        localStorage.removeItem('usernameLogged');

        usernameBox.textContent = '';
        favoriteRestaurant.textContent = '';

        // Update the display properties of the buttons
        loginButton.style.display = 'block';
        registerBtn.style.display = 'block';
        profileBtn.style.display = 'none';
        logoutBtn.style.display = 'none';
    }
});

async function loginUser() {
    let username = loginForm.username.value;
    let password = loginForm.password.value;
    try {
        const response = await fetch(
            "https://10.120.32.94/restaurant/api/v1/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            }
        );
        let data = await response.json();
        if (response.ok){
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("data", JSON.stringify(data));

            loginButton.style.display = "none";
            registerBtn.style.display = "none";
            logoutBtn.style.display = "block";
            profileBtn.style.display = "block";
            
            console.log(" Kirjautuminen onnistui",data);
            alert("Kirjautuminen onnistui");
        } else {
            alert("Kirjautuminen epäonnistui");
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Kirjautuminen epäonnistui");
    }
}