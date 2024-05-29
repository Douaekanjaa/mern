import User from "../models/user.model.js";
import Pro from "../models/pro.model.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import generateTokenAndSetCookie from "../utils/generateToken.js";


export const signup = async (req, res) => {
    try {
        const { first_name, last_name, email, password, confirmPassword, gender, phone_number, location } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const profilePic = `https://avatar-placeholder.iran.liara.run/${gender === 'male' ? 'boy' : 'girl'}?username=${email}`;

        const newUser = new User({
            first_name,
            last_name,
            email,
            phone_number,
            gender,
            password: hashedPassword,
            profilePic,
            location
        });
        await newUser.save();

        const token = generateTokenAndSetCookie(newUser._id, res);

        res.status(201).json({
            token,
            user: {
                _id: newUser._id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
                phone_number: newUser.phone_number,
                gender: newUser.gender,
                profilePic: newUser.profilePic,
                location: newUser.location
            }
        });

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};




export const login = async (req, res) => {
  try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(400).json({ error: "Invalid email or password" });
      }

      const token = generateTokenAndSetCookie(user._id, res);
      res.status(200).json({
          token,
          user: {
              _id: user._id,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              phone_number: user.phone_number,
              gender: user.gender,
              role: user.role
          }
      });
  } catch (error) {
      console.log("Error in login controller", error.message);
      res.status(500).json({ error: "Internal Server Error" });
  }
};






export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};




export const proSignup = async (req, res) => {
    try {
        const { first_name, last_name, email, password, confirmPassword, location_id, phone_number, photo, categories, experience, availability, cv } = req.body;

        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }

        // Check if email already exists
        const existingPro = await Pro.findOne({ email });
        if (existingPro) {
            return res.status(400).json({ error: "Email already taken" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10); // Generate hash with salt rounds of 10

        // Create a new Pro instance
        const newPro = new Pro({
            first_name,
            last_name,
            email,
            password: hashedPassword, // Save hashed password
            location_id,
            phone_number,
            photo,
            categories,
            experience,
            availability,
            cv
        });

        // Save the new pro to the database
        await newPro.save();

        // Respond with success message
        res.status(201).json({ message: "Pro signup successful" });
    } catch (error) {
        console.log("Error in proSignup controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const proLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the professional in the database
        const pro = await Pro.findOne({ email });

        // If professional not found, respond with an error
        if (!pro) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, pro.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: pro._id }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });

        // Set the token in cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true, // set to true if HTTPS is enabled
            maxAge: 3600000 // 1 hour
        });

        // Respond with success message
        res.status(200).json({ message: "Pro login successful" });
    } catch (error) {
        console.log("Error in proLogin controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const proLogout = async (req, res) => {
    try {
        // Clear the JWT token from cookies
        res.clearCookie("jwt");

        // Respond with success message
        res.status(200).json({ message: "Pro logged out successfully" });
    } catch (error) {
        console.log("Error in proLogout controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

