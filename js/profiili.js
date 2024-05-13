let profileButton = document.getElementById("profile_btn");
let profileDialog = document.getElementById("profileModal");
let profiili = document.getElementById('profiili');

let closeProfile = document.getElementById('closeProfile');
let usernameBox = document.getElementById('usernameBox');
let favoriteRestaurant = document.getElementById('favoriteRestaurant');
let profilePictureInput = document.getElementById('profilePictureInput');
let profilePicture = document.getElementById('profilePicture');
let muokkaaBtn = document.getElementById('muokkaa');
let tallennaBtn = document.getElementById('tallenna');
let emailBox = document.getElementById('emailBox');





if (profileButton) {
    profileButton.addEventListener('click', function() {
        let userData = JSON.parse(sessionStorage.getItem('data'));
        let profilePictureData = sessionStorage.getItem('profilePicture');
        if (userData) {
            usernameBox.textContent = userData.data.username;
            emailBox.textContent = userData.data.email;

            if (profilePictureData) {
                profilePicture.src = profilePictureData;
            }
            profilePictureInput.disabled = false; 
        } else {    
            profilePictureInput.disabled = true; 
        }
        
        profileDialog.showModal();

        let favoriteRestaurantData = JSON.parse(sessionStorage.getItem('favoriteRestaurant'));
        if (userData) {
            usernameBox.textContent = userData.data.username;
            console.log("Username box content:", usernameBox.textContent);
            if (favoriteRestaurantData) {
                favoriteRestaurant.textContent = favoriteRestaurantData.name + " / " + favoriteRestaurantData.address;
                console.log("Favorite restaurant:", favoriteRestaurant.textContent);
            }
        }
    });
    profilePictureInput.addEventListener('change', function(e) {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onloadend = function() {
            let dataUrl = reader.result;
            let userData = JSON.parse(sessionStorage.getItem('data'));
            if (userData) {
                let username = userData.data.username;
                localStorage.setItem('profilePicture-' + username, dataUrl);
                profilePicture.src = dataUrl;
            }
        }
        if (file) {
            reader.readAsDataURL(file);
        }
    });
}

async function updateUserProfile(userUpdates) {
    const url = 'https://10.120.32.94/restaurant/api/v1/users';
    const token = sessionStorage.getItem('token');

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userUpdates)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}



closeProfile.addEventListener('click', function() {
    profileDialog.close();
});

/*
url = https://10.120.32.94/restaurant/api/v1/users

method = PUT

Authorization = Bearer token

fields = {
    username: "username",
    email: "email",
    password: "password",
    avatar: "avatar"

*/