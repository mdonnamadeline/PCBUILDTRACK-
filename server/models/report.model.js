const mongoose = require('mongoose');
const { Schema } = mongoose;

const reportSchema = new Schema({
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  date: { type: Date, required: true },
  bank: { type: String, required: true }, 
}, { collection: 'sales-report' });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
