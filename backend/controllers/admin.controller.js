import Admin from "../models/admin.model.js";
import bcrypt from "bcryptjs"

// Controller function for admin login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Find admin by email
        const admin = await Admin.findOne({ email });

        // Check if admin with the provided email exists
        if (!admin) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Check if password is correct
        const isValidPassword = await admin.isValidPassword(password);

        if (!isValidPassword) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Log the admin in
        // You can implement JWT or session-based authentication here

        const responseData = { message: "Admin logged in successfully", admin };
        console.log("Login Response:", responseData); // Log the response data
        res.status(200).json(responseData); // Send the response back to the frontend
    } catch (error) {
        console.error("Error logging in:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Controller function for admin logout
export const logout = async (req, res) => {
    try {
        // Implement logout logic if needed
        res.status(200).json({ message: "Admin logged out successfully" });
    } catch (error) {
        console.error("Error logging out:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const register = async (req, res) => {
    try {
      const { firstName, lastName, email, phoneNumber, password } = req.body;
  
      // Check if admin with the same email already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ error: "Admin with this email already exists" });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new admin
      const newAdmin = new Admin({
        firstName,
        lastName,
        email,
        phoneNumber,
        password: hashedPassword,
      });
  
      // Save the admin to the database
      await newAdmin.save();
  
      res.status(201).json({ message: "Admin created successfully", admin: newAdmin });
    } catch (error) {
      console.error("Error creating admin:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  