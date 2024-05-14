'use strict'

var map = L.map('map').setView([60.28, 25], 10);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);




//let restaurants = []    






export async function getRestaurants() {
    let restaurants = []; // Move the declaration of restaurants inside the function
    try {
        const response = await fetch("https://10.120.32.94/restaurant/api/v1/restaurants");
        if (!response.ok) {
            throw new Error("HTTP error, status = " + response.status);
        } else {
            const data = await response.json();
            data.forEach((restaurant) => {
                restaurants.push(restaurant);
            });
            restaurants.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
            console.log(data);
            
            
            for(let restaurant of restaurants){
                let lat = restaurant.location.coordinates[1];
                let lng = restaurant.location.coordinates[0];
                let marker = L.marker([lat, lng]).addTo(map).bindPopup(`<h3>${restaurant.name}</h3>
                <p>${restaurant.address} / ${restaurant.postalCode}</p>
                <p>tel: ${restaurant.phone} </p>
                <p>id:  ${restaurant._id}</p>
                `);

                marker.on('click', async function() {
                    const menu = await getDailyMenu(restaurant._id, 'fi'); 
                    const coursesHTML = menu.courses ? menu.courses.map(course => `<p>${course.name}/ Diets: ${course.diets} price: ${course.price}</p>`).join('') : '';
                    let event = new CustomEvent('markerClicked', {detail: restaurant._id});
                    window.dispatchEvent(event);
                
                    const weeklyMenu = await getWeeklyMenu(restaurant._id, 'fi');
                    let weeklyCoursesHTML = '';
                    for(let i = 0; i < weeklyMenu.days.length; i++){
                        //console.log(weeklyMenu.days[i]);
                        weeklyCoursesHTML += `<h4>${weeklyMenu.days[i].date}</h4>`;
                        for( let j = 0; j < weeklyMenu.days[i].courses.length; j++){
                            weeklyCoursesHTML += `<p>${weeklyMenu.days[i].courses[j].name}/ Diets: ${weeklyMenu.days[i].courses[j].diets}</p>`;
                        }
                    }
                
                    let isWeeklyMenuShown = false;
                
                    document.getElementById('information').innerHTML = `
                        <h2>${restaurant.name}</h2>
                        <p>${restaurant.address}</p>
                        <button id="toggleMenu">Viikottainen menu</button>
                        <h3>Menu</h3>
                        <div id="menuContent">
                            ${coursesHTML}
                        </div>
                    `;
                
                    document.getElementById('toggleMenu').addEventListener('click', function() {
                        isWeeklyMenuShown = !isWeeklyMenuShown;
                        document.getElementById('menuContent').innerHTML = isWeeklyMenuShown ? weeklyCoursesHTML : coursesHTML;
                        document.getElementById('toggleMenu').innerText = isWeeklyMenuShown ? 'Päivän menu' : 'Viikottainen menu';
                    });
                });
                
            }
            return restaurants;
        }
    } catch (error) {
        console.log("Error: ", error);
    }
}

export async function getDailyMenu(id, language){
    try{
        const response = await fetch(`https://10.120.32.94/restaurant/api/v1/restaurants/daily/${id}/${language}`);
        if (!response.ok) {
            throw new Error("HTTP error, status = " + response.status);
        }
        const menu = await response.json();
        //console.log(menu);
        return menu;
    } catch (error) {
        console.log("Error: ", error);
    }
}

export async function getWeeklyMenu(id, language){
    try{
        const response = await fetch(`https://10.120.32.94/restaurant/api/v1/restaurants/weekly/${id}/${language}`);
        if(!response.ok){
            throw new Error("HTTP error, status = " + response.status);
        }
        const menu = await response.json();
        //console.log(menu);
        return menu;
    }catch(error){
        console.log("Error: ", error);
    };
};



getRestaurants();





