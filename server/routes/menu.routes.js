const express = require('express');
const router = express.Router();
const controller = require('../controllers/menu.controller');
const upload = require('../middlewares/imageUpload');

router.post('/', upload.single('image'), controller.addMenu);
router.get('/', controller.viewMenu);
router.put('/update-stock', upload.single('image'), controller.updateStock);
router.put('/:id', upload.single('image'), controller.updateMenu);
router.delete('/:id', controller.deleteMenu);

module.exports = router;