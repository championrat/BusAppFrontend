let lastKycResult = null; // Global variable to hold the last KYC result

function startKycValidation() {
    // Clear previous error messages
    document.getElementById('error-message').style.display = 'none';

    // Step 1: Get the token from the API
    $.ajax({
        url: `${API_URL}/api/app-token/`, // Replace with actual API endpoint
        headers: {
            'Authorization': localStorage.getItem('token') // Replace with actual token
        },
        method: 'GET',
        success: function (response) {
            const appToken = response.appToken;
            const workflowId = 'busDriverKYC' // Insert workflowID after MR approval
            const customInputs = {
                name: "xyz",
                phone: "1234567890",
                dateOfbirth: "19-11-2001"
            };
            console.log(appToken);

            // Step 2: Initialize the SDK
            const hyperKycConfig = new window.HyperKycConfig(appToken, workflowId, '1');
            hyperKycConfig.setInputs(customInputs);

            console.log('config done');

            // Step 3: Initialize the handler function
            
            // Initialize the SDK with the config and handler
            window.HyperKYCModule.launch(hyperKycConfig, handler);
            console.log('launched');
        },
        error: function () {
            showErrorMessage("Failed to retrieve token from API.");
        }
    });

    const handler = (HyperKycResult) => {
        lastKycResult = HyperKycResult; // Save the SDK result to a global variable

        switch (HyperKycResult.status) {
            case "user_cancelled":
                showErrorMessage("User cancelled the KYC process.");
                showManualKycButton();
                break;
            case "error":
                showErrorMessage("An error occurred during the KYC process.");
                showManualKycButton();
                break;
            case "auto_approved":
                // Show the driver details form when KYC is approved
                document.getElementById('driver-details-form').style.display = 'block';
                break;
            case "auto_declined":
                showErrorMessage("KYC was auto declined.");
                showManualKycButton();
                break;
            case "needs_review":
                showErrorMessage("KYC requires manual review.");
                showManualKycButton();
                break;
        }
    };
}

function showErrorMessage(message) {
    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.innerHTML = message;
    errorMessageDiv.style.display = 'block';
}

function showManualKycButton() {
    // Show the manual KYC button at the bottom of the page
    const manualKycButton = document.getElementById('manual-kyc-button');
    manualKycButton.style.display = 'block';
}

function redirectToManualKYC() {
    // Redirect to the manual KYC page
    window.location.href = 'driver-manual-kyc.html';
}

// Handle the driver form submission
$(document).ready(function () {
    $('#driver-kyc-form').on('submit', function (e) {
        e.preventDefault();  // Prevent default form submission

        var formData = new FormData(this);  // Collect form data
        
        if (lastKycResult) {
            // Prepare the data as a JSON object
            var formDataObject = {
                driver_details: {}, // Collect the form data into an object
            };

            formData.forEach((value, key) => {
                formDataObject[key] = value;
            });

            // Append the SDK result as JSON
            formDataObject.sdk_result = lastKycResult;

            // Now send the data as a JSON object
            console.log('Sending form data with SDK result...');
            $.ajax({
                url: `${API_URL}/api/sdk-kyc/`,  // Your Django API endpoint
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(formDataObject), // Send data as a JSON string
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
        }
    });
});
