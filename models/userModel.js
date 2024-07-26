const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Reader', 'Creator'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
