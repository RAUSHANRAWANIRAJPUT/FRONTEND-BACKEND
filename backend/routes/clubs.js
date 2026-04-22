const express = require('express');
const router = express.Router();
const clubController = require('../controllers/clubController');

router.get('/', clubController.getClubs);
router.get('/:id', clubController.getClubById);
router.post('/', clubController.createClub);
router.patch('/:id', clubController.updateClub);
router.post('/:id/join', clubController.joinClub);

module.exports = router;
