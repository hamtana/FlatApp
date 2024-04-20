const mysql = require('mysql2');
try {var connection = require("./database.js");
} catch (error) {console.log(error);}
const fs = require('fs');
const path = require('path');
var readline = require('readline');

// CREATE TABLE user (id INT PRIMARY KEY AUTO_INCREMENT,name VARCHAR(255) NOT NULL,email VARCHAR(255) NOT NULL,password VARCHAR(255) NOT NULL);
function insertUser(id, name, email, password) {
    connection.connect(function(err) {
        var sql = "INSERT INTO user (id, name, email, password) VALUES ('" + id + "', '" + name + "', '" + email + "', '" + password + "')";
        connection.query(sql, function (err, result) {
        console.log("1 record inserted");
        if (err) {
            console.log(err);
            return 0;
        }
        return 1;
        });
    });
}

module.exports = {
    insertUser
};