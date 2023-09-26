const axios = require('axios');

const hookURL = "https://accenture.webhook.office.com/webhookb2/1e68d3ce-f364-418e-873d-25a0dfb94e36@e0793d39-0939-496d-b129-198edd916feb/IncomingWebhook/b7b72c030d994e11b0f92adf9bb2ed8c/9bd3b8a9-24bc-44bd-8a1b-f983a009b404";

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
                 "text": "For Samples and Templates, see [https://adaptivecards.io/samples](https://adaptivecards.io/samples)"
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
