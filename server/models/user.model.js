const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema ({
  firstname: { type: String, required : true },
  lastname: { type: String, required : true },
  middlename: { type: String, required : true },
  email: { type: String, required : true },
  password: { type: String, required : true }
}, {collection: 'user-data'});

const User = mongoose.model('User', userSchema);
module.exports = User;