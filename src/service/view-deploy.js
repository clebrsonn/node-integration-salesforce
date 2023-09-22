const jsforce = require('jsforce');
const nsj = require('node-salesforce-jwt');
const fs = require('fs');
const { createComment } = require('./save-gitlab');


function deployAndMonitor(params) {
  let id = params.jobid;
  let message = params.isvalidate ? ' Validate ' : ' Deploy ';

  const conn = new jsforce.Connection();

  conn.initialize({
    instanceUrl: params.instance,
    accessToken: params.token
  });

  let callAgain = (error, result) => {
    if (error) {
      console.error('O deploy falhou:');
      console.error(JSON.stringify(error));
      createComment(params.projectid, params.mrid, { msg: 'O deploy falhou:', result: error });

    }

    if (result && !result.done) {
      console.log('em andamento', params.instance, result.status, id);

      conn.metadata.checkDeployStatus(id, true, callAgain);
    } else if (result && result?.status === 'Succeeded') {

      createComment(params.projectid, params.mrid, `${message} concluído com sucesso!`);
    } else if (result && result?.status === 'Failed') {
      createComment(params.projectid, params.mrid, `O ${message} falhou: \n ${jsonArrayToMarkdownTable(result.details.componentFailures)}`);
    }
  }

  conn.metadata.checkDeployStatus(id, true, callAgain);

}

function jsonArrayToMarkdownTable(jsonArray) {
  if (!jsonArray.length) {
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
