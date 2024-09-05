'use strict';

// const { apiKey, permission } = require('../auth/checkAuth');

const router = require('express').Router();

// Check api key
// router.use(apiKey);

router.use('', require('./upload'));

module.exports = router;
