const mongoose = require("mongoose");

const collectionName = "product-data";

const dataModel = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    disabled: { type: Boolean, required: false },
    quantity: { type: Number, required: true, min: 0 },
    category: { 
        type: String, 
        required: true, 
        enum: ["Processor", "GPU", "Motherboard", "RAM", "Monitor", "Case", "Laptop", "Storage"] 
    },
});

module.exports = mongoose.model(collectionName, dataModel);
