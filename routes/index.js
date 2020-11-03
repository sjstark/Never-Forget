var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'a/A Express Skeleton Home' });
});

router.get('/app/test', (req,res) => {
  res.render('app', {title: 'Never Forget'})
})

module.exports = router;
