const cron = require("node-cron");
const dbOperations = require('../db/operations');
const sf = require('../service/view-deploy');
const { Op } = require("sequelize");

const schedule = ()=> {
    cron.schedule("*/10 * * * *", function () {
        dbOperations.findAll({
            where: {
                status:{
                    [Op.notIn]: ["Succeeded","Failed"]
                }
            }
        }).then(jobs => jobs.forEach(j => sf.deployAndMonitor(j)))
    });
}
module.exports = schedule;