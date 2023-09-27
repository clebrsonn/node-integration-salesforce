const cron = require("node-cron");
const Job = require('../models/Job');
const sf = require('../service/view-deploy')

const schedule = ()=> {
    cron.schedule("*/10 * * * *", function () {
        Job.findAll({
            where: {
                status: "InProgress"
            }
        }).then(jobs => jobs.forEach(j => sf.deployAndMonitor(j)))
    });
}
module.exports = schedule;