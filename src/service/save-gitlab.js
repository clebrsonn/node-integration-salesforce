const axios = require('axios');
require('dotenv').config();

const gitlabApiUrl = 'https://gitlab.com/api/v4'; // URL da API do GitLab

const gitlabToken = process.env.GITLAB_TOKEN; // Substitua pelo seu token de acesso do GitLab


const createComment = async (projectId, mergeRequestId, status) => {
  try {
    // Cria o comentário na solicitação de merge especificada
    const response = await axios.post(
      `${gitlabApiUrl}/projects/${projectId}/merge_requests/${mergeRequestId}/notes`,
        {
          body: status,
        },
      {
        headers: {
          'Private-Token': gitlabToken,
          'Content-Type': 'application/json'

        },
      }
    );

    console.log('Comentário criado com sucesso:', response.data);
  } catch (error) {
    console.error('Erro ao criar o comentário:', error.message);
  }
};

module.exports = {createComment}
