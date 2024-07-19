const mongoose = require("mongoose");

const collectionName = "menu-data";

const dataModel = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    disabled: { type: Boolean, required: false },
    quantity: { type: Number, required: true, min: 0 },
});

module.exports = mongoose.model(collectionName, dataModel);
