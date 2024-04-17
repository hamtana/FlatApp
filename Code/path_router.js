const express = require('express');
router = express.Router();

router.get('/', async (req, res) => {
    res.send('Base path');
});

router.get('/index', async (req, res) => {
    res.send('Index test');
});


router.get('/createTask', async (req, res) => {

    res.send('Create task');
});


module.exports = router;