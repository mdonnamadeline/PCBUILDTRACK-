const mongoose = require('mongoose');
const { Schema } = mongoose;

const menuSchema = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        disabled: { type: Boolean, required: false },
        quantity: { type: Number, required: true, min: 0 } 
    },
    { collection: 'menu-data' }
);

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
