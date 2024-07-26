const mongoose = require('mongoose');
const { Schema } = mongoose;

const contentSchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['Image', 'Video', 'Text'], required: true },
  url: { type: String, required: function() { return this.type === 'Video'; } },
  text: { type: String, required: function() { return this.type === 'Text'; } },
  imageUrl: { type: String, required: function() { return this.type === 'Image'; } },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);
