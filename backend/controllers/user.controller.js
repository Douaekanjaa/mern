import User from "../models/user.model.js";

const getAllUsers = async (req, res) => {
    try {
        // Query all users from the database
        const users = await User.find({}, { password: 0 }).populate({
            path: 'location_id',
            select: 'city_name'
          });

        // Sending response with user data
        res.status(200).json(users);
    } catch (error) {
        // If there's an error, send error response
        res.status(500).json({ message: error.message });
    }
};

// Exporting the controller function
export { getAllUsers };