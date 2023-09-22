const jsforce = require('jsforce');
const nsj = require('node-salesforce-jwt');
const fs = require('fs');
const { createComment } = require('./save-gitlab');


function deployAndMonitor(params) {
  try {
    let org = params.org;
    let id = params.jobid;

      const conn = new jsforce.Connection();

      conn.initialize({
        instanceUrl: params.instance,
        accessToken: params.token
      });

      let callAgain= (error, result)=>{
          //console.log('error', error);
          //console.log(result);

          if(error){
            console.error('O deploy falhou:');
            console.error(JSON.stringify(error));
            createComment(params.projectid, params.mrid, {msg:'O deploy falhou:', result: error});

          }

          if(result && !result.done){
            console.log('em andamento',params.instance, result.status, id);

            conn.metadata.checkDeployStatus(id, true, setInterval(callAgain, 50000));
          }else if (result && result?.status === 'Succeeded') {
            createComment(params.projectid, params.mrid, 'Deploy concluído com sucesso!');
            console.log('Deploy concluído com sucesso!', org);
          }else if(result && result?.status === 'Failed'){
            console.error('O deploy falhou:');
            createComment(params.projectid, params.mrid, `O deploy falhou: \n ${jsonArrayToMarkdownTable(result.details.componentFailures)}`);
            console.error(jsonArrayToMarkdownTable(result.details.componentFailures));


          }
        }

        conn.metadata.checkDeployStatus(id, true, callAgain);

  //  });

    //await conn.login();

    // Define os detalhes do deploy
    // const deployOptions = {
    //   rollbackOnError: true,
    //   checkOnly: false, // Defina como true se desejar testar o deploy sem efetivá-lo
    //   testLevel: 'NoTestRun', // Altere de acordo com as suas necessidades de teste
    // };

    // Caminho do pacote que você deseja implantar (pode ser um arquivo ZIP ou diretório)
    // const deployPath = '/caminho/do/seu/pacote';

    // Inicia o deploy
    // const deployResult = await conn.metadata.deploy(deployPath, deployOptions);

    // Monitora o progresso do deploy
  } catch (err) {
    console.error('Erro durante o deploy:');
    console.error(err);
  }
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
module.exports = {deployAndMonitor};
