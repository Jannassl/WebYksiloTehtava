'use strict'

var map = L.map('map').setView([60.28, 25], 10);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);




let restaurants = []
let tableElement = document.querySelector('table');
let loginButton = document.getElementById("login_btn");
let registerButton = document.getElementById("register_btn");
let dialog = document.querySelector("dialog");





async function getRestaurants() {
    try {
        const response = await fetch("https://10.120.32.94/restaurant/api/v1/restaurants");
        if (!response.ok) {
            throw new Error("HTTP error, status = " + response.status);
        } else {
            const data = await response.json();
            console.log(data);
            data.forEach((restaurant) => {
                restaurants.push(restaurant);
            });
            restaurants.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
            
            for(let restaurant of restaurants){
                let lat = restaurant.location.coordinates[1];
                let lng = restaurant.location.coordinates[0];
                let marker = L.marker([lat, lng]).addTo(map).bindPopup(`<h3>${restaurant.name}</h3>
                <p>${restaurant.address} / ${restaurant.postalCode}</p>
                <p>tel: ${restaurant.phone} </p>
                <p>id:  ${restaurant._id}</p>
                `);
                let tableRow = `<tr>
                                    <td>${restaurant.name}</td>
                                    <td>${restaurant.address}</td>
                                    <td id="target1">${lat}, ${lng}</td>
                                    <td id="target1"><input type="checkbox"></td>
                                </tr>`;
                tableElement.insertAdjacentHTML('beforeend', tableRow);
                
            
                marker.on('click', async function() {
                            
                    const menu = await getDailyMenu(restaurant._id, 'fi'); // Jos ongelmia niin tämä oli 'en' 
                    document.getElementById('information').innerHTML = `
                        <h2>${restaurant.name}</h2>
                        <p>${restaurant.address}</p>
                        <h3>Menu</h3>
                        <p>${menu.courses[0].name}</p>
                    `;
                });
                
            }
        }
    } catch (error) {
        console.log("Error: ", error);
    }
}

async function getDailyMenu(id, language){
    try{
        const response = await fetch(`https://10.120.32.94/restaurant/api/v1/restaurants/daily/${id}/${language}`);
        if (!response.ok) {
            throw new Error("HTTP error, status = " + response.status);
        }
        const menu = await response.json();
        console.log(menu);
        return menu;
    } catch (error) {
        console.log("Error: ", error);
    }
}




getRestaurants();
//getDailyMenu();

loginButton.addEventListener('click', event => {
    dialog.innerHTML = " ";
    dialog.insertAdjacentHTML('beforeend', ` 
    <form id="loginForm">
        <button id="close_btn" style="float: right;">X</button>
        <label for="username">Username:</label><br>
        <input type="text" id="username" name="username"><br>
        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password"><br>
        <input type="submit" value="Submit">
    </form>
    `);
    dialog.showModal();
    document.getElementById("close_btn").addEventListener('click', function(event) {
        event.preventDefault();
        dialog.close();
    });
});


registerButton.addEventListener('click', event => {
    dialog.innerHTML = " ";
    dialog.insertAdjacentHTML('beforeend', ` 
    <form id="loginForm">
        <button id="close_btn" style="float: right;">X</button>
        <label for="username">Username:</label><br>
        <input type="text" id="username" name="username"><br>
        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password"><br>
        <input type="submit" value="Submit">
    </form>
    `);
    dialog.showModal();
    document.getElementById("close_btn").addEventListener('click', function(event) {
        event.preventDefault();
        dialog.close();
    });
});

