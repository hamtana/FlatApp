const express = require('express');
const mysql = require('mysql2');
try {
    var connection = require("./database.js");
    var {insertUser} = require("./dataQueries.js")
} catch (error) {console.log(error);}
const fs = require('fs');
const path = require('path');
var readline = require('readline');


const app = express();
const port = 8080;

// ==============================================
/** Sets up the database with the right tables. 
 * 
 */
// ==============================================


//Read the contents of setup.sql
// Cannot have gaps between code segments
var rl = readline.createInterface({
    // Gets the sql file to read
    input: fs.createReadStream('./sql/setup.sql'),
    terminal: false
   });
  rl.on('line', function(chunk){
       connection.query(chunk.toString('ascii'), function(err, sets, fields){
       // Error checking on the sql file
       // if (err != "Error: Query was empty")  {console.log(err)}
      });
  });

  insertUser(123, "cat", "test@getMaxListeners.com", "testiong");
  insertUser(123, "cat", "test@getMaxListeners.com", "testiong");

// ==============================================



// ==============================================
/** All the app.uses go here.
 *  - These link to different routers which control different aspects of the app
 */
// ==============================================
app.use(express.static('public'));
app.use('/path', require('./path_router'));

//use the views ejs files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// ==============================================



// ==============================================
/** This section starts the app an has any error handling routes on the
 *  base level.
 */
// ==============================================

// Define the route if someone goes somewhere where there is no html file
app.get('*', (req, res) => {
    // This directs the router to the specific file
    res.sendFile(path.join(__dirname, 'public','home.html'));
});

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
