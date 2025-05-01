const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true, default: "none" },
    password: { type: String, required: true },
    verification: { type: Boolean, required: false },
    phone: { type: String, default: "0123456789" },
    phoneVerification: { type: Boolean, default: false },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: false,
    },
    userType: {
      type: String,
      required: true,
      default: "Client",
      enum: ["Client", "Admin", "Vendor", "Driver"],
    },
    profile: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid&w=740",
    },
  },
  { timestamps: false }
);

module.exports = mongoose.model("User", UserSchema);
