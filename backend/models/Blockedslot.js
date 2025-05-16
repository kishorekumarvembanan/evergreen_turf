const mongoose = require("mongoose");

const blockedSlotSchema = new mongoose.Schema({
  date: { type: String, required: true },
  slot: { type: String, required: true },
});

module.exports = mongoose.model("BlockedSlot", blockedSlotSchema);