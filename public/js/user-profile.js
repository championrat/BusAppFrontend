$(document).ready(function () {
    // Make a GET request to retrieve the user information
    $.ajax({
        url: `${API_URL}/api/user/info/`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`  // Get the access token from localStorage
        },
        success: function (response) {
            // Display user information in the HTML
            $('#user-name').text(response.username);
            $('#email').text(response.email);
            $('#full-name').text(response.first_name);  // Display user's full name
            $('#age').text(response.age);  // Display age
            $('#user-groups').text(response.user_groups.join(', '));  // Join multiple groups with commas
        },
        error: function (xhr, status, error) {
            // Display error message if request fails
            errMsg = xhr.responseJSON ? xhr.responseJSON.message : "Failed to load user information.";
            console.log(errMsg + " " + xhr.status);
            $('#error-message').text("Failed to load user information. Please try again." + errMsg).show();
        }
    });
});
