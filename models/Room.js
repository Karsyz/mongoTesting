const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  roomNumber: { 
    type: Number,
  },
  vacant: { 
    type: Boolean,
  },
});



module.exports = mongoose.model("Room", RoomSchema);
