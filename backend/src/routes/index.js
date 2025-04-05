const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const classRoutes = require('./classRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/classes', classRoutes);

module.exports = router;
