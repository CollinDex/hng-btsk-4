const express = require('express');
const router = express.Router();
const getUserData = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/:id', authMiddleware, getUserData);

module.exports = router;