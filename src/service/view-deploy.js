const socket = require('./create-socket')
const jsforce = require('jsforce');
const { createComment } = require('./save-gitlab');
const { notifyTeams } = require('./notify-teams');
const jsonToMarkdown = require('json-to-markdown-table');
const dbOperations = require('../db/operations');

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

    if (error.name !== 'sf:INVALID_SESSION_ID') {
      console.error('erro de conexão:');
      console.error(JSON.stringify(error));
      //  createComment(params.projectid, params.mrid, `O deploy falhou: ${JSON.stringify(error)}` );
      // notifyTeams();
      //callAgain(params, result, intervalId);
      clearInterval(intervalId);

      dbOperations.update({status : "Error"}, {where:{
          jobId: id
        }});

    }

  });
}

const callAgain= (params, result, intervalId)=> {
  console.log(result);
  dbOperations.update({status : result.status}, {where:{
    jobId: params.jobId
  }});

  if (result && !result.done) {
    console.log('em andamento', params.instanceURL, result.status, params.jobId);
    return;
  } if (result) {
    let action = result.checkOnly ? ' Validate ' : ' Deploy ';

    let message = result?.status === 'Succeeded' ? `${action} concluído com sucesso!` :
    result?.status === 'Failed' ? `O ${action} falhou: \n ${transform(result.details.componentFailures)}`: '';

    createComment(params.projectId, params.mrId, message);
    notifyTeams();
  }
  if(result && result.done && intervalId){

    clearInterval(intervalId);
  }
}

function transform(jsonToTransform) {
  let columns;
  if(Array.isArray(jsonToTransform)){
    columns = Object.keys(jsonToTransform[0]);
  }else{
    columns= Object.keys(jsonToTransform)
  }


  return   jsonToMarkdown(jsonToTransform, columns);

}
// Chamando a função para iniciar o deploy e monitorar
module.exports = { deployAndMonitor };