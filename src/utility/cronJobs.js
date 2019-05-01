var schedule = require('node-schedule');
const db = require("../models/index");


schedule.scheduleJob('*/2 * * * * *', (b)=>{
    console.log("cronJobs....", b);
    db.AboutApp.find({}, (err, result) => {
        console.log(result);
    })
});