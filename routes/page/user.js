const express = require('express');
var router = express.Router();

router.get('/login', function(req, res, next){
	res.render('login');
});

router.post('/login', function(req, res, next){
	res.redirect('/');
});

router.get('/logout', function(req, res, next){
	res.redirect('/');
});

module.exports = router;
