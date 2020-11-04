var express = require('express');
var router = express.Router();

router.get('/', (req,res) => {
  res.render('app', {title: 'Never Forget'})
})

module.exports = router;
