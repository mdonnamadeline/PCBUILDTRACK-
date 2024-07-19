const mongoose = require("mongoose");

const collectionName = "sales-report";

const dataModel = new mongoose.Schema({
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
    bank: { type: String, required: true },
});

module.exports = mongoose.model(collectionName, dataModel);
