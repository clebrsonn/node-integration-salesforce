const jsforce = require('jsforce');


const conn = (params)=>{
    const connection = new jsforce.Connection();


    connection.initialize({
        instanceUrl: params.instanceURL,
        accessToken: params.token
    });
    return connection;
}

module.exports= {conn}