const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

router.post('/', progressController.updateProgress);
router.get('/:userId', progressController.getProgressForUser);

module.exports = router;
