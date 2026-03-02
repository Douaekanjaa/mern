import express from 'express';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import cloudinary from '../config/cloudinary.js';
import Pro from '../models/pro.model.js';
import Location from '../models/locations.model.js';
import Category from '../models/categories.model.js';
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
          first_name, last_name, email, password, confirmPassword,
          phone_number, categories, availability, cv, date_of_birth,
          address, bio, gender, city, experience, rate
      } = req.body;

      // ── 1. Validate required fields early with clear messages ──
      if (!first_name || !last_name || !email || !password) {
          return res.status(400).json({ message: 'First name, last name, email, and password are required' });
      }

      if (password !== confirmPassword) {
          return res.status(400).json({ message: 'Passwords do not match' });
      }

      // ── 2. Check for duplicate email ──
      const existingPro = await Pro.findOne({ email });
      if (existingPro) {
          return res.status(409).json({ message: 'An account with this email already exists' });
      }

      // ── 3. Resolve city string → location_id (ObjectId) ──
      let location_id = null;
      if (city) {
          const location = await Location.findOne({ city_name: city });
          if (location) {
              location_id = location._id;
          }
          // If city not found, we still proceed — location_id stays null
          // Remove this block and return 400 if location_id is required in your schema
      }

      // ── 4. Hash password ──
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // ── 5. Parse categories — frontend sends ObjectId strings directly ──
      let parsedCategories = [];
      if (categories) {
          const rawCategories = Array.isArray(categories) ? categories : [categories];
          // Filter out any empty/invalid values
          parsedCategories = rawCategories.filter(id => id && id.match(/^[a-f\d]{24}$/i));
          if (parsedCategories.length === 0) {
              return res.status(400).json({ message: 'Please select at least one valid category.' });
          }
      }

      // ── 6. Parse & convert availability ──
      // Frontend sends: [{ day, from: "08:00", to: "18:00" }]
      // Schema expects: [{ day, hours: [{ hour: "08:00", available: true }] }]
      let parsedAvailability = [];
      if (availability) {
          try {
              const rawAvail = typeof availability === 'string'
                  ? JSON.parse(availability)
                  : availability;

              parsedAvailability = rawAvail.map(({ day, from, to }) => {
                  // Generate every hour slot between from and to
                  const hours = [];
                  let current = parseInt(from.split(':')[0]);
                  const end   = parseInt(to.split(':')[0]);
                  while (current <= end) {
                      hours.push({
                          hour: `${String(current).padStart(2, '0')}:00`,
                          available: true,
                      });
                      current++;
                  }
                  return { day, hours };
              });
          } catch (err) {
              return res.status(400).json({ message: 'Invalid availability format' });
          }
      }

      // ── 7. Upload photo to Cloudinary if provided ──
      // Use a default avatar if no photo uploaded (avoids schema `required` error)
      let photoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(first_name + '+' + last_name)}&background=1a6b47&color=fff&size=200`;
      if (req.file) {
          try {
              const result = await cloudinary.uploader.upload(req.file.path, { folder: 'profiles' });
              photoUrl = result.secure_url;
          } catch (uploadErr) {
              console.error('Cloudinary upload error:', uploadErr.message);
              // Keep the default avatar URL — don't block registration
          }
      }

      // ── 8. Build and save the Pro document ──
      const newPro = new Pro({
          first_name,
          last_name,
          email,
          gender,
          password:     hashedPassword,
          location_id,
          phone_number,
          photo:        photoUrl,
          categories:   parsedCategories,
          bio,
          address,
          date_of_birth: date_of_birth || null,
          rate:          rate ? Number(rate) : 0,
          availability:  parsedAvailability,
      });

      await newPro.save();

      res.status(201).json({ message: 'Pro signup successful' });

  } catch (error) {
      // ── Log the FULL error so you can see exactly what failed ──
      console.error('Error in registerPro controller:');
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);

      // ── Return Mongoose validation errors clearly ──
      if (error.name === 'ValidationError') {
          const messages = Object.values(error.errors).map(e => e.message);
          return res.status(400).json({ message: 'Validation failed', errors: messages });
      }

      // ── Duplicate key error (e.g. unique email constraint) ──
      if (error.code === 11000) {
          const field = Object.keys(error.keyValue)[0];
          return res.status(409).json({ message: `${field} already in use` });
      }

      res.status(500).json({ error: 'Internal Server Error', detail: error.message });
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
        updatedFields.availability = typeof availability === 'string'
            ? JSON.parse(availability)
            : availability;
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
            .populate({ path: 'location_id', select: 'city_name' })
            .populate({ path: 'categories', select: 'name' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getProById = async (req, res) => {
    try {
        const proId = req.params.id;
        const pro = await Pro.findById(proId)
            .populate({ path: 'location_id', select: 'city_name' })
            .populate({ path: 'categories', select: 'name' });

        if (!pro) {
            return res.status(404).json({ message: 'Pro not found' });
        }

        res.json(pro);
    } catch (error) {
        console.error('Error in getProById controller:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export { registerPro, loginPro, logoutPro, updatePro, getProById };