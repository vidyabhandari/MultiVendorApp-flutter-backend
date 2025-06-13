const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const generateOtp = require("../utils/otp_generater");
const sendMail = require("../utils/smtp_function");

module.exports = {
  createUser: async (req, res) => {
    const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(req.body.email)) {
      return res
        .status(400)
        .json({ status: false, message: "Email is not valid" });
    }

    const minPasswordLength = 6;
    if (!req.body.password || req.body.password.length < minPasswordLength) {
      return res.status(400).json({
        status: false,
        message:
          "Password should be at least " +
          minPasswordLength +
          " characters long",
      });
    }

    try {
      const emailExists = await User.findOne({ email: req.body.email });

      if (emailExists) {
        return res
          .status(400)
          .json({ status: false, message: "Email already exists" });
      }

      //Generate otp

      const otp = generateOtp();

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        userType: "Client",
        password: CryptoJS.AES.encrypt(
          req.body.password,
          process.env.SECRET
        ).toString(),
        otp: otp,
      });

      //Save User

      await newUser.save();

      //Send Otp to email
      sendMail(newUser.email, otp);

      res
        .status(201)
        .json({ status: true, message: "User successfully created." });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },
  loginUser: async (req, res) => {
    const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(req.body.email)) {
      return res
        .status(400)
        .json({ status: false, message: "Email is not valid" });
    }

    const minPasswordLength = 6;

    if (!req.body.password || req.body.password.length < minPasswordLength) {
      return res.status(400).json({
        status: false,
        message:
          "Password should be at least " +
          minPasswordLength +
          " characters long",
      });
    }

    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res
          .status(400)
          .json({ status: false, message: "User not found" });
      }

      const decryptedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.SECRET
      );
      const depassword = decryptedPassword.toString(CryptoJS.enc.Utf8);

      if (depassword !== req.body.password) {
        return res
          .status(400)
          .json({ status: false, message: "Wrong Password" });
      }

      const userToken = jwt.sign(
        {
          id: user._id,
          userType: user.userType,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "21d" }
      );

      const { password, createdAt, updatedAt, __v, otp, ...others } = user._doc;

      res.status(200).json({ ...others, userToken });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },
};
