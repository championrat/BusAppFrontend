$(document).ready(function() {
    $('#signup-form').submit(function(e) {
        e.preventDefault();

        var username = $('#user-name').val();
        console.log(username);
        var password = $('#password').val();
        var email = $('#email').val();
        var passengerName = $('#passenger_name').val();
        var passengerAge = $('#passenger_age').val();
        var userType = $('#user_type').val();

        var data = {
            "username": username,
            "password": password,
            "email": email,
            "passenger_name": passengerName,
            "passenger_age": passengerAge,
            "user_type": userType
        };

        // Clear any previous messages
        $('#message').html('');

        console.log(data);
        $.ajax({
        url: `${API_URL}/api/signup/`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            if (response.message) {
                $('#message').html('<p class="success">' + response.message + '</p>');
                setTimeout(function() {
                    window.location.href = '/login.html';  // Redirect to login page
                }, 2000);
            } else {
                $('#message').html('<p class="error">An error occurred. Please try again later.' + response.message + '</p>');
            }
        },
        error: function(xhr, status, error) {
            // Check if the response contains a detailed error message
            var errorMessage = 'An error occurred. Please try again later.';
            $('#message').html('<p class="error">' + errorMessage + ' <br>' + xhr.responseJSON.message + '</p>');
        }
        });
    });
});