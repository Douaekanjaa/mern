import mongoose from 'mongoose';

const ProSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, required: true },
    date_of_birth: { type: Date, required: true },
    address: { type: String },
    location_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location' // Reference the Location model
    },
    phone_number: { type: String, required: true },
    photo: { type: String, required: true },
    bio: { type: String },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    availability: [{
        day: { type: String, required: true },
        hours: { type: String, required: true }
    }],
    cv: { type: String, required: true },
    rate: { type: Number, default: 0 }
});

const Pro = mongoose.model('Pro', ProSchema);

export default Pro;
