const mongoose = require('mongoose');

const PuzzleSchema = mongoose.Schema(
  {
    puzzle: String
  },
  { collection: 'puzzle', timestamps: true }
);

module.exports.PuzzleModal = mongoose.model('puzzle', PuzzleSchema);
