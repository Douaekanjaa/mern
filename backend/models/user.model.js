import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    phone_number: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String
    },
    role: {
        type: String,
        default: "normal"
    },
    location_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location' // Reference to the Location model
      },
});

const User = mongoose.model("User", userSchema);

export default User;
