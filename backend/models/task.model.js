import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    pro_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Pro', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    price: { type: Number, required: true },
    duration: { type: Number },
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
