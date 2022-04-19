let router = require('express').Router();

router.get('/', function(request,response) {
  response.render('root/index', { pageTitle: "Home" });
});

module.exports = router;