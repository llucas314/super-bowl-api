const mongoose = require("../db/connection");
const Schema = mongoose.Schema;

const halftimePerformerSchema = new Schema({
  super_bowl: Number,
  musician: {
    type: String,
    trim: true
  },
  num_songs: Number
});
// halftimePerformerSchema.index({ "$**": "text" });

module.exports = mongoose.model("HalftimePerformer", halftimePerformerSchema);
