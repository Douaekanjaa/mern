import Admin from "../models/admin.model.js";
import bcrypt from "bcryptjs"

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const isValidPassword = await admin.isValidPassword(password);

        if (!isValidPassword) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const responseData = { message: "Admin logged in successfully", admin };
        console.log("Login Response:", responseData);
        res.status(200).json(responseData);
    } catch (error) {
        console.error("Error logging in:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.status(200).json({ message: "Admin logged out successfully" });
    } catch (error) {
        console.error("Error logging out:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const register = async (req, res) => {
    try {
      const { firstName, lastName, email, phoneNumber, password } = req.body;
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ error: "Admin with this email already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new Admin({
        firstName,
        lastName,
        email,
        phoneNumber,
        password: hashedPassword,
      });
      await newAdmin.save();
  
      res.status(201).json({ message: "Admin created successfully", admin: newAdmin });
    } catch (error) {
      console.error("Error creating admin:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  