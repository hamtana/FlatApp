const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const con = require('./database.js');
router = express.Router();
// npm i body-parser


router.use(bodyParser.urlencoded({ extended: true }));
// router.use(bodyParser.json());




try {
    var connection = require("./database.js");
    var {insertUser,insertGroup,insertTask,insertGroupUser,returnTable} = require("./dataQueries.js")
} catch (error) {console.log(error);}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    res.render('index');
});

router.get('/index', async (req, res) => {
    res.render('index');
});

router.get('/createGroupTask', async (req, res) => {
    res.render('createGroupTask');
});
router.get('/createAccount', async (req, res) => {
    res.render('createAccount');
});

router.get('/createIndividualTask', async (req, res) => {

    res.render('createIndividualTask');
});

router.get('/login', async (req, res) => {
    res.render('login');
});

// Routing for Create Individal Task
router.post('/createIndividualTask', async (req, res) => {
    
    //Collect all of the data from the form using multer
    console.log(req.body);
    // const task_name = req.body.taskName;
    // const description = req.body.description;
    // const due_date = req.body.dueDate;
    // const assignee = req.body.assignee;

    // //log data in the console so that is visible for testing. 
    // console.log(task_name, description, due_date, assignee);

    // //insert the data into the database
    // insertTask(task_name, description, due_date, assignee);

    res.redirect('/createIndividualTask');


});

//Routing for Create Account
router.post('/create-account', async (req, res) => {


    // Collect all of the data from the form using multer
    const name = req.body.name;
    const phone_number = req.body.phone_number;
    const email = req.body.email;
    const address = req.body.address;

    const password = req.body.password;

    //log data in the console so that is visible for testing. 
    console.log(name, phone_number, email, address, password);

    //insert the data into the database
    insertUser(name, phone_number, email,address, password);

    res.redirect('/createAccount');

});

//Routing for Create Group


router.post('/create/group', async function (req, res) {

    const groupNameResult = req.body.groupName;

    console.log(groupNameResult);

    try{
         await insertGroup(groupNameResult);
    } catch (err) {
        return res.status(500).send(err);
    }
    res.redirect('/createGroup');
});
// router.post('/create/group', function (req, res) {
//     let groupNameResult = req.body.groupName;
//     console.log(req.body);

//     console.log(groupNameResult);

//     // Call insertGroup with a callback function
//     insertGroup(groupNameResult, function(err) {
//         if (err) {
//             return res.status(500).send(err);
//         }
//         res.redirect('/createGroup');
//     });
// });




//Routing for Add User to Group - INCOMPLETE
router.post('/addUserToGroup', async (req, res) => {

    //Collect all of the data from the form using multer
    const group_id = req.body.groupID;
    const user_id = req.body.userID;

    //log the data in the console so it is visible for testing. 
    console.log(group_id, user_id);

    //insert the data into the database
    insertGroupUser(group_id, user_id);

});

//Routing for login
router.get('/login', async (req, res) => {

    //gather data for email and password
    const email = req.body.email;
    const password = req.body.password;

    //log the data in the console so it is visible for testing.
    console.log(email, password);

    //check against the data in the database
    returnTable('users');

    //insert code needed to check against the database here.
    //if the email and password match, redirect to the home page.
    //ASK GROUP ABOUT THIS


    //if the email and password do not match, redirect to the login page with an error message.
    res.redirect('/login');




    res.send('Login');
});



// Create Birds Page Router
router.get('/createGroup', async (req, res) => {
    res.render('createGroup', {
    });
  });


//REturn Table
router.get('/returnTable', async (req, res) => {
    users = [];
    groups = [];
    
    try{
    const [usersRes]  = await returnTable("user");
    const [groupsRes] = await returnTable("`group`");
    users = usersRes;
    groups = groupsRes;

    console.log(users.name + " is test user's name");
    console.log(groups.name + " is test group's name");

    }catch (err) {
        console.error("You havent set up the database yet!");
        res.status(500).send("Error fetching data from database");

        console.error(err);
      }

    res.render('test', {
        users: users,
        groups: groups

    });
  });

module.exports = router;