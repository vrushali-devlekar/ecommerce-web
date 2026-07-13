const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

//register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({
        success: false,
        message: "User doesn't exists! Please register first",
      });

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
        image: checkUser.image,
      },
      process.env.JWT_SECRET || "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 30 * 24 * 60 * 60 * 1000 }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
        image: checkUser.image,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//logout

const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

//auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "CLIENT_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};

const updateProfile = async (req, res) => {
  const { userId, userName, email } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    if (email !== user.email) {
      const checkUser = await User.findOne({ email });
      if (checkUser) {
        return res.json({
          success: false,
          message: "Email already in use!",
        });
      }
    }

    user.userName = userName || user.userName;
    user.email = email || user.email;
    user.image = req.body.image || user.image;

    await user.save();

    // Generate new token with updated info
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        userName: user.userName,
        image: user.image,
      },
      process.env.JWT_SECRET || "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 30 * 24 * 60 * 60 * 1000 }).json({
      success: true,
      message: "Profile updated successfully!",
      user: {
        email: user.email,
        role: user.role,
        id: user._id,
        userName: user.userName,
        image: user.image,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const updatePassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    const checkPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!checkPasswordMatch) {
      return res.json({
        success: false,
        message: "Old password does not match!",
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware, updateProfile, updatePassword };
