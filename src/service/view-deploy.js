const jsforce = require('jsforce');
const { createComment } = require('./save-gitlab');
const { notifyTeams } = require('./notify-teams');
const jsonToMarkdown = require('json-to-markdown-table');
const dbOperations = require('../db/operations');

function deployAndMonitor(params) {
    makeCall(params);
}

const makeCall = (params) => {

  let id = params.jobId;

  const conn = new jsforce.Connection();

  conn.initialize({
    instanceUrl: params.instanceURL,
    accessToken: params.token
  });

  conn.metadata.checkDeployStatus(id, true).then(result =>{
    callAgain(params, result);
  }).catch(error => {

    if (error.name !== 'sf:INVALID_SESSION_ID') {
      console.error('erro de conexão:');
      console.error(JSON.stringify(error));
    }
    dbOperations.update({status : "Error", description: JSON.stringify(error) }, {where:{
      jobId: id
    }});


  });
}

const callAgain= (params, result)=> {
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
                  result?.status === 'Failed'    ? `O ${action} falhou: \n ${transform(result.details.componentFailures)}`: '';

    // result.details.runTestResult.codeCoverage
    //
    // result.details.runTestResult.codeCoverageWarnings

    if(!params.commented){
      if(result.success && result.details.runTestResult?.codeCoverageWarnings){
        const covegare = result.details.runTestResult?.codeCoverageWarnings.filter((elem) =>
        result.details.componentSuccesses?.find(el => elem.name === el.fullName) );

        message += transform(covegare);

      }
      createComment(params.jobId, params.projectId, params.mrId, message);
      notifyTeams();
    }
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
module.exports = { deployAndMonitor };