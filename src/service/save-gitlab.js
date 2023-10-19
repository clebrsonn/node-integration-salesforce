const axios = require('axios');
require('dotenv').config();
const dbOperations = require('../db/operations');

const gitlabApiUrl = 'https://gitlab.com/api/v4'; // URL da API do GitLab

const gitlabToken = process.env.GITLAB_TOKEN; // Substitua pelo seu token de acesso do GitLab


const createComment = async (jobId, projectId, mergeRequestId, status) => {
  try {
    // Cria o comentário na solicitação de merge especificada

    console.log('status', status);

    const response = await axios.post(
      `${gitlabApiUrl}/projects/${projectId}/merge_requests/${mergeRequestId}/notes`,
        {
          body: status,
        },
      {
        headers: {
          'Private-Token': gitlabToken

        },
      }
    );
    console.info('comentario criado', projectId, mergeRequestId);
    dbOperations.update({commented : true}, {where:{
      jobId: jobId
    }});


  } catch (error) {
    console.error('Erro ao criar o comentário:', error.message);
  }
};

const getMrAddress = async (projectId, mergeRequestId) => {
  try {
    // Cria o comentário na solicitação de merge especificada
    return await axios.get(
      `${gitlabApiUrl}/projects/${projectId}/merge_requests/${mergeRequestId}`,
      {
        headers: {
          'Private-Token': gitlabToken

        },
      }
    );

  } catch (error) {
    console.error('Erro ao criar o comentário:', error.message);
  }
};

module.exports = {createComment, getMrAddress}
