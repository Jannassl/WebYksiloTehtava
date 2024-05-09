
import { getRestaurants} from './maps.js';


export async function makeRows(){
    try{
        const restaurants = await getRestaurants();
        console.log(restaurants);
        let tableRows = '';
        for(const restaurant of restaurants){
            tableRows += `
                <tr id="row-${restaurant._id}"> <!-- Assign a unique id to each row -->
                    <td>${restaurant.name}</td>
                    <td>${restaurant.address}</td>
                    <td>${restaurant.distance}</td>
                    <td><button>Lisää suosikiksi</button></td>
                </tr>
            `;
        }
        document.getElementById('targetTable').innerHTML += tableRows; // Append the rows to the existing table
        window.addEventListener('markerClicked', function(e) {
            // Remove the 'highlight' class from all rows
            let rows = document.querySelectorAll('#targetTable tr');
            rows.forEach(row => row.classList.remove('highlight'));
        
            // Add the 'highlight' class to the clicked restaurant's row
            let row = document.getElementById(`row-${e.detail}`);
            if (row) {
                row.classList.add('highlight');
            }
        });
    } catch (error) {
        console.log("Error: ", error);
    }
}
makeRows();
