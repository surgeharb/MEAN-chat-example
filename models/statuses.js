const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schema = new Schema({
  "id": { type: Number, require: true, unique: true, index: true },
  "name_en": { type: String, default: '' }
});

var model_capsule = mongoose.model("Status", schema);
module.exports = model_capsule;