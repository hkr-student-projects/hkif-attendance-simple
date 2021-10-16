const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.render('index', {
        title: 'Home',
        isHome: true
    }); 
});

module.exports = router;

//uulgrVqkMcT6UiEJdWnF