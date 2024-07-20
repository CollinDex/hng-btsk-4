const express = require('express');
const router = express.Router();
const { create, update } = require('../controllers/helpControllers');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/create', authMiddleware, create);
router.patch('/update/:id', authMiddleware, update);

module.exports = router;

