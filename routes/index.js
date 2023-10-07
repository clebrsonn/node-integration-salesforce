var express = require('express');
var router = express.Router();
// var save = require('../src/db/save');
var sf = require('../src/service/view-deploy');
var Job = require('../src/models/Job')

/* GET home page. */
router.get('/', function(req, res, next) {
  let registries= Job.findAll();
  res.render('index', { title: 'Status', registries: registries });
});

router.post('/', function(req, res, next) {
  console.log(JSON.stringify(req.body));

  Job.create(req.body).then(response => {
    sf.deployAndMonitor(response);

    res.status(200).send({status: response.status,jobId: response.jobId});
  }).catch(error => res.status(400).send(error.errors));
});


module.exports = router;