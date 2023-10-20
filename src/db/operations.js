const Job = require('../models/Job')
const socket = require("../service/create-socket");
const {Op} = require("sequelize");

function insert(params) {
    return Job.create(params);
}

function update(params, where) {

    Job.update(params,
        where).then( ()=> socket.getIO().emit('registry-update'));
}
async function findAll(where) {
    try{

        return await Job.findAll(where);
    }catch (e) {
        console.log(e);
    }

}

module.exports= {insert, update, findAll}