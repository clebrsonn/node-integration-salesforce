var express = require('express');
var router = express.Router();
// var save = require('../src/db/save');
var sf = require('../src/service/view-deploy');
var dbOperations = require('../src/db/operations')

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


module.exports = router;