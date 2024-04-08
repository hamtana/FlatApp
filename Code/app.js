const express = require('express');

const path = require('path');

const app = express();
const port = 3000;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


/* host public/ directory to `
serve: images, css, js, etc. */
app.use(express.static('public'));

// Define a route
// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

app.use('/', require('./path_router'));


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port http://${port}`);
});