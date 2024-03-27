'use strict'

var map = L.map('map').setView([60.28, 25], 10);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);



let restaurants = []
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
                L.marker([lat, lng]).addTo(map).bindPopup(`<h3>${restaurant.name}</h3><p>${restaurant.address}</p>`);
            }
        }
    } catch (error) {
        console.log("Error: ", error);
    }
}
getRestaurants();

async function getDailyMenu(id, language){
    try{
        const response = await fetch(`https://10.120.32.94/restaurant/api/v1/restaurants/daily/${id}/${language}`);
        if(!response.ok) {
            throw new Error("HTTP error, status = " + response.status);
        } else {
            const data = await response.json();
            console.log(data)
        }
    }catch(error) {
        console.log("Error: "+ error);
    }
}

getDailyMenu();