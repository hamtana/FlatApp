const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

// Define a route
app.get('/', (req, res) => {
    // This directs the router to the specific file
    res.sendFile(path.join(__dirname, 'public','index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port http://${port}`);
});