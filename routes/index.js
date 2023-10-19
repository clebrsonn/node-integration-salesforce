var express = require('express');
var router = express.Router();
// var save = require('../src/db/save');
var sf = require('../src/service/view-deploy');
var dbOperations = require('../src/db/operations');
const { getMrAddress } = require('../src/service/save-gitlab');


/* GET home page. */
router.get('/', function(req, res, next) {
  dbOperations.findAll().then(registries =>
  res.render('index', { title: 'Status Validate', registries: registries }));
});

router.post('/', function(req, res, next) {
  console.log(JSON.stringify(req.body));

  dbOperations.insert(req.body).then(response => {
    sf.deployAndMonitor(response);

    res.status(200).send({status: response.status,jobId: response.jobId});
  }).catch(error => res.status(400).send(error.errors));
});


router.post('/retry', function(req, res, next) {
  console.log(JSON.stringify(req.body.jobId));

  dbOperations.findAll({
    where: {
        jobId:req.body.jobId
    }
  }).then(response =>{
    if(response){
      sf.deployAndMonitor(response[0]);
    }

    res.status(200).send();

  }).catch(error => res.status(400).send(error.errors));

});

router.post('/goto', function(req, res, next) {
  console.log(JSON.stringify(req.body.jobId));

  dbOperations.findAll({
    where: {
        jobId:req.body.jobId
    }
  }).then(response =>{
    if(response){
      getMrAddress(response[0].projectId, response[0].mrId).then(resp =>{
        res.status(200).send(resp.data.web_url);
      });
    }else{
      res.status(200).send();
    }



  }).catch(error => res.status(400).send(error.errors));

});


module.exports = router;