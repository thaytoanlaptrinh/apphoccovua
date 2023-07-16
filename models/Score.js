const { Schema, model } = require('mongoose');

// Định nghĩa Schema
const ScoreSchema = new Schema({
  id: Number,
  name: String,
});

// Định nghĩa Model
const ObjModel = model('Score', ScoreSchema);
