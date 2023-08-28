const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    unique: true,
    required: true,
  },
  room: {
    type: String,
    unique: false,
    required: false,
  }
});



module.exports = mongoose.model("User", UserSchema);
