const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schema = new Schema({
  "messages": [{
    "sender": { type: Schema.Types.ObjectId, ref: "User", required: true },
    "content": { type: String, default: '' },
    "status": { type: String, default: 'sent' },
    "type": { type: String, default: 'text' },
    "date": { type: Number, default: Date.now() },
    "senderDate": { type: Number, default: Date.now() },
    "duration": { type: Number, default: 0 }
  }],
  "createdAt": { type: Number, default: Date.now() }
});

var model_capsule = mongoose.model("User", schema);
module.exports = model_capsule;