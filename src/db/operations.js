const Job = require('../models/Job')
const socket = require("../service/create-socket");
const {Op} = require("sequelize");

function insert(params) {
    return Job.create(params);
}

function update(params, where) {

    Job.update(params,
        where).then( ()=> {
            Job.findAll({
                where: {
                    status:{
                        [Op.notIn]: ["Success", "Error"]
                    }
                }
            }).then(result =>
                socket.getIO().emit('registry-update', result)
            );

    });
}
function findAll(where) {
    return Job.findAll(where);
}

module.exports= {insert, update, findAll}