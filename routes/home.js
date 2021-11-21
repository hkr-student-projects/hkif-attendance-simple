const express = require('express');
const router = express.Router();
const qrcode = require('qrcode');
const crypto = require('crypto');
const Whitelist = require('../models/whitelist');
const Person = require('../models/person');
const Token = require('../models/token');
const path = require('path');
const SSEChannel = require('../helpers/sse.js');
const channel = new SSEChannel();
const moment = require('moment-timezone');

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
    if(channel.printLog) {
        console.log('Subscribed client to server updates');
    }
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

router.get('/whitelist/:token', async (req, res) => {
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
    const token = req.params.token;
    console.log("Token to check: " + token);
    const result = await checkToken(token);

    if(!result.flag) {
        res
            .status(404)
            .send("No such token exists: " + token);

        return;    
    }


    res
        .type('html')
        .render('finger-printing', {
            title: 'Fingerprint capture',
            token,
            layout: 'empty'
        });
});

router.post('/register/enroll', async (req, res) => {
    const { visitorId, token } = req.body;
    const token_result = await checkToken(token);

    if(!token_result.flag) {
        res
            .status(404)
            .send("No such token exists: " + token);

        return;    
    }

    await removeTokenDB(token);
    await updateLeaderQR();
    await addParticipant(visitorId).then((result) => {
        if(result) {
            console.log("Participant is enrolled, ID: " + visitorId);
            res.status(200).send("You have been added to the sport event! Your ID: " + visitorId); 
        }
        else {
            console.log("Participant tried to sign up again!");
            res.status(404).send("[Error]: You are already enrolled for this sport! Your ID: " + visitorId); 
        }
    }).catch((err) => {
        
    });
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
    await addTokenDB(token);

    const qr_image = await qrcode.toDataURL(`http://192.168.1.195:3000/participate/${token}`);
    //console.log(`http://192.168.1.195:3000/participate/${token}`);

    return new Promise(function(resolve, reject) {
        resolve(
            {
                qr_image,
                token
            }
        );
    });
}

async function addTokenDB(token) {
    await new Token({
        value: token
    }).save();
}

async function checkToken(token) {
    var filter = { 
        value: token
    };
    const obj = await Token.findOne(filter);

    console.log("checkToken: " + token + " \nresult: " + obj);

    return {
        flag: obj != null,
        obj
    };
}

async function removeTokenDB(token) {
    var filter = { 
        value: token
    };
    const obj = await Token.deleteOne(filter);

    console.log("removeTokenDB: " + token + " \nresult: " + obj);

    return {
        flag: obj != null,
        obj
    };
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

async function addParticipant(visitorId) {

    const filter = { 
        device: visitorId
    };
    const person = await Person.findOne(filter);

    if(person == null) {
        await new Person({
            device: visitorId,
        }).save();
        const dateSweden = moment.tz(Date.now(), "Europe/Stockholm");
        var update = { 
            $push: { 'attendance': { "date": dateSweden } } 
        };    
        const result2 = await Person.updateOne(filter, update);

        return new Promise(function(resolve, reject) {
            resolve(true);
        });
    }
    //console.log("Found user: " + result);

    const dateSweden = moment.tz(Date.now(), "Europe/Stockholm");
    var check = moment(dateSweden, 'YYYY/MM/DD');
    var month = check.format('M');
    var day = check.format('D');
    var year = check.format('YYYY');
    //TOO HARD COULD NOT FIGURE OUT HOW TO QUERY ARRAY OF DATES, sorry...
    //console.log("Month: " + month + " Day: " + day + " Year: " + year);// Today is 21 Nov 2021, output shows: Month: 11 Day: 21 Year: 2021
    //console.log("His attendance: " + person.attendance);
    // const filter2 = { 
    //     $and: [
    //         { 'device': visitorId },
    //         { 'attendance': { "$eq": [{ "$year": "$date" }, year] } }
    //     ]
    // };
    const date_list = person.attendance;
    let flag = true;
    date_list.forEach(d => {
        let check1 = moment(d.date, 'YYYY/MM/DD');
        let m = check1.format('M');
        let dd = check1.format('D');
        let y = check1.format('YYYY');

        if(y == year && m == month && dd == day) {
            console.log('Already signed up!');
            flag = false;
        }
    });
    console.log('Flag value: ' + flag);
    return new Promise(function(resolve, reject) {
        resolve(flag);
    });
}

module.exports = router;

//uulgrVqkMcT6UiEJdWnF