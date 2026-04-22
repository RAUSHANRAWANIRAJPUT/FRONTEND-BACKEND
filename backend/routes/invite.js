const express = require('express');
const inviteController = require('../controllers/inviteController');

const router = express.Router();

router.post('/', inviteController.generateInvite);

module.exports = router;
