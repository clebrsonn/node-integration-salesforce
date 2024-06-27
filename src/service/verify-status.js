const cron = require("node-cron");
const { Op } = require("sequelize");
const { deployAndMonitor } = require("./view-deploy");
const { findAll } = require("../db/operations");

const schedule = ()=> {
    cron.schedule("*/3 * * * *", function () {
        findAll({
            where: {
                status:{
                    [Op.notIn]: ["Succeeded","Failed", "Cancelled", "Error"]
                }
            },
            order: [['createdAt', 'DESC']]
        }).then(jobs => jobs?.forEach(j => deployAndMonitor(j)))
    });
}
module.exports = schedule;