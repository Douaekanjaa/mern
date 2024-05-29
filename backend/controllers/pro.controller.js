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
      const {
          first_name, last_name, email, password, confirmPassword, location_id,
          phone_number, photo, categories, availability, cv, date_of_birth, address,
          bio, gender
      } = req.body;

      if (password !== confirmPassword) {
          return res.status(400).json({ message: 'Passwords do not match' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const parsedCategories = Array.isArray(categories) ? categories : [categories];
      let parsedAvailability;
      try {
          parsedAvailability = JSON.parse(availability);
      } catch (error) {
          console.error("Error parsing availability:", error.message);
          return res.status(400).json({ message: "Invalid availability format" });
      }

      let photoUrl = null;
      if (req.file) {
          const result = await cloudinary.uploader.upload(req.file.path, { folder: 'profiles' });
          photoUrl = result.secure_url;
      }

      const newPro = new Pro({
          first_name, last_name, email, gender, password: hashedPassword,
          location_id, phone_number,
          photo: photoUrl,
          categories: parsedCategories,
          bio, address, cv, date_of_birth,
          availability: parsedAvailability,
      });
      await newPro.save();
      res.status(201).json({ message: "Pro signup successful" });
  } catch (error) {
      console.error("Error in proSignup controller:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
  }
};



const loginPro = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Pro.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Email or password is wrong' });

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

const updatePro = async (req, res) => {
    const { first_name, last_name, email, phone_number, address, rate, bio, categories, availability } = req.body;
    let updatedFields = { first_name, last_name, email, phone_number, address, rate, bio };

    if (categories) {
        updatedFields.categories = Array.isArray(categories) ? categories : [categories];
    }

    if (availability) {
        updatedFields.availability = JSON.parse(availability);
    }

    if (req.files) {
        if (req.files.photo) {
            const photoResult = await cloudinary.uploader.upload(req.files.photo[0].path, {
                folder: 'profiles',
            });
            updatedFields.photo = photoResult.secure_url;
        }
        if (req.files.coverPhoto) {
            const coverResult = await cloudinary.uploader.upload(req.files.coverPhoto[0].path, {
                folder: 'covers',
            });
            updatedFields.coverPhoto = coverResult.secure_url;
        }
    }

    try {
        const user = await Pro.findByIdAndUpdate(req.user._id, updatedFields, { new: true })
            .populate({
                path: 'location_id',
                select: 'city_name'
            })
            .populate({
                path: 'categories',
                select: 'name'
            });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getProById = async (req, res) => {
    try {
        const proId = req.params.id;
        const pro = await Pro.findById(proId)
            .populate({
                path: 'location_id',
                select: 'city_name'
            })
            .populate({
                path: 'categories',
                select: 'name'
            });

        if (!pro) {
            return res.status(404).json({ message: 'Pro not found' });
        }

        res.json(pro);
    } catch (error) {
        console.error("Error in getProById controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export { registerPro, loginPro, logoutPro, updatePro, getProById };
