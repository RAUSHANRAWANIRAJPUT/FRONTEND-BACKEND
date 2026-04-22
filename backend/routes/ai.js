const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/ask', aiController.askLibrarian);
router.get('/suggestions', aiController.getDashboardSuggestions);

module.exports = router;
