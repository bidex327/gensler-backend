const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken")

const signupUser = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password } = req.body;

    

    if (fullName !== "" && email !== "" && phoneNumber !== "" && password !== "" ) {
      const exist = await User.findOne({ email });
      if (exist) {
        return res.status(400).json({ message: "user already exist" });
      }
    

      const user = await User.create({
        fullName,
        email,
        phoneNumber,
        password,
    
      });
      res.status(201).json({
        message: "user with profile created successfully",
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          password: user.password,
        
        },
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({ message: "All fields are required" });
    }
  } catch (err) {
    // console.error(`An error occured: ${err.message}`);
    // res.status(500).json({ message: "Internal server error" });
    console.error("signup/Login Error", error.message);
    return res.status(500).json({message: error.message })
  }
};



const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist!" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
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
    console.error(`An error has occurred: ${err.message}`);
    res.status(500).json({ message: "Internal server error!" });
  }
};


module.exports = { signupUser, loginUser};