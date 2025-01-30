$(document).ready(function() {
    // Function to fetch bus details based on bus_no
    // function fetchBusDetails() {
    //     const busNo = new URLSearchParams(window.location.search).get('bus_no');
        
    //     if (!busNo) {
    //         $('#message').html('Bus number not provided.');
    //         return;
    //     }

    //     const userToken = localStorage.getItem('access_token');
        
    //     if (!userToken) {
    //         $('#message').html('You need to log in first.');
    //         return;
    //     }

    //     // Fetch bus details using GET request
    //     $.ajax({
    //         url: `http://ec2-13-215-174-206.ap-southeast-1.compute.amazonaws.com/api/bus/${busNo}/details/`,  // Adjust endpoint if necessary
    //         type: 'GET',
    //         contentType: 'application/json',
    //         headers: {
    //             'Authorization': 'Bearer ' + userToken
    //         },
    //         success: function(response) {
    //             displayBusDetails(response);  // Display bus details
    //         },
    //         error: function(xhr, status, error) {
    //             let errorMsg = "An error occurred while fetching bus details.";
    //             try {
    //                 const response = JSON.parse(xhr.responseText);
    //                 if (response.message) {
    //                     errorMsg = response.message;
    //                 }
    //             } catch (e) {
    //                 console.error('Failed to parse error response:', e);
    //             }
    //             $('#message').html('<p class="error">' + errorMsg + '</p>');
    //         }
    //     });
    // }

    // Function to fetch passengers for this bus using POST request
    function fetchPassengers() {
        const busNo = new URLSearchParams(window.location.search).get('bus_no');
        const userToken = localStorage.getItem('access_token');
        
        if (!userToken) {
            $('#message').html('You need to log in first.');
            return;
        }

        $.ajax({
            url: `${API_URL}/api/bus/passengers/`,
            type: 'POST',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + userToken
            },
            data: JSON.stringify({ bus_no: busNo }),
            success: function(response) {
                displayBusDetails(busNo);  // Display bus details
                
                displayPassengers(response.passengers);  // Display the list of passengers
            },
            error: function(xhr, status, error) {
                let errorMsg = "An error occurred while fetching passengers.";
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.message) {
                        errorMsg = response.message;
                    }
                } catch (e) {
                    console.error('Failed to parse error response:', e);
                }
                $('#message').html('<p class="error">' + errorMsg + '</p>');
            }
        });
    }

    // Function to display bus details on the page
    function displayBusDetails(busNo) {
        const busDetails = `
            <h3>Bus No: ${busNo}</h3>`;
        //     <p><strong>Departure Location:</strong> ${bus.departure_location}</p>
        //     <p><strong>Departure Time:</strong> ${bus.departure_time}</p>
        //     <p><strong>Destinations:</strong> ${bus.destinations.join(', ')}</p>
        //     <p><strong>Seats Available:</strong> ${bus.seats_available}</p>
        //     <p><strong>Ticket Costs:</strong> ${bus.ticket_costs.join(', ')}</p>
        //     <p><strong>Agency Name:</strong> ${bus.agency_name}</p>
        // `;
        $('#bus-details').html(busDetails);
        
        // Fetch and display passengers for this bus
        // fetchPassengers(bus.bus_no);
    }

    // Function to display passengers on the page
    function displayPassengers(passengers) {
        let passengerList = '<h4>Passenger List</h4>';
        if (passengers && passengers.length > 0) {
            passengers.forEach(passenger => {
                passengerList += `
                    <div class="passenger-card">
                        <p><strong>Name:</strong> ${passenger.passenger_name}</p>
                        <p><strong>Age:</strong> ${passenger.passenger_age}</p>
                    </div>
                `;
            });
        } else {
            passengerList += '<p>No passengers found.</p>';
        }
        $('#passenger-list').html(passengerList);
    }

    // Call fetchBusDetails when the page loads
    fetchPassengers();
});
