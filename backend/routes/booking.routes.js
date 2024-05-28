// booking.routes.js

import express from 'express';
import Booking from '../models/booking.model.js';

const router = express.Router();

// Route for creating a new booking
router.post('/create', async (req, res) => {
    try {
        const {
            user_id,
            pro_id,
            task_id,
            category_id,
            date,
            time,
            location_id,
            address
        } = req.body;

        // Create a new booking
        const booking = new Booking({
            user_id,
            pro_id,
            task_id,
            category_id,
            date,
            time,
            location_id,
            address
        });

        // Save the booking to the database
        const savedBooking = await booking.save();

        res.status(201).json({ message: 'Booking created successfully', booking: savedBooking });
    } catch (error) {
        console.error('Error creating booking:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route for fetching all bookings
/* router.get('/all', async (req, res) => {
    try {
        // Fetch all bookings from the database
        const bookings = await Booking.find();

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}); */

// Route for fetching a specific booking by booking_id
/* router.get('/:bookingId', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.status(200).json(booking);
    } catch (error) {
        console.error('Error fetching booking:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}); */

// Route for updating a booking
/* router.put('/:bookingId', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.bookingId, req.body, { new: true });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking updated successfully', booking });
    } catch (error) {
        console.error('Error updating booking:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}); */

// Route for deleting a booking
/* router.delete('/:bookingId', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.bookingId);

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}); */

export default router;
