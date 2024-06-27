const jsforce = require('jsforce');

const conn = (params) => new jsforce.Connection().initialize({
    instanceUrl: params.instanceURL,
    accessToken: params.token
});

module.exports= {conn}