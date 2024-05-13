import { getRestaurants } from './maps.js';

export async function makeRows() {
    try {
        const restaurants = await getRestaurants();
        let byCityButton = document.getElementById("byCity");
        let providerSelect = document.getElementById("provider");
        let palautaButton = document.getElementById("palauta");

        let filterRestaurants = () => {
            let city = document.getElementById("city").value;
            let provider = providerSelect.value;
        
            let filteredRestaurants = restaurants.filter(restaurant => {
                let cityMatch = city ? restaurant.city === city : true;
                let providerMatch = provider !== 'default' ? restaurant.company === provider : true;
                return cityMatch && providerMatch;
            });
        
            createTableRows(filteredRestaurants);
        };

        byCityButton.addEventListener('click', filterRestaurants);
        providerSelect.addEventListener('change', filterRestaurants);

        if (palautaButton) {
            palautaButton.addEventListener('click', function() {
                createTableRows(restaurants);
                document.getElementById("city").value = '';
                providerSelect.value = 'default';
            });
        }

        createTableRows(restaurants);

        window.addEventListener('markerClicked', function(e) {
            let rows = document.querySelectorAll('#targetTable tr');
            rows.forEach(row => row.classList.remove('highlight'));
            let row = document.getElementById(`row-${e.detail}`);
            if (row) {
                row.classList.add('highlight');
            }
        });
    } catch (error) {
        console.log("Error: ", error);
    }
}

function createTableRows(restaurants) {
    let tableRows = '';
    for(const restaurant of restaurants){
        tableRows += `
            <tr id="row-${restaurant._id}">
                <td>${restaurant.name}</td>
                <td>${restaurant.address}</td>
                <td>${restaurant.city}</td>
                <td>${restaurant.company}</td>
                <td><button class="favorite">Lisää suosikiksi</button></td>
            </tr>
        `;
    }
    let targetTableBody = document.getElementById('targetTableBody');
    targetTableBody.innerHTML = tableRows;

    let userData = sessionStorage.getItem('data');
    let favoriteButtons = targetTableBody.getElementsByClassName('favorite');
for (let i = 0; i < favoriteButtons.length; i++) {
    favoriteButtons[i].addEventListener('click', function() {
        let userData = sessionStorage.getItem('data');
        if (userData) {
            let restaurant = restaurants[i];
            sessionStorage.setItem('favoriteRestaurant', JSON.stringify(restaurant));
        } else {
            alert('You need to log in first.');
        }
    });
}
}

makeRows();