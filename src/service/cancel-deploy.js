const jsforce = require('jsforce');
const { deployAndMonitor } = require('./view-deploy');
const { conn } = require('./connect-sf');
require('dotenv').config();

cancelDeploy = (params) =>{
    let id = params.jobId;
    
    conn(params).metadata.cancelDeploy(id, (err, result) => {
        if (err) {
        return console.error('Erro ao cancelar o deploy: ', err);
        }
        deployAndMonitor(params);
    });
}

module.exports ={cancelDeploy}