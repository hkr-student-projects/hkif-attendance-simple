const express = require('express');
const router = express.Router();
const Whitelist = require('../models/whitelist');

router.get('/', async (req, res) => {

    const { visitorId } = req.body;
    const result = await isWhitelisted(visitorId);

    if(!result.flag) {
        console.log("Connected user is NOT whitelisted");
    }
    else {
        console.log("Connected user IS Whitelisted!");
    }

    res
    .status(result.flag ? 200 : 401)
    .render('index', {
        title: 'Home',
        isHome: true
    }); 
});

router.get('/whitelist/:id', async (req, res) => {

    const visitorId = req.params.id;
    const result = await isWhitelisted(visitorId);

    if(!result.flag) {
        await addDevice(visitorId);
        res.status(200).send("You have been whitelisted!");
    }
    else {
        res.status(302).send("You are already in a system!");
    }
});

module.exports = router;

async function isWhitelisted(visitorId) {
    var filter = { 
        $device: visitorId
    };
    const obj = await Whitelist.findOne(filter);

    console.log(obj);

    return {
        flag: obj != null,
        obj
    };
}

async function addDevice(visitorId) {
    await new Whitelist({
        device: visitorId
    }).save();
}

//uulgrVqkMcT6UiEJdWnF