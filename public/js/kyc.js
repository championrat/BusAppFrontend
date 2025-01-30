// kyc.js

$(document).ready(function () {
    $('#driver-kyc-form').on('submit', function (e) {
        e.preventDefault();  // Prevent default form submission

        var formData = new FormData(this);  // Create FormData object from the form

        $.ajax({
            url: `${API_URL}/api/driver-kyc/`,  // Your Django API endpoint
            type: 'POST',
            data: formData,
            processData: false,  // Don't process data (important for file uploads)
            contentType: false,  // Don't set content type (important for file uploads)
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            },
            success: function (response) {
                $('#response-message').html('<p class="success">' + response.message + '</p>');
                if (response.driver_info) {
                    $('#response-message').append('<p>Driver Name: ' + response.driver_info.full_name + '</p>');
                    $('#response-message').append('<p>License Expiry: ' + response.driver_info.license_expiry + '</p>');
                }
            },
            error: function (xhr, status, error) {
                var errorMessage = xhr.responseJSON ? xhr.responseJSON.message : 'An error occurred';
                $('#response-message').html('<p class="error">' + errorMessage + '</p>');
            }
        });
    });
});
