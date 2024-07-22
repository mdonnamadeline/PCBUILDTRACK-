const express = require('express');
const router = express.Router();
const controller = require('../controllers/report.controller');

router.post('/', controller.createTransaction);
router.get('/', controller.getTransactions);
router.delete('/:id', controller.deleteTransaction);

module.exports = router;