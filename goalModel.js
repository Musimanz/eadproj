const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  username: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'in-progress' }
});

module.exports = mongoose.model('Goal', goalSchema);
