import User from "../models/user.model.js";

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }).populate({
            path: 'location_id',
            select: 'city_name'
          });

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getAllUsers };