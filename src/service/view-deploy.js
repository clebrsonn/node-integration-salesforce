const jsforce = require('jsforce');
const { createComment } = require('./save-gitlab');
const { notifyTeams } = require('./notify-teams');
const Job = require('../models/Job')

function deployAndMonitor(params) {

  const intervalId= setInterval( ()=>makeCall(params, intervalId), 50000);

  makeCall(params, intervalId);
}

const makeCall = (params, intervalId) => {

  let id = params.jobId;

  const conn = new jsforce.Connection();

  conn.initialize({
    instanceUrl: params.instanceURL,
    accessToken: params.token
  });

  conn.metadata.checkDeployStatus(id, true).then(result =>{
    callAgain(params, result, intervalId);
  }).catch(error => {

    if (error.name != 'sf:INVALID_SESSION_ID') {
      console.error('erro de conexão:');
      console.error(JSON.stringify(error));
      //  createComment(params.projectid, params.mrid, `O deploy falhou: ${JSON.stringify(error)}` );
      // notifyTeams();
      //callAgain(params, result, intervalId);

      Job.update({status : "Error"}, {where:{
        jobId: id
      }});

      clearInterval(intervalId);

    }

  });
}

const callAgain= (params, result, intervalId)=> {
  console.log(result);
  Job.update({status : result.status}, {where:{
    jobId: params.jobId
  }});

  if (result && !result.done) {
    console.log('em andamento', params.instanceURL, result.status, params.jobId);
    return;
  } if (result) {
    let action = result.checkOnly ? ' Validate ' : ' Deploy ';

    let message = result?.status === 'Succeeded' ? `${action} concluído com sucesso!` :
    result?.status === 'Failed' ? `O ${action} falhou: \n ${jsonArrayToMarkdownTable(result.details.componentFailures)}`: '';

    createComment(params.projectId, params.mrId, message);
    notifyTeams();
  }
  if(result && result.done && intervalId){

    clearInterval(intervalId);
  }
}

function jsonArrayToMarkdownTable(jsonArray) {
  if (!jsonArray?.length) {
    return "";
  }

  const keys = Object.keys(jsonArray[0]);

  let markdownTable = `| ${keys.join(" | ")} |\n`;
  markdownTable += `| ${keys.map(() => "-------").join(" | ")} |\n`;

  jsonArray.forEach(obj => {
    const values = keys.map(key => obj[key]);
    markdownTable += `| ${values.join(" | ")} |\n`;
  });

  return markdownTable;
}
// Chamando a função para iniciar o deploy e monitorar
module.exports = { deployAndMonitor };