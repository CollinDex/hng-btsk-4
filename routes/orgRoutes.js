const express = require('express');
const router = express.Router();
const { createOrganisation, getOrganisation, getOrganisations, addUserToOrganisation} = require('../controllers/orgController');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/', authMiddleware, createOrganisation);
router.get('/', authMiddleware, getOrganisations);
router.get('/:orgId', authMiddleware, getOrganisation);
router.post('/:orgId/users', authMiddleware, addUserToOrganisation);

module.exports = router;