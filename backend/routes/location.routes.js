import express from "express";
const router = express.Router();

// Import Location model (assuming you have defined it)
import Location from "../models/locations.model.js";

// Route to add a new location
router.post("/add", async (req, res) => {
  try {
    const { city_name } = req.body;

    // Validate input data
    if (!city_name || typeof city_name !== "string") {
      return res.status(400).json({ error: "Invalid city name" });
    }

    // Check if the location already exists
    const existingLocation = await Location.findOne({ city_name });

    if (existingLocation) {
      return res.status(400).json({ error: "Location already exists" });
    }

    // Create a new location
    const newLocation = new Location({ city_name });
    await newLocation.save();

    // Log success message
    console.log("Location added successfully:", newLocation);

    res.status(201).json({ message: "Location added successfully", location: newLocation });
  } catch (error) {
    // Log and handle errors
    console.error("Error adding location:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get all locations
router.get("/all", async (req, res) => {
  try {
    // Retrieve all locations from the database
    const locations = await Location.find();

    res.status(200).json(locations);
  } catch (error) {
    // Log and handle errors
    console.error("Error getting locations:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



export default router;
