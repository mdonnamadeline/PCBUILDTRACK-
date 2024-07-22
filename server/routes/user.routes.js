const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');

router.post('/', controller.addUser);
router.post('/signup', controller.signup);
router.post('/signin', controller.signin);
router.get('/', controller.viewUsers);
router.put('/:id', controller.updateUser);
router.delete('/:id', controller.deleteUser);

module.exports = router;