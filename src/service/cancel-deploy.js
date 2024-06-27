const { deployAndMonitor } = require('./view-deploy');
const axios  = require('axios');
require('dotenv').config();

const cancelDeploy = async (params) =>{
    let id = params.jobId;

    const instanceUrl = params.instanceURL;
  
    try {
      const response = await axios.patch(
        `${instanceUrl}/services/data/v60.0/metadata/deployRequest/${id}`,
        { "deployResult":{"status" : "Canceling"}},
        {
            headers: {
                Authorization: `Bearer ${params.token}`
            }
        }
      );
  
      console.log('Deploy cancelado com sucesso: ', response.data);
      deployAndMonitor(params);
    } catch (error) {
        console.error('Erro ao cancelar o deploy: ', error);
    }

}
module.exports ={cancelDeploy}