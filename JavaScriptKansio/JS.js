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
                let marker = L.marker([lat, lng]).addTo(map).bindPopup(`<h3>${restaurant.name}</h3>
                <p>${restaurant.address} / ${restaurant.postalCode}</p>
                <p>tel: ${restaurant.phone} </p>
                <p>id:  ${restaurant._id}</p>
                `);
            
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


//getRestaurants();

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





