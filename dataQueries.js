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

//CREATE TABLE task (id INT PRIMARY KEY AUTO_INCREMENT,title VARCHAR(255) NOT NULL,description VARCHAR(255) NOT NULL);
function insertTask(id, title, description) {
    connection.connect(function(err) {
        var sql = "INSERT INTO task (id, title, description) VALUES ('" + id + "', '" + title + "', '" + title + "');";
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

//CREATE TABLE group_user (user_id INT,group_id INT,PRIMARY KEY (user_id, group_id),FOREIGN KEY (user_id) REFERENCES user(id),FOREIGN KEY (group_id) REFERENCES `group`(group_id));
function insertGroupUser(id, group_id) {
    connection.connect(function(err) {
        var sql = "INSERT INTO group_user (user_id, group_id) VALUES ('" + id + "', '" + group_id + "');";
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

//CREATE TABLE group_task (status VARCHAR(255) NOT NULL,task_id INT,user_id INT,FOREIGN KEY (task_id) REFERENCES task(id),FOREIGN KEY (user_id) REFERENCES user(id));


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

module.exports = {insertUser, insertGroup,insertTask,insertGroupUser, returnTable};