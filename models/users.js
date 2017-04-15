const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schema = new Schema({
  "name": { type: String, required: true },
  "imgURL": { type: String, default: '' },
  "username": { type: String, required: true },
  "password": { type: String, required: true },
  "salt": { type: String, required: true },
  "status": { type: Number, default: 0 },
  "lastSeen": { type: Number, default: Date.now() },
  "contacts": [{ "id": { type: Schema.Types.ObjectId, ref: "User" }, "favorite": { type: Boolean, default: false } }],
  "conversations": [{ type: Schema.Types.ObjectId, ref: "Conversation" }],
  "createdAt": { type: Number, default: Date.now() }
});

var model_capsule = mongoose.model("User", schema);
module.exports = model_capsule;