const axios = require('axios');
require('dotenv').config();
const dbOperations = require('../db/operations');

const gitlabApiUrl = 'https://gitlab.com/api/v4'; // URL da API do GitLab

const gitlabToken = process.env.GITLAB_TOKEN; // Substitua pelo seu token de acesso do GitLab


const createComment = async (params, status) => {
  try {
    // Cria o comentário na solicitação de merge especificada

    createComment(params.jobId, params.projectId, params.mrId, message);

    const {jobId, projectId, mrId, discussionId} = params;
    console.log('status', status);
    const URL = discussionId ? `${gitlabApiUrl}/projects/${projectId}/merge_requests/${mrId}/discussions/${discussionId}/notes`
    :`${gitlabApiUrl}/projects/${projectId}/merge_requests/${mrId}/discussions`;

    const response = await axios.post(
      URL,
        {
          body: status,
        },
      {
        headers: {
          'Private-Token': gitlabToken

        },
      }
    );
    console.info('comentario criado', projectId, mrId);
    dbOperations.update({commented : true, discussionId : response.id}, {where:{
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
