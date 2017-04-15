const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schema = new Schema({
  "members": [{ type: Schema.Types.ObjectId, ref: "User" }],
  "lastMsgDate": { type: Number, default: Date.now() },
  "lastMsgContent": { type: String, default: '' },
  "lastMsgSender": { type: Schema.Types.ObjectId, ref: "User" },
  "messages": { type: Schema.Types.ObjectId, ref: "Message" },
  "group": {
    "isGroup": { type: Boolean, default: false },
    "name": { type: String, default: '' },
    "imgURL": { type: String, default: '' }
  },
  "createdAt": { type: Number, default: Date.now() }
});

var model_capsule = mongoose.model("User", schema);
module.exports = model_capsule;