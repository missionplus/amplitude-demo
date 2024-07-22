const express = require('express');
const path = require('path');
const amplitude = require('@amplitude/analytics-node');

const app = express();
const port = 3000;

// Initialize Amplitude
amplitude.init('YOUR_AMPLITUDE_API_KEY'); 

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/credit-check', (req, res) => {
    const { userId, age } = req.body;

    let eventProperties = {
        age: age
    };

    if (age < 18) {
        eventProperties.result = 'Fail';
        eventProperties.reason = 'Too Young';
    } else if (age > 65) {
        eventProperties.result = 'Fail';
        eventProperties.reason = 'Too Old';
    } else {
        eventProperties.result = 'Pass';
    }

    amplitude.track({
        event_type: 'Credit Check Completed',
        user_id: userId,
        event_properties: eventProperties
    });
    res.json({ status: eventProperties.result });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});