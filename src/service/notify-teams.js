const axios = require('axios');
require('dotenv').config();
const hookURL = process.env.HOOK_TEAMS;
const message = {
    "type":"message",
    "attachments":[
       {
          "contentType":"application/vnd.microsoft.card.adaptive",
          "contentUrl":null,
          "content":{
             "$schema":"http://adaptivecards.io/schemas/adaptive-card.json",
             "type":"AdaptiveCard",
             "version":"1.2",
             "body":[
                 {
                 "type": "TextBlock",
                 "text": ""
                 },
                 {
                    "type": "FactSet",
                    "facts": [
                        {
                            "title": "Name",
                            "value": "Cleberson Chagas"
                        },
                        {
                            "title": "Phone number",
                            "value": "werwer"
                        }
                    ]
                },

                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "FactSet",
                            "facts": [
                                {
                                    "title": "1x",
                                    "value": "Steak"
                                },
                                {
                                    "title": "2x",
                                    "value": "Side Rice"
                                },
                                {
                                    "title": "1x",
                                    "value": "Soft Drink"
                                }
                            ],
                            "spacing": "Small"
                        }
                    ],
                    "spacing": "Small"
                }
             ]
          }
       }
    ]
 }
const notifyTeams = async () => {
    try {
      // Cria o comentário na solicitação de merge especificada

      const response = await axios.post(
        hookURL,
          message
      );

    } catch (error) {
      console.error('Erro ao criar o teams:', error.message);
    }
  };

  module.exports = {notifyTeams}