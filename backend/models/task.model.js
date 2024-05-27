import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    task_id: { type: Number, required: true, unique: true },
    pro_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Pro', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    price: { type: Number }
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
