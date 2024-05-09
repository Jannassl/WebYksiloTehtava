let loginButton = document.getElementById("login_btn");
let dialog = document.querySelector("dialog");
let loginForm = document.getElementById("loginForm");

loginButton.addEventListener('click', event => {
    dialog.innerHTML = " ";
    dialog.insertAdjacentHTML('beforeend', ` 
    <form id="loginForm">
        <button id="close_btn">X</button>
        <div class="input-group">
            <label for="username">Username:</label><br>
            <input type="text" id="username" name="username">
        </div>
        <div class="input-group">
            <label for="password">Password:</label><br>
            <input type="password" id="password" name="password">
        </div>
        <input type="submit" value="Submit">
    </form>
    `);
    dialog.showModal();
    document.getElementById("close_btn").addEventListener('click', function(event) {
        event.preventDefault();
        dialog.close();
    });
});

