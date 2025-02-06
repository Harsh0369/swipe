import User from "../models/User.js";
import jwt from "jsonwebtoken";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const signup = async (req, res) => {
  const { name, email, password, age, gender, genderPreference } = req.body;

  try {
    if (!name || !email || !password || !age || !gender || !genderPreference) {
      res.status(400).json({ message: "All fields are required" });
    }

    if (age < 18) {
      res
        .status(400)
        .json({ message: "You must be 18 years or older to use this app" });
    }
    if (password.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    const newUser = await User.create({
      name,
      email,
      password,
      age,
      gender,
      genderPreference,
    });

    const token = signToken(newUser._id);

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, //prevents XSS attacks
      sameSite: "strict", //prevents CSRF attacks
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
          res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email }).select("+password");
        if(!user || !(await user.matchPassword(password))) {
            res.status(401).json({ message: "Invalid credentials" });
        }
        const token = signToken(user._id);

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        res.status(200).json({ success: true, user });
    } catch(error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }

};
export const logout = async (req, res) => {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logged out" });
}; 
