const cron = require("node-cron");
const Job = require('../models/Job');
const sf = require('../service/view-deploy');
const { Op } = require("sequelize");

const schedule = ()=> {
    cron.schedule("*/10 * * * *", function () {
        Job.findAll({
            where: {
                status:{
                    [Op.in]: ["Waiting", "Error"]
                }
            }
        }).then(jobs => jobs.forEach(j => sf.deployAndMonitor(j)))
    });
}
module.exports = schedule;