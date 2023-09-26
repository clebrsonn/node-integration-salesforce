const jsforce = require('jsforce');
const nsj = require('node-salesforce-jwt');
const fs = require('fs');
const { createComment } = require('./save-gitlab');
const { notifyTeams } = require('./notify-teams');


function deployAndMonitor(params) {


  const makeCall = (params) => {

    let id = params.jobid;

    const conn = new jsforce.Connection();

    conn.initialize({
      instanceUrl: params.instance,
      accessToken: params.token
    });

    conn.metadata.checkDeployStatus(id, true).then(result =>{
      callAgain(params, result);
    }).catch(error => {

      if (error.name != 'sf:INVALID_SESSION_ID') {
        console.error('erro de conexão:');
        console.error(JSON.stringify(error));
      //  createComment(params.projectid, params.mrid, `O deploy falhou: ${JSON.stringify(error)}` );
       // notifyTeams();

       callAgain(params, result);


      }

    });
  }
  const callAgain= (params, result)=> {
    let message = params.isvalidate ? ' Validate ' : ' Deploy ';
      console.log(result);
      if (result && !result.done) {
        console.log('em andamento', params.instance, result.status, id);
        return;
      } else if (result && result?.status === 'Succeeded') {

        createComment(params.projectid, params.mrid, `${message} concluído com sucesso!`);
        notifyTeams();
      } else if (result && result?.status === 'Failed') {

        createComment(params.projectid, params.mrid, `O ${message} falhou: \n ${jsonArrayToMarkdownTable(result.details.componentFailures)}`);
        notifyTeams();
      }
      if(result && result.done && intervalId){
          clearInterval(intervalId);

      }
    }

    makeCall(params);
    const intervalId= setInterval( ()=>makeCall(params), 50000);

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
