const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: { type: String, unique: true, required: true },
  allowsImages: { type: Boolean, required: true },
  allowsVideos: { type: Boolean, required: true },
  allowsTexts: { type: Boolean, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
