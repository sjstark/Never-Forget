var express = require('express');
const { csrfProtection} = require("./utils");
var router = express.Router();

router.get('/', csrfProtection, (req,res) => {
  res.render('app', {
    title: 'Never Forget',
    csrfToken: req.csrfToken()
  })
})

module.exports = router;
