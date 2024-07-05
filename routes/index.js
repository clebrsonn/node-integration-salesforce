var express = require('express');
var router = express.Router();
// var save = require('../src/db/save');
var sf = require('../src/service/view-deploy');

var dbOperations = require('../src/db/jobsRepository');
const { getMrAddress } = require('../src/service/save-gitlab');
const { Op } = require("sequelize");
const { cancelDeploy } = require('../src/service/cancel-deploy');
const TODAY_START = new Date().setHours(0, 0, 0, 0);

/* GET home page. */
router.get('/', function(req, res, next) {
  dbOperations.findAll({where: {isMerged : false}, order: [['createdAt', 'DESC']]}).then(registries =>
  res.render('index', { title: 'Status Validate', registries: registries }));
});

router.post('/', function(req, res, next) {
  console.log(JSON.stringify(req.body));

  dbOperations.insert(req.body).then(response => {
    sf.deployAndMonitor(response);

    res.status(201).send({status: response.status,jobId: response.jobId});
  }).catch(error => res.status(400).send(error.errors));
});


router.post('/project/:projectid/mr/:id', function(req, res, next) {
  console.log(JSON.stringify(req.params));
  if(!req.params.id || !req.params.projectId){
    res.status(400);
  }
  dbOperations.update({isMerged : true}, {where:{
      [Op.and]: [{ mrId: req.params.id }, { projectId: req.params.projectid }]
    }
  }).then(response => {
    res.status(200).send({status: response.status,jobId: response.jobId});
  }).catch(error => res.status(400).send(error));
});

router.post('/retry', function(req, res, next) {
  console.log(JSON.stringify(req.body.jobId));

  dbOperations.findAll({
    where: {
        jobId:req.body.jobId
    },
    order: [['createdAt', 'DESC']]
  }).then(response =>{
    if(response){
      sf.deployAndMonitor(response[0]);
    }

    res.status(200).send();

  }).catch(error => res.status(400).send(error.errors));

});

router.post('/cancel', function(req, res, next) {
  console.log(JSON.stringify(req.body.jobId));

  dbOperations.findAll({
    where: {
        jobId:req.body.jobId
    },
    order: [['createdAt', 'DESC']]
  }).then(response =>{
    if(response){
      cancelDeploy(response[0]);
    }

    res.status(200).send();

  }).catch(error => res.status(400).send(error.errors));

});

router.post('/goto', function(req, res, next) {
  console.log(JSON.stringify(req.body.jobId));

  dbOperations.findAll({
    where: {
        jobId:req.body.jobId
    },
    order: [['createdAt', 'DESC']]
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

// Updated Login route
router.post("/login", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    if (user.role !== role) {
      return res.status(401).json({ message: 'Invalid role' });
    }
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role},
      process.env.JWT_SECRET
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;