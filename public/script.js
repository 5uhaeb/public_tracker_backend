document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('sendLocation').style.display = "block";  // Always show "Share My Location"
});

// Function to send location to the backend
function shareLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;

            // Send location to the backend
            fetch('https://public-tracker-backend.onrender.com/api/submit-location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ latitude, longitude })
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('status').textContent = data.message;
            })
            .catch(error => {
                document.getElementById('status').textContent = "Failed to submit location.";
                console.error('Error:', error);
            });
        });
    } else {
        document.getElementById('status').textContent = "Geolocation is not supported by this browser.";
    }
}

document.getElementById('sendLocation').addEventListener('click', shareLocation);

