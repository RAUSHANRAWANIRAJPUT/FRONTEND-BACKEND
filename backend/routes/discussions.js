const express = require('express');
const router = express.Router();
const discussionController = require('../controllers/discussionController');

router.get('/:roomId/messages', discussionController.getRoomMessages);

module.exports = router;
