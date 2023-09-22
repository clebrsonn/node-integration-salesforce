var express = require('express');
var router = express.Router();
var save = require('../src/db/save');
var sf = require('../src/service/view-deploy');


/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  console.log(JSON.stringify(req.body));

  save.insert(req.body, reponseSuccess,res)

});

function reponseSuccess(params, res) {
  console.log(params)
  sf.deployAndMonitor(params);
  return res.status(200).send(params);
}


module.exports = router;