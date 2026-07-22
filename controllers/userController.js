const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const { dbConnect } = require("../lib/dbConnect");

const signupUser = async (req, res) => {
  try {
    await dbConnect();

    const { fullName, email, phoneNumber, password } = req.body;

    if (!fullName || !email || !phoneNumber || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const exist = await User.findOne({ email });
    console.log("Existing user:", exist);

    if (exist) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      fullName,
      email,
      phoneNumber,
      password,
    });

    res.status(201).json({
      message: "User with profile created successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        password: user.password,
      },
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    await dbConnect();

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User does not exist!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials!",
      });
    }

    res.status(200).json({
      message: "Login successful!",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        password: user.password,
      },
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  signupUser,
  loginUser,
};
