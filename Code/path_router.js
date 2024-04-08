const express = require('express');
router = express.Router();

router.get('/', async (req, res) => {
    res.send('Base path');
});

router.get('/index', async (req, res) => {
    res.send('Index test');
});


module.exports = router;