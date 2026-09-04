const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authenticate = require('../middleware/auth');

router.use(authenticate);

router.get('/accounts', analyticsController.getAccounts);
router.get('/overview', analyticsController.getOverview);
router.get('/trend', analyticsController.getTrend);
router.get('/engagement', analyticsController.getEngagementBreakdown);

module.exports = router;
