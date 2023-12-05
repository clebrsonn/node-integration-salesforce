const jsforce = require('jsforce');
const { createComment } = require('./save-gitlab');
const { notifyTeams } = require('./notify-teams');
const jsonToMarkdown = require('json-to-markdown-table');
const dbOperations = require('../db/operations');
require('dotenv').config();



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
      console.error(error);
    }
    console.error(JSON.stringify(error));

    dbOperations.update({status : "Error", description: error }, {where:{
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

    let message = `${action} ${result?.status}! \n ${transform(result.details)}`

    // result.details.runTestResult.codeCoverage
    //
    // result.details.runTestResult.codeCoverageWarnings

    if(!params.commented){

      createComment(params.jobId, params.projectId, params.mrId, message);
      notifyTeams();
    }
  }
}
function transform(jsonToTransform) {
  if(!jsonToTransform){
    return '';
  }
  let str='';
  if(jsonToTransform.componentFailures){
    str += '\n\r Component Failures \n\r';
    str+= toMarkdown(jsonToTransform.componentFailures);
  }
  if(jsonToTransform.runTestResult.failures){
    str += '\n\r Test Failures \n\r';
    str+= toMarkdown(jsonToTransform.runTestResult.failures);

  }
  if(jsonToTransform.runTestResult.codeCoverageWarnings){
    let coverage = jsonToTransform.runTestResult?.codeCoverageWarnings.filter((elem) =>
    jsonToTransform.componentSuccesses?.find(el => elem.name === el.fullName) );
    if(coverage){
      str += '\n\r Coverage Test Class < 75% \n\r';

      str += toMarkdown(coverage);
    }

  }
  if(jsonToTransform.runTestResult.codeCoverage){
    let coverage = jsonToTransform.runTestResult?.codeCoverage.filter((elem) =>
    jsonToTransform.componentSuccesses?.find(el => elem.name === el.fullName) );
    if(coverage){
      let coverageNew=[];
      for (let index = 0; index < coverage.length; index++) {
        let element = coverage[index];
        element['coveragePercent'] = ( 1- (parseInt(element.numLocationsNotCovered, 10) /parseInt(element.numLocations, 10)))* 100;
        if(element['coveragePercent'] < process.env.COVERAGE){
          coverageNew.push(element);
        }
      }
      if(coverageNew.length>0){
        str += '\n\r Coverage Test Class < 85% \n\r';

        str += toMarkdown(coverageNew);
      }

    }

  }
  return str;
}

function toMarkdown(jsonToTransform){
  let columns;

  if(Array.isArray(jsonToTransform)){
    columns = Object.keys(jsonToTransform[0]);
  }else{
    columns= Object.keys(jsonToTransform)
  }


  return jsonToMarkdown(jsonToTransform, columns);

}
module.exports = { deployAndMonitor };
