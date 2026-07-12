const User = require("../models/User");
const generateToken = require("../helpers/generateToken");
const bcrypt = require("bcryptjs");

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  const { userName, email, password, phone } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }

    const user = await User.create({
      userName,
      email,
      password,
      phone,
    });

    if (user) {
      res.status(200).json({
        success: true,
        message: "Registration successful"
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid user data received" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id);

      res.cookie("token", token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      }).json({
        success: true,
        message: "Logged in successfully",
        user: {
          id: user._id,
          userName: user.userName,
          email: user.email,
          role: user.role,
          image: user.image,
        }
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

// @desc    Check auth
// @route   GET /api/auth/check-auth
// @access  Protected
const checkAuth = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      success: true,
      message: "Authenticated user!",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        image: user.image,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Protected
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    if (user) {
      user.userName = req.body.userName || user.userName;
      user.phone = req.body.phone || user.phone;
      user.email = req.body.email || user.email;
      user.image = req.body.image || user.image;

      const updatedUser = await user.save();

      res.json({
        success: true,
        message: "Profile updated successfully!",
        user: {
          id: updatedUser._id,
          userName: updatedUser.userName,
          email: updatedUser.email,
          role: updatedUser.role,
          image: updatedUser.image,
        },
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user password
// @route   PUT /api/auth/update-password
// @access  Protected
const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Old password does not match" });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  checkAuth,
  updateProfile,
  updatePassword,
};
