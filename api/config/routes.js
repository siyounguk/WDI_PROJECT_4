var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var authenticationController = require('../controllers/authenticationController');
var users = require('../controllers/usersController');
var walks = require('../controllers/walksController');

router.post('/login', authenticationController.login);
router.post('/register', authenticationController.register);

router.route('/users')
  .get(users.usersIndex)

router.route('/users/:id')
  .get(users.usersShow)
  .put(users.usersUpdate)
  .delete(users.usersDelete)

router.route('/walks')
  .get(walks.walksIndex)
  .post(walks.walksCreate)

router.route("/walks/find")
  .get(walks.walksFind)

router.route('/walks/:id')
  .get(walks.walksShow)
//   .put(walksController.usersUpdate)
//   .delete(walksController.usersDelete)


module.exports = router;