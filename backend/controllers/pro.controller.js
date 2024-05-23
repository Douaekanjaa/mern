import express from 'express';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import cloudinary from '../config/cloudinary.js';
import Pro from '../models/pro.model.js';
import generateTokenAndSetCookie from '../utils/generateToken.js';

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });


const registerPro = async (req, res) => {
  try {
      // Destructure request body
      const {
          first_name,
          last_name,
          email,
          password,
          confirmPassword,
          location_id,
          phone_number,
          categories,
          availability, // Remove this line
          cv,
          date_of_birth,
          gender
      } = req.body;

      // Check if passwords match
      if (password !== confirmPassword) {
          return res.status(400).json({ message: 'Passwords do not match' });
      }

      // Generate salt and hash password
      const salt = await bcrypt.genSalt(10); // Generate salt
      const hashedPassword = await bcrypt.hash(password, salt); // Hash password

      // Convert categories and availability to arrays if they're not already
      const parsedCategories = Array.isArray(categories) ? categories : [categories];

      // Handle file upload
      let photoUrl = null;
      if (req.file) {
          console.log("Uploading photo to Cloudinary...");
          const result = await cloudinary.uploader.upload(req.file.path, {
              folder: 'profiles',
          });
          photoUrl = result.secure_url;
          console.log("Uploaded photo URL:", photoUrl);
      }

      const newPro = new Pro({
          first_name,
          last_name,
          email,
          password: hashedPassword, // Store hashed password
          location_id,
          phone_number,
          photo: photoUrl,
          categories: parsedCategories, // Use parsedCategories
          cv,
          date_of_birth,
          gender
      });

      await newPro.save();

      res.status(201).json({ message: "Pro signup successful" });
  } catch (error) {
      console.error("Error in proSignup controller:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
  }
};


export { registerPro };

const loginPro = async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await Pro.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Email or password is wrong' });

      // Compare hashed password with entered password
      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass) return res.status(400).json({ message: 'Invalid password' });

      generateTokenAndSetCookie(user._id, res);
      res.json({ user });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

const logoutPro = (req, res) => {
    res.clearCookie('jwt');
    res.json({ message: 'Logged out successfully' });
};

const getAllPros = async (req, res) => {
    try {
        // Fetch professionals with populated location (city_name) and categories
        const pros = await Pro.find()
            .populate({
                path: 'location_id',
                select: 'city_name'
            })
            .populate({
                path: 'categories',
                select: 'name'
            });

        // Return the professionals as a JSON response with city names and category names
        res.status(200).json(pros);
    } catch (error) {
        // If an error occurs, return an error response
        res.status(500).json({ message: error.message });
    }
};

export { getAllPros, loginPro, logoutPro };
