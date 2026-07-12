const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  userName: { // Kept 'userName' to be consistent with the original schema
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // Don't return password by default
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"], // Kept 'user'/'admin' to match the existing model expectations
  },
  phone: {
    type: String,
  },
  addresses: [{
    type: String,
  }],
  image: {
    type: String,
  },
}, { timestamps: true });

// Pre-save hook to hash password before saving to the database
UserSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
