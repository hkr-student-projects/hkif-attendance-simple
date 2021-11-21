const express = require('express');
const router = express.Router();
const qrcode = require('qrcode');
const crypto = require('crypto');
const Whitelist = require('../models/whitelist');
const User = require('../models/user');
const Token = require('../models/token');
const path = require('path');
// const SSEChannel = require('sse-pubsub');
// const channel = new SSEChannel({
    
// });
const SSEChannel = require('../helpers/sse.js');
const channel = new SSEChannel();

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

router.get('/test', async (req, res) => {
    res.render('test', {
        title: 'ID Test',
        layout: 'empty-test'
    }); 
});

router.get('/stream', async (req, res) => { 
    channel.subscribe(req, res);
    console.log('Subscribed client to server updates');
    //channel.subscribe(req, res); 
    // const { visitorId } = req.body;
    // const result = await isWhitelisted(visitorId);

    // if(!result.flag) {
    //     console.log("You are not a Sport Leader or Admin!");
    //     res.status(401).send("You are not a Sport Leader or Admin!");
    // }
    // else {
    //     console.log('Subscribed client to server updates');
    //     channel.subscribe(req, res); 
    // }  
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
        res.status(400).send("You are already in a system!");
    }
});

router.post('/verify', async (req, res) => {

    const { visitorId } = req.body;
    console.log("Body: " + req.body);
    console.log("Visitor ID: " + visitorId);
    const result = await isWhitelisted(visitorId);

    if(!result.flag) {
        console.log("You are not whitelisted!");
        res.status(401).send("You are not whitelisted!");
    }
    else {
        await generateQR().then((response) => {
            console.log("Whitelisted user connected! Showing QR code: " + response.token);
            res
                .status(200)
                .send(response); 
        });
        //res.status(200).send("You are already in a system!");
    }
});


router.get('/participate/:token', async (req, res) => {
    console.log("Client has scanned the QR code");

    res
    .type('html')
    .render('finger-printing', {
        title: 'finger-printing.hbs',
        layout: 'empty'
    }); 
    // .sendFile(path.resolve('views/test.html'));
});

router.post('/register/enroll', async (req, res) => {
    const { visitorId } = req.body;

    console.log("Participant is enrolled, ID: " + visitorId);

    await updateLeaderQR();
    //const result = await addParticipant(visitorId);

    res.status(200).send("You have been added to the sport event! Your ID: " + visitorId); 
});

async function updateLeaderQR() {
    await generateQR().then((response) => {
        console.log("Generated new QR for Leader");
        channel.publish(response.qr_image, 'event-updated-qr-code');
    });
}

async function generateQR() {
    console.log('Generating QR code');
    const token = crypto.randomBytes(16).toString('hex');
    //await addToken(token);

    // const random = (length = 8) => {
    //     return Math.random().toString(16).substr(2, length);
    // };

    //const token = random(14);

    const qr_image = await qrcode.toDataURL(`http://192.168.1.195:3000/participate/${token}`);
    //const qr_image = await qrcode.toDataURL(`http://192.168.1.195:3000/test`);
    console.log(`http://192.168.1.195:3000/participate/${token}`);

    return new Promise(function(resolve, reject) {
        resolve(
            {
                qr_image,
                token
            }
        );
    });
}

async function checkToken(token) {

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
    console.log("Found user: " + result);
    var update = { $push: { 'attendance': Date.now() } };    
    const result2 = await User.updateOne(filter, update);

    console.log("Updated user: " + result2);

    return result2;
}

module.exports = router;

//uulgrVqkMcT6UiEJdWnF