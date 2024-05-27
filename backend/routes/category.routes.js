import express from 'express';
import multer from 'multer';
import Category from '../models/categories.model.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

router.post('/add', upload.single('picture'), async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);

        const { name } = req.body;

        // Validate input data
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: 'Invalid category name' });
        }

        // Check if the category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ error: 'Category already exists' });
        }

        let pictureUrl = null;
        if (req.file) {
            // Upload the image to Cloudinary
            cloudinary.uploader.upload(req.file.path, {
                folder: 'categories', // Optionally, you can specify a folder for the uploaded image
            }, (error, result) => {
                if (error) {
                    console.error('Error uploading image to Cloudinary:', error);
                    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
                }
                console.log('Cloudinary upload result:', result);
                pictureUrl = result.secure_url;

                // Create a new category
                const newCategory = new Category({ name, picture: pictureUrl });
                newCategory.save()
                    .then((category) => {
                        console.log('Category added successfully:', category);
                        res.status(201).json({ message: 'Category added successfully', category });
                    })
                    .catch((saveError) => {
                        console.error('Error saving category to database:', saveError.message);
                        res.status(500).json({ error: 'Internal Server Error', details: saveError.message });
                    });
            });
        } else {
            // Create a new category without an image
            const newCategory = new Category({ name });
            newCategory.save()
                .then((category) => {
                    console.log('Category added successfully:', category);
                    res.status(201).json({ message: 'Category added successfully', category });
                })
                .catch((saveError) => {
                    console.error('Error saving category to database:', saveError.message);
                    res.status(500).json({ error: 'Internal Server Error', details: saveError.message });
                });
        }
    } catch (error) {
        console.error('Error adding category:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

router.get('/all', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/filter', async (req, res) => {
    const { categoryIds } = req.body;
    console.log('Received Category IDs:', categoryIds);
    
    try {
      const categories = await Category.find({ _id: { $in: categoryIds } });
      console.log('Filtered Categories:', categories);
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });
  
  router.get('/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        console.error('Error fetching category:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


export default router;
