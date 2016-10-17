
var express = require('express');
var router = express.Router();
var controllers = require("../controllers");

/* authenication apis */
router.get('/authurl', controllers.auth.getAuthUrl);
router.get('/token', controllers.auth.getToken);


module.exports = router;