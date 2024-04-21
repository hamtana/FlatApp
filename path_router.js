const express = require('express');
const multer = require('multer');
try {
    var connection = require("./database.js");
    var {insertUser,insertGroup,insertTask,insertGroupUser,returnTable} = require("./dataQueries.js")
} catch (error) {console.log(error);}
router = express.Router();

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
    res.send('Base path');
});

router.get('/index', async (req, res) => {
    res.send('Index test');
});


router.get('/createTask', async (req, res) => {

    res.send('Create task');
});

router.post('/createIndividualTask', async (req, res) => {
    
    //Collect all of the data from the form using multer

    const task_name = req.body.taskName;
    const description = req.body.description;
    const due_date = req.body.dueDate;
    const assignee = req.body.assignee;

    //log data in the console so that is visible for testing. 
    console.log(task_name, description, due_date, assignee);

    //insert the data into the database
    insertTask(task_name, description, due_date, assignee);

    res.redirect('/createIndividualTask');


});

module.exports = router;