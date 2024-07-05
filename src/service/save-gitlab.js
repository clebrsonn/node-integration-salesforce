const axios = require('axios');
require('dotenv').config();
const  JobRepository = require('../db/jobsRepository');
const { Op } = require('sequelize');

const gitlabApiUrl = 'https://gitlab.com/api/v4'; // URL da API do GitLab

const gitlabToken = process.env.GITLAB_TOKEN; // Substitua pelo seu token de acesso do GitLab


const createComment = async (params, status) => {
  try {
    // Cria o comentário na solicitação de merge especificada
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
    JobRepository.update({commented : true, discussionId : response.data.id}, {where:{
      jobId: jobId
    }});


  } catch (error) {
    console.error('Erro ao criar o comentário:', error.message);
  }
};

const getMrAddress = async (projectId, mergeRequestId) => {
  try {
    let response = await axios.get(
      `${gitlabApiUrl}/projects/${projectId}/merge_requests/${mergeRequestId}`,
      {
        headers: {
          'Private-Token': gitlabToken

        },
      }
    );
    if(response.data.state!='opened'){
      JobRepository.update({isMerged : true}, {where:{
        [Op.and]: [{ mrId: mergeRequestId }, { projectId: projectId }]
      }
    })    }
    return response;

  } catch (error) {
    console.error('Erro ao criar o comentário:', error.message);
  }
};

module.exports = {createComment, getMrAddress}
