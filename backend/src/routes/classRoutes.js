const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { addClass, getUserClasses } = require('../controllers/classController');

// POST /classes
router.post('/', verifyToken, addClass);

router.get('/', verifyToken, getUserClasses);

module.exports = router;
