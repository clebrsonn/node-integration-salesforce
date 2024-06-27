const jsforce = require('jsforce');

const conn = new jsforce.Connection();


conn.initialize({
    instanceUrl: params.instanceURL,
    accessToken: params.token
});

module.exports= {conn}