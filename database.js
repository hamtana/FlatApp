var mysql = require('mysql2');
const dbConfig = require("./db.config.js");

//Local
// var con = mysql.createConnection({
//   host: "127.0.0.1",
//   user: "root",
//   password: "password",
//   database: "database",
//   multipleStatements: true
//  // port: 3306
// });


/*
Heroku
*/
var con = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  multipleStatements: true
 // port: 3306
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = con;