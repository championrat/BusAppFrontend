// kyc.js

$(document).ready(function() {
    // Fetch available buses when the page loads
    fetchBuses();

    // Function to fetch and display buses
    function fetchBuses() {
        $.ajax({
            url: `${API_URL}/api/buses/`,  // Your Django API endpoint
            type: 'GET',
            success: function(response) {
                const buses = response.buses;
                if (buses.length > 0) {
                    displayBuses(buses);
                } else {
                    $('#buses-list').html('<p>No buses available</p>');
                }
            },
            error: function(xhr, status, error) {
                console.error("Error fetching buses:", error);
                $('#buses-list').html('<p>Failed to load buses</p>');
            }
        });
    }

    // Function to display buses as cards
    function displayBuses(buses) {
        let busesHtml = '';
        buses.forEach(bus => {
            busesHtml += `
                <div class="card">
                    <h3>Bus No: ${bus.Bus_No}</h3>
                    <p><strong>Departure Location:</strong> ${bus.Departure_Location}</p>
                    <p><strong>Departure Time:</strong> ${bus.Departure_Time}</p>
                    <p><strong>Destinations:</strong> ${bus.Destinations}</p>
                    <p><strong>Ticket Costs:</strong> ${bus.Ticket_Costs}</p>
                    <p><strong>Seats Available:</strong> ${bus.Seats_Available}</p>
                    <p><strong>Agency Name:</strong> ${bus.Agency_Name}</p>
                    <p><strong>Driver:</strong> ${bus.Driver === 'None' ? 'No driver assigned' : bus.Driver}</p>
                    <p><strong>Status:</strong> ${bus.bus_status}</p>
                    ${bus.Driver === 'None' ? `<button class="assign-driver-btn" data-bus-no="${bus.Bus_No}">Assign as Driver</button>` : ''}
                </div>
            `;
        });
        $('#buses-list').html(busesHtml);

        // Attach click event for "Assign as Driver" button
        $('.assign-driver-btn').on('click', function() {
            const busNo = $(this).data('bus-no');
            assignDriverToBus(busNo);
        });
    }

    // Function to assign a driver to the bus
    function assignDriverToBus(busNo) {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            alert('You must be logged in to assign a bus.');
            return;
        }

        $.ajax({
            url: `${API_URL}/api/assign-bus/`,  // Your Django API endpoint
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            data: JSON.stringify({ bus_no: busNo }),
            contentType: 'application/json',
            success: function(response) {
                alert(response.message);
                fetchBuses();  // Refresh bus list to reflect the update
            },
            error: function(xhr, status, error) {
                const errorMessage = xhr.responseJSON ? xhr.responseJSON.message : 'An error occurred';
                alert(errorMessage);
            }
        });
    }
});
