const express = require('express');
const ac = require('../controllers/authController');
const router = express.Router();

router.route('/signup').post(ac.signup);
router.route('/login').post(ac.login);

module.exports = router;