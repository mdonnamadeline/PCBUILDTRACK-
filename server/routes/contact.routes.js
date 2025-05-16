const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');

// Route to add a new contact message
router.post('/', contactController.addContact);

// Route to view all contact messages
router.get('/', contactController.viewContact);

module.exports = router;