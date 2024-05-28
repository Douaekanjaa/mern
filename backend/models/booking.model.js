import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pro_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Pro', required: true },
    task_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    address: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' }
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
