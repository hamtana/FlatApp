const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const con = require('./database.js');
const { get } = require('https');
const crypto = require('crypto');


// or via CommonJS
const Swal = require('sweetalert2');
const { error } = require('console');
const { render } = require('ejs');
router = express.Router();
// npm i body-parser

router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.use(session({
    secret: 'secret',
    resave: true,
    cookie: { maxAge: 300000 },
    saveUninitialized: true
}));// router.use(bodyParser.json());


// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/login");
    }
};
try {
    var connection = require("./database.js");
    var { insertUser,
        insertGroup, insertTask,
        insertGroupUser,
        returnTable,
        getGroups,
        getUser,
        getUserByEmail,
        getGroupById,
        getGroupTasksDueWeek,
        getGroupTasksToday,
        getGroupTasksTomorrow,
        getGroupTasksByGroupId,
        getGroupsByUser,
        checkEmailAndPassword,
        updateTaskStatus,
        getGroupTasksByUserId,
        joinGroupUsingKey,
        getGroupByJoinCode,
        joinGroupByCode,
        getUsersinGroup, checkIfUserIsMember,
    } = require("./dataQueries.js")

} catch (error) { console.log(error); }


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
    res.render('main');
});

router.get('/index', async (req, res) => {
    // Test to see if session is active
    console.log(req.session.email);
    res.render('index');
});

router.get('/login', async (req, res) => {

    res.render('login', {
        error: ''
    });

});


router.get('/createAccount', async (req, res) => {
    res.render('createAccount', {
        error: '',
        accountCreated: false
    });
});

//Router to get the ViewGroupTasks. 
router.get('/viewGroupTask/:id', isAuthenticated, async (req, res) => {

    if (req.session.loggedin == false) {
        res.redirect('/login');
    }
    group_id = req.params.id;
    console.log(group_id);

    const group = await getGroupById(group_id);
    const group_tasks = await getGroupTasksByGroupId(group_id);

    const tasks_today = await getGroupTasksToday(group_id);
    const tasks_tomorrow = await getGroupTasksTomorrow(group_id);
    const tasks_week = await getGroupTasksDueWeek(group_id);

    //logging each for testing.


    res.render('viewGroupTask', { group: group, tasks: group_tasks, tasks_today: tasks_today, tasks_tomorrow: tasks_tomorrow, tasks_week: tasks_week });
});

//Router to view the task for a particular user within a group. 


router.get('/createIndividualTask', async (req, res) => {

    res.render('createIndividualTask');
});

router.get('/userHomePage', async (req, res) => {

    if (req.session.loggedin == false) {

        res.redirect('/login');
    } else {
        res.render('userHomePage', {
            user: req.session.userObject,
            group: req.session.groupSession,
            tasks: req.session.tasks,
            isAdded: false,
            loggedIn: req.session.loggedin

        });
    }

});

router.get('/userHomePage/:id', async (req, res) => {
    id = req.params.id;

    if (req.session.loggedin == false) {

        res.redirect('/login');
    }

    const userResults = await getUser(id);


    const sessionObject = userResults[0];
    const groubObj = await getGroupsByUser(sessionObject.id);
    const tasksList = await getGroupTasksByUserId(sessionObject.id);

    res.render('userHomePage'), {
        user: sessionObject,
        group: groubObj,
        isAdded: true,
        tasks: tasksList
    }

});


router.get('/createGroupTask', async (req, res) => {
    let membersArr = [];
    const group_id_param = req.body.group_id;
    membersArr = await getUsersinGroup(group_id_param);
    console.log(membersArr);
    res.render('createGroupTask', {
        members: membersArr

    });


});

router.get('/createtask', async (req, res) => {
    res.render('createTask');
});

router.post('/create/createTask', async (req, res) => {

    //Collect all of the data from the form using multer
    const task_name = req.body.taskName;
    const description = req.body.description;

    //log data in the console so that is visible for testing. 
    console.log(task_name, description);

    //insert the data into the database
    try {
        insertTask(task_name, description);
    } catch (err) {
        res.status(500).send("Error fetching data from database");
        console.error(err);
    }

    res.redirect('/create/');
});

router.post('/create/createGroupTask', async (req, res) => {
    const group_id = req.session.group_id;
    const task_name = req.body.taskName;
    const description = req.body.description;
    const due_date = req.body.due_date;
    const user_id = req.session.user.id;
    const status = req.body.status;

    console.log(group_id, task_name, description, due_date, user_id, status);
    insertGroupTask(group_id, task_name, description, due_date, user_id, status);
    res.redirect('/createGroupTask');
}
);






router.get('/viewYourTask', async (req, res) => {
    tasks = [];

    try {
        const [taskRes] = await returnTable("task");

        users = taskRes;

        console.log(users.name + " is test user's name");

    } catch (err) {
        res.status(500).send("Error fetching data from database");
        console.error(err);
    }

    res.render('viewYourTask', {
        title: 'View Your Task'

    });

});






router.post('/auth', async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        // Perform authentication query
        const userResults = await checkEmailAndPassword(email, password);
        console.log("UserREsults are : \n" + userResults);
        if (userResults != null) {
            // Authentication successful
            //USER OBJECT

            const sessionObject = userResults[0];
            console.log("Session Object"+sessionObject.name);
            const groubObj = await getGroupsByUser(sessionObject.id);
            const tasksList = await getGroupTasksByUserId(sessionObject.id);
            console.log(tasksList);
            console.log(sessionObject);
            console.log(sessionObject.name);
            console.log(sessionObject.body);
            //SETS SOME SESSIONS UP
            req.session.loggedin = true;
            req.session.email = email;
            req.session.name = sessionObject.name;
            req.session.user = sessionObject;
            req.session.groupSession = groubObj;
            req.session.tasks = tasksList;


            res.locals.groupSession = groubObj;



            console.log(groubObj);
            //Global data for all ejs templates
            
            res.locals.email = req.session.email;
            res.locals.name = req.session.name;
            res.locals.loggedIn = req.session.loggedin;
            res.locals.user = sessionObject;
            res.locals.groupSession = groubObj;
            res.locals.tasks = tasksList;

            // Render userHomePage with user and group data
            req.session.save();
            res.render('userHomePage', {
                user: sessionObject,
                group: groubObj,
                isAdded: true,
                tasks: tasksList
            });
        }

        else {
            // Authentication failed
            res.render('login', {
                error: 'Incorrect email or password!'
            });
        }
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).send('Internal Server Error');
    }
});



router.get('/logout', async (req, res) => {

    req.session.destroy(function (err) {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});


// Routing for Create Account
router.post('/create-account', async (req, res) => {


    // Collect all of the data from the form using multer
    const name = req.body.name;
    const phone_number = req.body.phone_number;
    const email = req.body.email;
    const address = req.body.address;
    const password = req.body.password;

    //log data in the console so that is visible for testing. 
    console.log(name, phone_number, email, address, password);
    const doesUserExist = await getUserByEmail(email);
    if (doesUserExist != null) {
        res.render('createAccount', {
            error: 'User already exists',
            accountCreated: false
        });
    } else {
        //insert the data into the database
        insertUser(name, phone_number, email, address, password);
        res.render('createAccount', {
            error: '',
            accountCreated: true
        })

    }
});


//Routing for Create Group


router.post('/create/group', async function (req, res) {
    const groupNameResult = req.body.groupName;

    console.log(groupNameResult);
    // Join COde
    const min = 100000;
    const max = 999999;
    const joinCode = Math.floor(Math.random() * (max - min + 1)) + min;
    insertGroup(groupNameResult, joinCode);
    res.redirect('/createGroup');
});


//Routing for Add User to Group
router.post('/addMember', async (req, res) => {

    console.log(req.body);
    //Collect all of the data from the form using multer
    let group_id = req.body.group;
    let user_email = req.body.email;

    //query the database to retrieve the user_id, and group_id
    let user = await getUserByEmail(user_email);
    let group = await getGroupById(group_id);

    let allGroups = await getGroups();
    //get the user id out of user
    if (user == null) {
        res.render('addNewMemberToExistingGroup', {
            groups: allGroups,
            error: true
        });
        return
    } else {
        let user_id = user[0].id;
        //insert the data into the database
        insertGroupUser(user_id, group_id);
        res.redirect('/addUserToGroup');

    }
});


//Routing for add user to group.
router.get('/addUserToGroup', async (req, res) => {
    try {
        // Fetch groups asynchronously
        const groups_data = await getGroups();
        // Render the EJS template with the fetched groups
        res.render('addNewMemberToExistingGroup', { groups: groups_data, error: false });
        // console.log(groups_data);
    } catch (error) {
        // Handle error
        console.error("Error fetching groups:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/joinGroupWithCode', async (req, res) => {
    console.log("BODY" + req.body);
    const groupCode = req.body.join_code;
    console.log(groupCode);
    const userId = req.body.user_id;
    // console.log(userId);

    // try {
    //     const group = await getGroupByJoinCode(groupCode);

    //     if (group && group.length > 0) {
    //         // Check if the user is already a member of the group
    //         const isMember = checkIfUserIsMember(userId, groupCode); // You need to implement this function

    //         if (isMember) {
    //             // User is already a member
    //             // Display a message or redirect the user
    //             // For example:
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Oops...',
    //                 text: 'You are already a member of this group!',
    //             });
    //             return res.redirect('/userHomePage');

    //         } else {
    //             // User is not a member, proceed to join the group
    //             joinGroupByCode(userId, groupCode);
    //             return res.redirect('/userHomePage');
    //         }
    //     } else {
    //         // Group code does not exist
    //         // Display an error message or redirect the user
    //         // For example:
    //         // return res.redirect('/userHomePage?error=wrong_code');
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Oops...',
    //             text: 'Group code does not exist!',
    //         });
    //         return res.redirect('/userHomePage');
    //     }
    // } catch (error) {
    //     console.error("Error joining group:", error);
    //     // Handle other errors if any
    //     // Display an error message or redirect the user
    //     // For example:
    //     // return res.redirect('/userHomePage?error=server_error');
    //     Swal.fire({
    //         icon: 'error',
    //         title: 'Oops...',
    //         text: 'An error occurred while joining the group!',
    //     });
    //     return res.redirect('/userHomePage');
    // }


    const group = await getGroupByJoinCode(groupCode);
   const isMember = checkIfUserIsMember(userId, groupCode); // You need to implement this function

    //     if (group && group.length > 0
    if (group != null && isMember == false) {
        joinGroupByCode(userId, groupCode);
        res.redirect('/userHomePage');

        // res.render('userHomePage'), {
        //     groups: req.session.groupSession,
        //     user: req.session.user,
        //     loggedIn: true,
        //     tasks: req.session.tasks
        // }r

    } else {

    }
}
);




// Create Group Page Router
router.get('/createGroup', isAuthenticated, async (req, res) => {
    const userData = req.session.user;
    console.log(userData);
    res.render('createGroup', {
    });
});


//REturn Table
router.get('/returnTable', async (req, res) => {
    usersArr = [];
    groupsArr = [];
    tasksArr = [];

    try {
        const usersRes = await returnTable("user");
        const groupsRes = await returnTable("`group`");
        const tasksRes = await returnTable("task");
        usersArr = usersRes;
        groupsArr = groupsRes;
        tasksArr = tasksRes;


        res.render('test', {
            users: usersArr,
            groups: groupsArr,
            tasks: tasksArr
        });


    } catch (err) {
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



module.exports = router;