const express = require('express');
const router = express.Router();
const qrcode = require('qrcode');
const crypto = require('crypto');
const Whitelist = require('../models/whitelist');
const User = require('../models/user');
const Token = require('../models/token');

router.get('/', async (req, res) => {

    // const { visitorId } = req.body;
    // const result = await isWhitelisted(visitorId);

    // if(!result.flag) {
    //     console.log("Connected user is NOT whitelisted");
    // }
    // else {
    //     console.log("Connected user IS Whitelisted!");
    // }

    // res
    // .status(result.flag ? 200 : 401)
    res.render('index', {
        title: 'Home',
        isHome: true
    }); 
});

router.get('/whitelist', async (req, res) => {

    const { visitorId } = req.body;
    console.log("ID to whitelist : " + visitorId);
    const result = await isWhitelisted(visitorId);

    if(!result.flag) {
        await addDevice(visitorId);
        console.log("You have been whitelisted!");
        res.status(200).send("You have been whitelisted!");
    }
    else {
        console.log("You are already in a system!");
        res.status(500).send("You are already in a system!");
    }
});

router.post('/verify', async (req, res) => {

    const { visitorId } = req.body;
    console.log("Body: " + req.body);
    console.log("Visitor ID: " + visitorId);
    const result = await isWhitelisted(visitorId);

    if(!result.flag) {
        console.log("You are not in the system!");
        res.status(500).send("You are not in the system!");
    }
    else {

        await generateQR().then((response) => {
            console.log("You are already in a system!");
            res
                .status(200)
                .send(response); 
        });

        
        //res.status(200).send("You are already in a system!");
    }
});



router.get('/participate/:token', async (req, res) => {
    console.log("Client has been Redirected from QR Code link.")
    res
    .status(200)
    .render('finger-printing', {
        layout: 'empty',
        title: 'Fingerprinting Page'
    }); 
});

router.get('/participate/enroll', async (req, res) => {

    const { visitorId } = req.body;
    const result = await addParticipant(visitorId);

    res.status(200).send("You have been added to the sport event!"); 
});

module.exports = router;


async function generateQR() {

    var token = null;

    crypto.randomBytes(24, async (err, buffer) => {
        const t = buffer.toString('hex');
        await addToken(t);
        token = t;
    });

    const qr_image = await qrcode.toDataURL(`http://192.168.1.195:3000/participate/${token}`);

    return new Promise(function(resolve, reject) {
        resolve(
            qr_image
        );
    });
}

async function isWhitelisted(visitorId) {
    var filter = { 
        device: visitorId
    };
    const obj = await Whitelist.findOne(filter);

    console.log("Visitor: " + visitorId + " \nresult: " + obj);

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

async function addToken(token) {
    await new Token({
        value: token
    }).save();
}

async function addParticipant(visitorId) {

    var filter = { 
        device: visitorId
    };
    const result = await User.findOne(filter);

    if(result == null) {
        await new User({
            device: visitorId,
        }).save();
        //ask name here
    }
    var update = { $push: { 'attendance': new Date() } };    
    const result2 = await User.updateOne(filter, update);

    console.log(result2);

    return result2;
}

//uulgrVqkMcT6UiEJdWnF