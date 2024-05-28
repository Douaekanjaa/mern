import express from 'express';
import Task from '../models/task.model.js';

const router = express.Router();

// Create a new task
router.post('/add', async (req, res) => {
    try {
        const { pro_id, title, description, category_id, location_id, price } = req.body;

        const newTask = new Task({
            pro_id,
            title,
            description,
            category_id,
            location_id,
            price
        });

        const savedTask = await newTask.save();
        res.status(201).json({ message: 'Task added successfully', task: savedTask });
    } catch (error) {
        console.error('Error adding task:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/all', async (req, res) => {
    try {
        const tasks = await Task.find().populate('pro_id category_id location_id');
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/filter', async (req, res) => {
    try {
        const { categoryId, filters } = req.body;

        const filteredTasks = await Task.find({ category_id: categoryId });

        res.status(200).json(filteredTasks);
    } catch (error) {
        console.error('Error filtering tasks:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
