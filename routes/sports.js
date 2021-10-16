const express = require('express');
var ObjectId = require('mongoose').Types.ObjectId;
const Sport = require('../models/whitelist');
// const { validationResult } = require('express-validator');
// const { courseValidators } = require('../utils/validators');

const router = express.Router();

router.post('/add', async (req, res) => {
    try {
        const { title, start_date, start_millis, end_date, end_millis, location } = req.body;
        res.status(200).json(addSportActivity(title, new Date(start_date), start_millis, new Date(end_date), end_millis, location));
        
        //addParticipant();
        //return;
        //const event = await Sport.findOne({ start_date });

        // if(event) {
        //     //send event exists response
        //     // req.flash('error', 'User with this email already exists');
        //     // res.redirect('/auth/login#login');//user exists and we redirect for log in
        // }
        
        //res.redirect('/auth/login#login');
    }
    catch (e) {
        console.log(e);
    } 
});

router.post('/add-participant', async (req, res) => {
    try {
        const { date, title, fullname } = req.body;

        const msg = addParticipant(new Date(date), title, fullname) == 1 ? 
            `Participant: ${fullname} has been registered on ${title} on ${date}.` :
            `Participant was already registered on ${title} on ${date}.`;
        res.send(`{ "message": ${msg} }`);
    }
    catch (e) {
        console.log(e);
    } 
});

router.post('/get-day', async (req, res) => {
    try {
        const { date } = req.body;

        await getSportDay(new Date(date)).then(v => {
            res.send(v);
        });
    }
    catch (e) {
        console.log(e);
    } 
});


router.post('/remove-participant', async (req, res) => {
    try {
        const { date, title, fullname } = req.body;

        const msg = removeParticipant(new Date(date), title, fullname) == 1 ? 
            `Participant: ${fullname} has been removed from ${title} on ${date}.` :
            `Participant was not found on ${title} on ${date}.`;
        res.send(`{ "message": ${msg} }`);
    }
    catch (e) {
        console.log(e);
    } 
});

async function addSportActivity(title, start_date, start_millis, end_date, end_millis, location){

    // var filter = { 
    //     "$and": [
    //         { "$eq": [{ "$year": "$start_date" }, start_date.getFullYear() + 1] },
    //         { "$eq": [{ "$month": "$start_date" }, start_date.getMonth() + 1] },
    //         { "$eq": [{ "$dayOfMonth": "$start_date" }, start_date.getDay()] },
    //         { 'title': title }
    //     ]
    // };

    // const result = await Sport.findOne({ filter });
    // var error;
    // if(result != null){
    //     return {
    //         error: `${title} is already taking place on ${start_date.toString()}.`,
    //         modified: 0
    //     };
    // }

    await new Sport({
        title, 
        start_date, 
        end_date,
        start_millis,
        end_millis,
        location
    }).save();

    return {
        error: '',
        modified: 1
    };
}

async function removeSportActivity(title, start_date, end_date, location){

    var filter = { 
        $and: [
            { "$expr": { "$eq": [{ "$year": "$start_date" }, start_date.getFullYear() + 1] } },
            { "$expr": { "$eq": [{ "$month": "$start_date" }, start_date.getMonth() + 1] } },
            { "$expr": { "$eq": [{ "$dayOfMonth": "$start_date" }, start_date.getDay()] } },
            { 'title': title }
          ]
    };

    // const result = await Sport.findOne({ filter });
    // var error;
    // if(result == null){
    //     return {
    //         message: `${title} was not found taking place on ${start_date.toString()}.`,
    //         modified: 0
    //     };
    // }

    const res = await Sport.deleteOne({ filter });

    return {
        message: `${title} was scheduled on ${start_date}`,
        modified: 1
    };
}

async function addParticipant(date, sport, fullname){
    var filter = { 
        $and: [
            { "$expr": { "$eq": [{ "$year": "$start_date" }, date.getFullYear() + 1] } },
            { "$expr": { "$eq": [{ "$month": "$start_date" }, date.getMonth() + 1] } },
            { "$expr": { "$eq": [{ "$dayOfMonth": "$start_date" }, date.getDay()] } },
            { 'title': sport },
            { 'participants.list': { $nin: fullname} },
          ]
    };
    var update = { $push: { 'participants.list': fullname } };

    const result = await Sport.updateOne(filter, update);

    return result.nModified;
}

async function removeParticipant(date, sport, fullname){
    var filter = { 
        $and: [
            { "$expr": { "$eq": [{ "$year": "$start_date" }, date.getFullYear() + 1] } },
            { "$expr": { "$eq": [{ "$month": "$start_date" }, date.getMonth() + 1] } },
            { "$expr": { "$eq": [{ "$dayOfMonth": "$start_date" }, date.getDay()] } },
            { 'title': sport },
            { 'participants.list': { $in: fullname} },
        ]
    };
    var update = { $pull: { 'participants.list': fullname } };

    const result = await Sport.updateOne(filter, update);
    console.log('Modified: ' + result.nModified);

    return result.nModified;
}

async function getSportDay(date){
    var filter = { 
        $and: [
            { "$expr": { "$eq": [{ "$year": "$start_date" }, date.getFullYear()] } },
            { "$expr": { "$eq": [{ "$month": "$start_date" }, date.getMonth() + 1] } },
            { "$expr": { "$eq": [{ "$dayOfMonth": "$start_date" }, date.getUTCDate() + 1] } }
          ]
    };
    const result = await Sport.find(filter);
    //console.log(result.toStr);

    return JSON.stringify({
        sports: result
    });
}

module.exports = router;