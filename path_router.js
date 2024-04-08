const express = require('express');
const pool = require('./db');
router = express.Router();

router.get('/', async (req, res) => {
    res.redirect('/index')
});

router.get('/index', async (req, res) => {
    
});


module.exports = router;