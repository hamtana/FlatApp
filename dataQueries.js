const mysql = require('mysql2');
try {var connection = require("./database.js");
} catch (error) {console.log(error);}
const fs = require('fs');
const path = require('path');
var readline = require('readline');

// ==============================================
/** All the insert functions to insert a field to the table 
 * 
 */
// ==============================================


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

//CREATE TABLE group (group_id INT PRIMARY KEY AUTO_INCREMENT,name VARCHAR(255) NOT NULL);
function insertGroup(id, name) {
    connection.connect(function(err) {
        var sql = "INSERT INTO `group` (id, name) VALUES ('" + id + "', '" + name + "');";
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
// ==============================================



// ==============================================
/** The functions for returing table data and specific data in .json format.
 * 
 */
// ==============================================

function returnTable(table) {
    connection.connect(function(err) {
        connection.query("SELECT * FROM " + table, function (err, result, fields) {
        console.log(result);
        if (err) {
            console.log(err);
            return JSON.stringify({});;
        }
        return result;
        });
        
    });
}

// ==============================================

module.exports = {insertUser, insertGroup, returnTable};