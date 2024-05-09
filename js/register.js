
let registerButton = document.getElementById("register_btn");
let registerForm = document.getElementById("registerForm");



registerButton.addEventListener('click', event => {
    dialog.innerHTML = " ";
    dialog.insertAdjacentHTML('beforeend', ` 
    <form id="loginForm">
        <button id="close_btn" style="float: right;">X</button>
        <label for="username">Username:</label><br>
        <input type="text" id="username" name="registerUsername"><br>
        <label for="email">Email:</label><br>
        <input type="email" id="email" name="registerEmail"><br>
        <label for="password">Password:</label><br>
        <input type="password" id="registerPassword" name="registerPassword"><br>
        <label for="password">Confirm Password:</label><br>
        <input type="password" id="confirmRegisterPassword" name="confirmRegisterPassword"><br>
        <input type="submit" value="Submit">
    </form>
    `);
    dialog.showModal();
    document.getElementById("close_btn").addEventListener('click', function(event) {
        event.preventDefault();
        dialog.close();
    });
});




