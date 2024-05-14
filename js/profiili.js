let profileButton = document.getElementById("profile_btn");
let profileDialog = document.getElementById("profileModal");
let profiili = document.getElementById('profiili');
let muokkausDialog = document.getElementById('muokkausDialog');
let closeMuokkaus = document.getElementById('closeMuokkaus');
let closeProfile = document.getElementById('closeProfile');
let usernameBox = document.getElementById('usernameBox');
let favoriteRestaurant = document.getElementById('favoriteRestaurant');
let profilePictureInput = document.getElementById('profilePictureInput');
let profilePicture = document.getElementById('profilePicture');
let muokkaaBtn = document.getElementById('muokkaa');
let tallennaBtn = document.getElementById('tallenna');
let emailBox = document.getElementById('emailBox');





if (profileButton) {
    profileButton.addEventListener('click', async function() {
        try {
            let userProfile = await getUserProfile();
            console.log(userProfile);

            // Display the user profile in the profile dialog
            usernameBox.textContent = userProfile.username;
            emailBox.textContent = userProfile.email;

            let profilePictureData = sessionStorage.getItem('profilePicture');
            if (profilePictureData) {
                profilePicture.src = profilePictureData;
            }
            profilePictureInput.disabled = false;

            profileDialog.showModal();

            let favoriteRestaurantData = JSON.parse(sessionStorage.getItem('favoriteRestaurant'));
            if (favoriteRestaurantData) {
                favoriteRestaurant.textContent = favoriteRestaurantData.name + " / " + favoriteRestaurantData.address;
                console.log("Favorite restaurant:", favoriteRestaurant.textContent);
            }
        } catch (error) {
            console.error('Error getting user profile:', error);
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
let currentUsername, currentEmail;

muokkaaBtn.addEventListener('click', function() {
    // Fetch the current user profile from the profile modal
    currentUsername = document.getElementById('usernameBox').textContent;
    currentEmail = document.getElementById('emailBox').textContent;

    profileDialog.close();
    muokkausDialog.showModal();
});

document.getElementById('tallenna').addEventListener('click', async function() {
    let usernameInput = document.getElementById('muokkaaUsername').value;
    let emailInput = document.getElementById('muokkaaEmail').value;
    let pictureInput = document.getElementById('profilePictureInput').files[0];

    let formData = new FormData();
    formData.append('username', usernameInput);
    formData.append('email', emailInput);
    formData.append('picture', pictureInput);

    try {
        await updateUserProfile(formData);
        muokkausDialog.close();

        // Fetch the updated user profile from the API
        let updatedProfile = await getUserProfile();
        console.log(updatedProfile);

        // Update the profile dialog with the updated user profile
        usernameBox.textContent = updatedProfile.username;
        emailBox.textContent = updatedProfile.email;

        profileDialog.showModal();

    } catch (error) {
        console.error('Error updating user profile:', error);
        alert('Käyttäjän profiilin päivitys epäonnistui');
    }
});

async function updateUserProfile(formData) {
    const url = 'https://10.120.32.94/restaurant/api/v1/users';
    const token = sessionStorage.getItem('token');

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('User profile updated successfully');
}

async function getUserProfile() {
    const token = sessionStorage.getItem('token');
    const url = `https://10.120.32.94/restaurant/api/v1/users/token`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
}



closeProfile.addEventListener('click', function() {
    profileDialog.close();
});
closeMuokkaus.addEventListener('click', function() {
    muokkausDialog.close();
    profileDialog.showModal();
});


/*
url = https://10.120.32.94/restaurant/api/v1/users

method = PUT

Authorization = Bearer token

fields = {
    username: "username",
    email: "email",
    password: "password",
    favouriteRestaurant: "favouriteRestaurant",
    avatar: "avatar"

*/