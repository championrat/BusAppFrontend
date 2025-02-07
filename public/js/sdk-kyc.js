let lastKycResult = null; // Global variable to hold the last KYC result

function startKycValidation() {
    document.getElementById('error-message').style.display = 'none';
    document.getElementById('start-kyc').style.display = 'none'; // Hide Start KYC button

    $.ajax({
        url: `${API_URL}/api/app-token/`,
        headers: { 'Authorization': localStorage.getItem('token') },
        method: 'GET',
        success: function (response) {
            const appToken = response.appToken;
            const workflowId = 'busDriverKYC'; // Insert workflowID after MR approval
            const customInputs = {
                name: "xyz",
                phone: "1234567890",
                dateOfbirth: "19-11-2001"
            };
            
            const tid = crypto.randomUUID();
            console.log("Transaction ID:", tid);

            const hyperKycConfig = new window.HyperKycConfig(appToken, workflowId, tid);
            hyperKycConfig.setInputs(customInputs);

            window.HyperKYCModule.launch(hyperKycConfig, handler);
            console.log('HyperKYC launched');
        },
        error: function () {
            showErrorMessage("Failed to retrieve token from API.");
        }
    });

    const handler = (HyperKycResult) => {
        lastKycResult = HyperKycResult; // Store response globally

        console.log("KYC Result:", HyperKycResult);

        if (!HyperKycResult.transactionId) {
            showErrorMessage("Missing transaction ID from KYC result.");
            return;
        }

        // Process KYC status
        switch (HyperKycResult.status) {
            case "user_cancelled":
                showStatusMessage("KYC Process interrupted by user");
                document.getElementById('start-kyc').innerText = "Retry KYC";
                document.getElementById('start-kyc').style.display = 'block';
                showManualKycButton();
                break;

            case "error":
                showStatusMessage("KYC Process ended with error");
                document.getElementById('start-kyc').innerText = "Retry KYC";
                document.getElementById('start-kyc').style.display = 'block';
                showManualKycButton();
                break;

            case "auto_approved":
                showStatusMessage("KYC Process ended with approval")
                populateDriverDetails(HyperKycResult.details);
                document.getElementById('driver-details-form').style.display = 'block';
                break;

            case "auto_declined":
                showStatusMessage("KYC Process ended with rejection");
                showManualKycButton();
                break;

            case "needs_review":
                showStatusMessage("KYC Process ended, manual review required. Contact sysadmin");
                setTimeout(function() {
                    window.location.href = 'driver-dashboard.html';  // Redirect to login page
                }, 5000);
                break;

        }
    };
}

// Populate form fields from SDK response
function populateDriverDetails(details) {
    document.getElementById('d_name').value = details.name || '';

    // Convert date format from DD-MM-YYYY to YYYY-MM-DD for input fields
    document.getElementById('d_dob').value = formatDate(details.dob);
    document.getElementById('dl_doe').value = formatDate(details.dl_doe);
    document.getElementById('dl_no').value = details.dl_no;
}

// Convert DD-MM-YYYY to YYYY-MM-DD
function formatDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : '';
}

function showManualKycButton() {
    document.getElementById('manual-kyc-button').style.display = 'block';
}

function redirectToManualKYC() {
    window.location.href = 'driver-manual-kyc.html';
}

function showStatusMessage(message, type) {
    const statusMessageDiv = document.getElementById('status-message');
    statusMessageDiv.innerText = message;
    statusMessageDiv.style.display = 'block';
    
    if (type === 'success') {
        statusMessageDiv.style.backgroundColor = 'green';
        statusMessageDiv.style.color = 'white';
    } else if (type === 'error') {
        statusMessageDiv.style.backgroundColor = 'red';
        statusMessageDiv.style.color = 'white';
    }

    // Clear the message when user interacts
    document.body.addEventListener('click', clearStatusMessage, { once: true });
}

function clearStatusMessage() {
    document.getElementById('status-message').style.display = 'none';
}

// Modify form submission success/error handling:
$('#driver-kyc-form').on('submit', function (e) {
    e.preventDefault();  

    var formData = new FormData(this);
    var formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    console.log('Sending form data...');
    $.ajax({
        url: `${API_URL}/api/sdk-kyc/`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formDataObject),
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('access_token') },
        success: function (response) {
            // const response = JSON.parse(xhr.responseText);

            if (!response || response == "undefined") {
                console.error("Received an empty or undefined response from API");
                return;
            }
        
            try {
                // const response = JSON.parse(xhr.responseText);
                showStatusMessage("Form submitted successfully!", "success");
                console.log(response);
                setTimeout(function(response){
                    try {
                        clearStatusMessage();
                        res = JSON.parse(response);
                        mes = JSON.stringify(res);
                        console.log(res);
                        console.log(mes);
                        console.log(mes.message);
                        showStatusMessage(response, "success");
                    } catch (error) {
                        showStatusMessage("KYC SUCCESSFULL, DRIVER REGISTERED");
                    }
                }, 3000)
            } catch (error) {
                console.error("Failed to parse JSON:", error);
            }


        },
        error: function (xhr) {
            const response = JSON.parse(xhr.responseText);
            showStatusMessage(response.message, "error");
        }
    });
});
