import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import Pro from "../models/pro.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

const SALT_ROUNDS = 10;
const COOKIE_NAME = "jwt";

const asyncHandler = (handler) => (req, res) => handler(req, res).catch((error) => {
  console.error(`Error in ${handler.name} controller:`, error.message);
  res.status(500).json({ error: "Internal Server Error" });
});

const normalizeEmail = (email) => email.trim().toLowerCase();

const buildProfilePic = (gender, email) => {
  const avatarType = gender === "male" ? "boy" : "girl";
  return `https://avatar-placeholder.iran.liara.run/${avatarType}?username=${email}`;
};

const toSafeUser = (user) => ({
  _id: user._id,
  first_name: user.first_name,
  last_name: user.last_name,
  email: user.email,
  phone_number: user.phone_number,
  gender: user.gender,
  role: user.role,
  profilePic: user.profilePic,
  location: user.location
});

const toSafePro = (pro) => ({
  _id: pro._id,
  first_name: pro.first_name,
  last_name: pro.last_name,
  email: pro.email,
  phone_number: pro.phone_number,
  location_id: pro.location_id,
  photo: pro.photo,
  categories: pro.categories,
  experience: pro.experience,
  availability: pro.availability
});

export const signup = asyncHandler(async (req, res) => {
  const { first_name, last_name, password, confirmPassword, gender, phone_number, location } = req.body;
  const email = normalizeEmail(req.body.email);

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords don't match" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ error: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser = await User.create({
    first_name,
    last_name,
    email,
    phone_number,
    gender,
    password: hashedPassword,
    profilePic: buildProfilePic(gender, email),
    location
  });

  const token = generateTokenAndSetCookie(newUser._id, res);

  res.status(201).json({ token, user: toSafeUser(newUser) });
});

export const login = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const { password } = req.body;

  const user = await User.findOne({ email });
  const isPasswordValid = user && (await bcrypt.compare(password, user.password));

  if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const token = generateTokenAndSetCookie(user._id, res);

  res.status(200).json({ token, user: toSafeUser(user) });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.status(200).json({ message: "Logged out successfully" });
});

export const proSignup = asyncHandler(async (req, res) => {
  const { first_name, last_name, password, confirmPassword, location_id, phone_number, photo, categories, experience, availability, cv } = req.body;
  const email = normalizeEmail(req.body.email);

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords don't match" });
  }

  const existingPro = await Pro.findOne({ email });
  if (existingPro) {
    return res.status(400).json({ error: "Email already taken" });
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const newPro = await Pro.create({
    first_name,
    last_name,
    email,
    password: hashedPassword,
    location_id,
    phone_number,
    photo,
    categories,
    experience,
    availability,
    cv
  });

  const token = generateTokenAndSetCookie(newPro._id, res);

  res.status(201).json({ token, pro: toSafePro(newPro) });
});

export const proLogin = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const { password } = req.body;

  const pro = await Pro.findOne({ email });
  const isPasswordValid = pro && (await bcrypt.compare(password, pro.password));

  if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const token = generateTokenAndSetCookie(pro._id, res);

  res.status(200).json({ token, pro: toSafePro(pro) });
});

export const proLogout = asyncHandler(async (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.status(200).json({ message: "Pro logged out successfully" });
});