const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session')



const app = express();
app.set('trust proxy', 1) // trust first proxy
app.use(session({
	secret: 'secret',
	resave: true,
    cookie: { maxAge: 300000 },
	saveUninitialized: true
}));
// Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
 
// Middleware to parse URL-encoded bodies

const mysql = require('mysql2');
try {
    var connection = require("./database.js");
    var {insertUser,insertGroup,insertTask,insertGroupUser,returnTable} = require("./dataQueries.js")
} catch (error) {console.log(error);}
const fs = require('fs');
var readline = require('readline');


// const port = 8080;


// ==============================================
/** Sets up the database with the right tables. 
 * 
 */
// ==============================================


// //Read the contents of setup.sql
// // Cannot have gaps between code segments
// var rl = readline.createInterface({
//     // Gets the sql file to read
//     input: fs.createReadStream('./sql/setup.sql'),
//     terminal: false
//    });
//   rl.on('line', function(chunk){
//        connection.query(chunk.toString('ascii'), function(err, sets, fields){
//        // Error checking on the sql file
//        // if (err != "Error: Query was empty")  {console.log(err)}
//       });
//   });

 
//   insertGroupUser(1, 1);
//   console.log("Group User is " + returnTable("group_user"));
//   connection.connect(function(err) {
//     if (err) throw err;
//     //Select all customers and return the result object:
//     connection.query("SELECT * FROM " + "user", function (err, result, fields) {
//       if (err) throw err;
//       console.log(result);
//     });
//   });

// ==============================================



// ==============================================
/** All the app.uses go here.
 *  - These link to different routers which control different aspects of the app
 */
// ==============================================
//use the views ejs files
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '/public/')));

app.use('/', require('./path_router'));


// ==============================================



// ==============================================
/** This section starts the app an has any error handling routes on the
 *  base level.
 */
// ==============================================

// Define the route if someone goes somewhere where there is no html file
app.get('*', (req, res) => {
    // This directs the router to the specific file
    // res.sendFile(path.join(__dirname, 'public','home.html'));
    // res.render('path/index');
    res.status(404).send('404 Page Not Found');
});

const port = 8080 || process.env.PORT;

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});

// ==============================================







// ==============================================
/** Unused Code goes here. 
 *  
 * 
 */
// ==============================================
//app.set('view engine', 'ejs');
//app.set('views', path.join(__dirname, 'views'));

// Define a route
// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });
// ==============================================
