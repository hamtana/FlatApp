const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const con = require('./database.js');
const { get } = require('https');
const crypto = require('crypto');
const { format } = require('date-fns');



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
        res.redirect("/createAccount");
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
        markTaskComplete,
        updateTaskStatus,
        getGroupTasksByUserId,
        joinGroupUsingKey,
        getGroupByJoinCode,
        joinGroupByCode,
        getUsersinGroup, checkIfUserIsMember,
        getCompleteTasksByGroupId,
        insertGroupTask,
        getUncompleteTasksByUserId,
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

router.get('/404-page', async (req, res) => {
    res.render('404-page');
}
);

router.get('/login', async (req, res) => {

    res.render('createAccount', {
        error: '',
        accountCreated: false
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
    const group_id = req.params.id;

    console.log(group_id);

    const group = await getGroupById(group_id);
    const group_tasks = await getGroupTasksByGroupId(group_id);

    const tasks_today = await getGroupTasksToday(group_id);
    const tasks_tomorrow = await getGroupTasksTomorrow(group_id);
    const tasks_week = await getGroupTasksDueWeek(group_id);

    console.log("Tasks This Week");
    console.log(tasks_week);

    //logging each for testing.


    res.render('viewGroupTask', { groupId: group_id,group: group, tasks: group_tasks, tasks_today: tasks_today, tasks_tomorrow: tasks_tomorrow, tasks_week: tasks_week });
});

//Routing to mark the task as complete.
router.post('/markComplete/:taskId', async (req, res) => {
    try {
        const taskId = req.params.taskId;
        // Call the function to mark the task as complete
        await markTaskComplete(taskId);
        //render the previous page
        res.redirect('back');
    } catch (error) {
        console.error("Error marking task as complete:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/createIndividualTask', async (req, res) => {

    res.render('createIndividualTask');
});

router.get('/userHomePage', async (req, res) => {

    if (req.session.loggedin == false) {

        res.redirect('/login');
    } else {

        let newGroupObject = await getGroupsByUser(req.session.user.id);
        // let newTaskList = await getGroupTasksByUserId(req.session.user.id);
        let newTaskList = await getUncompleteTasksByUserId(req.session.user.id);

        newTaskList.forEach(task => {
            if (task.due_date) {
              const date = new Date(task.due_date);
              task.due_date = format(date, 'dd MM yyyy');
            }
          });
        res.render('userHomePage', {
            user: req.session.user,
            // group: req.session.groupSession,
            group: newGroupObject,
            tasks: newTaskList,
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
    const tasksList = await getUncompleteTasksByUserId(sessionObject.id);

    tasksList.forEach(task => {
        if (task.due_date) {
          const date = new Date(task.due_date);
          task.due_date = format(date, 'dd MM yyyy');
        }
      });
    res.render('userHomePage'), {
        user: sessionObject,
        group: groubObj,
        isAdded: true,
        tasks: tasksList
    }

});


router.get('/createGroupTask/:id', async (req, res) => {
    let membersArr = [];
    const group_id_param = req.params.id;
    membersArr = await getUsersinGroup(group_id_param);
    console.log("Members Array" + membersArr);
    console.log("Group ID" + group_id_param);
    console.log("Group ID" + req.session.group_id);
    try{
    const groups = await getGroupsByUser(req.session.user.id);
    req.session.group_id = group_id_param;

    res.render('createGroupTask', {
        members: membersArr,
        groups: groups

    });

    }catch(error){
        res.redirect('/createAccount');

    }



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
    let due_date = req.body.dueDate;
    //Format this to only be day month and year
    // let date = new Date(due_date);
    // due_date =  format(due_date, 'dd MM yyyy');
    let user_id= req.body.selectAssignee;
    const status = req.body.status;

    console.log(group_id, task_name, description, due_date, user_id, status);
    try{
    await insertGroupTask(group_id, task_name, description, due_date, user_id, "Pending");
    res.redirect('/createGroupTask/' + group_id);

    }catch(error){
        res.render('404-page');
    }

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
        if (userResults != null) {
            // Authentication successful
            //USER OBJECT

            const sessionObject = userResults[0];
            // console.log("Session Object" + sessionObject.name);
            const groubObj = await getGroupsByUser(sessionObject.id);
            // const tasksList = await getGroupTasksByUserId(sessionObject.id);
         const tasksList = await getUncompleteTasksByUserId(sessionObject.id);

            tasksList.forEach(task => {
                if (task.due_date) {
                  const date = new Date(task.due_date);
                  task.due_date = format(date, 'dd/MM/yyyy');
                }
              });
            
            //SETS SOME SESSIONS UP
            req.session.loggedin = true;
            req.session.email = email;
            req.session.name = sessionObject.name;
            req.session.user = sessionObject;
            req.session.groupSession = groubObj;
            req.session.tasks = tasksList;


            res.locals.groupSession = groubObj;



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
            res.render('createAccount', {
                error: 'Incorrect email or password!',
                accountCreated: false
            });
        }
    } catch (error) {
        res.render('createAccount', {
            error: 'Incorrect email or password!',
            accountCreated: false
        });
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

try{
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
}catch(error){
    res.render('createAccount', {
        error: 'ERROR WITH DATABASE ',
        accountCreated: false
    });
}
});


//Routing for Create Group
// router.post('/create/group', async function (req, res) {
//     const groupNameResult = req.body.groupName;

//     console.log(groupNameResult);
//     // Join Code
//     const min = 100000;
//     const max = 999999;
//     const joinCode = Math.floor(Math.random() * (max - min + 1)) + min;
    
//     try {
//         await insertGroup(groupNameResult, joinCode);
//         const group = await getGroupByJoinCode(joinCode);
        
//         const group_id = group[0].group_id;
//         const user_id = req.session.user.id;

//         // Automatically add the user as a member of the group
//         await insertGroupUser(user_id, group_id);

//         // Redirect to the userHomePage after creating the group
//         res.redirect('/userHomePage');
//     } catch (error) {
//         console.error("Error creating group:", error);
//         res.status(500).send("Internal Server Error");
//     }
// });


router.post('/create/group', async function (req, res) {
    const groupNameResult = req.body.groupName;

    console.log(groupNameResult);
    // Join COde
    const min = 100000;
    const max = 999999;
    const joinCode = Math.floor(Math.random() * (max - min + 1)) + min;
    await insertGroup(groupNameResult, joinCode);

    const group = await getGroupByJoinCode(joinCode);
    const group_id = group[0].group_id;
    const user_id = req.session.user.id;

    try{
    await insertGroupUser(user_id, group_id);
    res.redirect('/viewGroupTask/' + group_id);

    }catch(error){
       
        res.render('404-page');
    }


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
            error: true,
            alreadyExists:false
        });
        return


    } else {
        try{
        let user_id = user[0].id;
        //insert the data into the database
        await insertGroupUser(user_id, group_id);
        res.redirect('/addUserToGroup');
    }catch(error){
        res.render('addNewMemberToExistingGroup', {
            groups: allGroups,
            error: false,
            alreadyExists:true
        });
    }
    }
   

});


//Routing for add user to group.
router.get('/addUserToGroup', async (req, res) => {

// router.get('/addUserToGroup/:id', async (req, res) => {
    try {
        // Fetch groups asynchronously
        // const groups_data = await getGroupById(req.params.id);
        const groups_data = await getGroups();
    

        // Render the EJS template with the fetched groups
        res.render('addNewMemberToExistingGroup', { groups: groups_data, error: false, alreadyExists:false });
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
    console.log(req.body);

    const userId = req.body.user_id;
    console.log(userId);

    const group = await getGroupByJoinCode(groupCode);
    const isMember = await checkIfUserIsMember(userId, groupCode); // You need to implement this function
    //     if (group && group.length > 0
    if (group != null && isMember == null) {
   
        try{
       await joinGroupByCode(userId, groupCode);
        
        res.redirect('/userHomePage');

        } catch (error) {
            console.error("Error joining group:", error);
            res.status(500).send("Internal Server Error");  
        }
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

router.get('/taskHistoryOfGroup/:group_id', async (req,res) => {
    // const group = await getGroupById(req.params.group_id);
    const tasksObj = await getCompleteTasksByGroupId(req.params.group_id);
    res.render('taskHistoryOfGroup', {tasks: tasksObj});


});


module.exports = router;