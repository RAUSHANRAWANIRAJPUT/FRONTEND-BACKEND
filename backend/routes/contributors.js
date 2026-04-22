const express = require('express');
const contributorController = require('../controllers/contributorController');

const router = express.Router();

router.get('/:clubId', contributorController.getContributors);

module.exports = router;
