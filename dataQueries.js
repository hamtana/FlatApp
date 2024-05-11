const mysql = require('mysql2');

try {
    var connection = require("./database.js");
} catch (error) { console.log(error); }
const fs = require('fs');
const path = require('path');
var readline = require('readline');
const con = require('./database.js');

// ==============================================
/** All the insert functions to insert a field to the table 
 * 
 */
// ==============================================


// CREATE TABLE user (id INT PRIMARY KEY AUTO_INCREMENT,name VARCHAR(255) NOT NULL,email VARCHAR(255) NOT NULL,password VARCHAR(255) NOT NULL);
function insertUser(name, phone_number, email, address, password) {

    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO user (name, phone_number, email, address, password) VALUES (?, ?, ?, ?, ?)", [name, phone_number, email, address, password], function (err, result) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log("1 record inserted");
                resolve(result);
            }
        });
    });
}





    //Query to get User by Email - SELECT * FROM user WHERE email = ?
    function getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM user WHERE email = ?", [email], function (err, result) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log("Query successful");
                    resolve(result);
                }
            });
        });
    }

    // Function that performs a GET request to the database to get a group by its id
    function getGroupById(id) {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM `group` WHERE group_id = ?", [id], function (err, result) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log("Query successful");
                    resolve(result);
                }
            });
        });
    }
    // Functions to check if email and password in the database
    function checkEmailAndPassword(email, password) {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM user WHERE email = ? AND password = ?", [email, password], function (err, result) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else if (result.length > 0) {
                    console.log("Query successful");
                    resolve(result);
                }
            });
        });
    }

    //Function that retrieves the group tasks by group id
    //Retrieves all tasks that are associated with a group
    //Retrieve details name of the user from the user table
    function getGroupTasksByGroupId(id) {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM group_task JOIN task ON group_task.task_id = task.id JOIN user ON group_task.user_id = user.id WHERE group_id = ?", [id], function (err, result) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log("Query successful");
                    resolve(result);
                }
            });
        });
    }

    //Retrieve Group Tasks Due Today 
    // Uses Group ID to retrieve relevant tasks.
    function getGroupTasksToday(id) {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM group_task JOIN task ON group_task.task_id = task.id JOIN user ON group_task.user_id = user.id WHERE group_id = ? AND due_date = CURDATE()", [id], function (err, result) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log("Query successful");
                    resolve(result);
                }
            });
        });
    }

    //Get Group Tasks Due Tomorrow
    //Uses Group ID to retrieve relevant tasks.
    function getGroupTasksTomorrow(id) {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM group_task JOIN task ON group_task.task_id = task.id JOIN user ON group_task.user_id = user.id WHERE group_id = ? AND DATE_ADD(CURDATE(), INTERVAL 1 DAY) ", [id], function (err, result) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log("Query successful");
                    resolve(result);
                }
            });
        });
    }

    //Get Tasks due over the next 7 days 
    //Uses Group ID to retrieve relevant tasks.
    function getGroupTasksDueWeek(id) {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM group_task JOIN task ON group_task.task_id = task.id JOIN user ON group_task.user_id = user.id WHERE group_id = ? AND due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)", [id], function (err, result) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log("Query successful");
                    resolve(result);
                }
            });
        });
    }



    // QUERY TO GET GROUPS
    function getGroups() {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM `group`", function (err, result) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log("Query successful");
                    resolve(result);
                }
            });
        });
    }

    function joinGroupUsingKey(id, group_id) {
        return new Promise((resolve, reject) => {
            connection.query("INSERT INTO group_user (user_id, group_id) VALUES (?, ?)", [id, group_id], function (err, result) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                console.log("Query successful");
                resolve(result);
            }
            );
        });
    }


    // QUERY TO GET GROUPS User is in
    function getGroupsByUser(id) {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM group_user as gs join `group`\
         as g using(group_id) where gs.user_id = ? ", [id], function (err, result) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log("Query successful");
                    resolve(result);
                }
            });
        });
    }


    //CREATE TABLE group (group_id INT PRIMARY KEY AUTO_INCREMENT,name VARCHAR(255) NOT NULL);
    // function insertGroup(name) {
    //     return new Promise((resolve, reject) => {
    //         connection.connect(function(err) {
    //             if (err) {
    //                 console.log(err);
    //                 reject(err);
    //                 return;
    //             }

    //             var sql = "INSERT INTO `group` (name) VALUES (?)";
    //             connection.query(sql, [name], function (err, result) {
    //                 if (err) {
    //                     console.log(err);
    //                     reject(err);
    //                     return;
    //                 }
    //                 console.log("1 record inserted");
    //                 resolve(result);
    //             });
    //         });
    //     });
    // }

    function insertGroup(name) {
        connection.connect(function (err) {
            var sql = "INSERT INTO `group` (name) VALUES ('" + name + "');";
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
    function insertTask(title, description) {
        connection.connect(function (err) {
            var sql = "INSERT INTO task (title, description) VALUES ('" + title + "', '" + description + "');";
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
        connection.connect(function (err) {
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
        // const db = connection.promise();
        // try {
        //     const [rows, fields] = await db.query("SELECT * FROM " + table);
        //     console.log(rows);
        //     return rows;
        // } catch (err) {
        //     console.log(err);
        //     return [];
        // }

        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM " + table, function (err, result, fields) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }


    /* Carinn's one, not working, unsure why as it looks right
    function returnTable(table) {
        connection.connect(function(err) {
            connection.query("SELECT * FROM " + table, function (err, result, fields) {
            if (err) {
                console.log(err);
                return JSON.stringify({});;
            }
            return result;
            });
            
        });
    }
    // */
    // ==============================================




    module.exports = { insertUser, insertGroup, insertTask, insertGroupUser, returnTable, getGroups, getUserByEmail, getGroupById, getGroupTasksByGroupId, getGroupTasksToday, getGroupTasksTomorrow, getGroupTasksDueWeek, getGroupsByUser, checkEmailAndPassword };