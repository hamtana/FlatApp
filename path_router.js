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
    var {insertUser,insertGroup,insertTask,insertGroupUser,returnTable,getGroups, getUser, getUserByEmail} = require("./dataQueries.js")
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

router.get('/create/task', async (req, res) => {
    res.render('createTask');
});

router.post('/create/createTask', async (req, res) => {

    //Collect all of the data from the form using multer
    const task_name = req.body.taskName;
    const description = req.body.description;

    //log data in the console so that is visible for testing. 
    console.log(task_name, description);

    //insert the data into the database
    try{
        insertTask(task_name, description);
    }catch (err) {
        res.status(500).send("Error fetching data from database");
        console.error(err);
        }

    res.redirect('/create/task');
});

router.get('/viewYourTask', async (req, res) => {
    tasks = [];
    
    try{
    const [taskRes]  = await returnTable("task");
   
    users = taskRes;

    console.log(users.name + " is test user's name");

    }catch (err) {
        res.status(500).send("Error fetching data from database");
        console.error(err);
      }

    res.render('viewYourTask',{
        title: 'View Your Task'
        
    });

});

router.get('/login', async (req, res) => {
    res.render('login');
});

// Routing for Create Individual Task
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
    insertGroup(groupNameResult);
    res.redirect('/createGroup');
});


//Routing for Add User to Group
router.post('/addMember', async (req, res) => {

    console.log(req.body);
    //Collect all of the data from the form using multer
    const group_id = req.body.group_name;
    const user_email = req.body.email;

    //log the data in the console so it is visible for testing. 
    console.log(user_email);
    console.log(group_id);

    //query the database to retrieve the user_id, and group_id
    let user = await getUserByEmail(user_email);

    //get the user id out of user
    let user_id = user[0].id;

    
    //insert the data into the database
    // insertGroupUser(user_id,group_id);

});


//Routing for add user to group.
router.get('/addUserToGroup', async (req, res) => {
    try {
        // Fetch groups asynchronously
        const groups_data = await getGroups();

        // Render the EJS template with the fetched groups
        res.render('addNewMemberToExistingGroup', { groups: groups_data });
    } catch (error) {
        // Handle error
        console.error("Error fetching groups:", error);
        res.status(500).send("Internal Server Error");
    }
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



// Create Group Page Router
router.get('/createGroup', async (req, res) => {
    res.render('createGroup', {
    });
  });


//REturn Table
router.get('/returnTable', async (req, res) => {
    usersArr = [];
    groupsArr = [];
    tasksArr = [];
    
    try{
    const usersRes  = await returnTable("user");
    const groupsRes = await returnTable("`group`");
    const tasksRes = await returnTable("task");
    usersArr = usersRes;
    groupsArr = groupsRes;
    tasksArr = tasksRes;

    console.log(usersArr);
    console.log(groupsArr);
    console.log(tasksArr);


    res.render('test', {
        users: usersArr,
        groups: groupsArr,
        tasks: tasksArr


    });


    }catch (err) {
        console.error("You havent set up the database yet!");
        res.status(500).send("Error fetching data from database");

        console.error(err);
      }

  
  });



var getUserOrLogin = function (req, res, next) {
    var user = req.session.user;
  
    if (user == null) {
      req.session.backTo = req.originalUrl; 
      res.redirect('/login');
    } else {
      req.user = user;
      next();
    }
  };

  var getUser = function (req) {
    var user = req.session.user;
  
    if (user == null) {
      throw('Error');
    } else {
      return user;
    }
  };

module.exports = router;