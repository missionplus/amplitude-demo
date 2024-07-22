document.addEventListener('DOMContentLoaded', function() {
    
    // DOM elements
    const screen1 = document.getElementById('screen1');
    const screen2 = document.getElementById('screen2');
    const screen3 = document.getElementById('screen3');
    const failScreen = document.getElementById('failScreen');
    const userIdInput = document.getElementById('userId');
    const ageInput = document.getElementById('age');
    const generateUUIDBtn = document.getElementById('generateUUID');
    const nextScreen1Btn = document.getElementById('nextScreen1');
    const nextScreen2Btn = document.getElementById('nextScreen2');

    // Generate UUID function
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Event listeners
    generateUUIDBtn.addEventListener('click', () => {
        userIdInput.value = generateUUID();
    });


    nextScreen1Btn.addEventListener('click', () => {
        const userId = userIdInput.value;

        if (!userId) {
            alert('Please enter a valid User ID');
            return;
        }

        amplitude.setUserId(userId);

        screen1.style.display = 'none';
        screen2.style.display = 'block';
        amplitude.track('User ID Entered');
    });

    nextScreen2Btn.addEventListener('click', () => {
        const userId = userIdInput.value;
        const age = parseInt(ageInput.value);

        if (isNaN(age)) {
            alert('Please enter a valid Age');
            return;
        }
        amplitude.track('Credit Check Initiated', { age: age });

        fetch('/credit-check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, age }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'Pass') {
                screen2.style.display = 'none';
                screen3.style.display = 'block';
                amplitude.track('Journey Completed');
            } else {
                screen2.style.display = 'none';
                failScreen.style.display = 'block';
                amplitude.track('Application Failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            amplitude.track('Credit Check Error', { 
                error_message: error.toString()
            });
        });
    });
});