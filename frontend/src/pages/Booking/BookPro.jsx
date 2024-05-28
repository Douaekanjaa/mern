// src/pages/BookPro.js

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const BookPro = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const taskId = params.get('taskId');
    const categoryId = params.get('categoryId');
    const price = params.get('price');

    const [day, setDay] = useState('');
    const [time, setTime] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDayChange = (event) => {
        setDay(event.target.value);
    };

    const handleTimeChange = (event) => {
        setTime(event.target.value);
    };

    const handleCheckout = () => {
        if (!day || !time) {
            setError('Please provide both day and time for the booking.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        setTimeout(() => {
            console.log(`Proceeding to checkout with Task ID: ${taskId}, Category ID: ${categoryId}, Price: ${price}, Day: ${day}, Time: ${time}`);
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6">BookPro Page</h1>
                <p><strong>Task ID:</strong> {taskId}</p>
                <p><strong>Category ID:</strong> {categoryId}</p>
                <p><strong>Price:</strong> {price}</p>
                <div className="mb-4">
                    <label htmlFor="day" className="block mb-2 text-sm">Day:</label>
                    <input
                        type="date"
                        id="day"
                        value={day}
                        onChange={handleDayChange}
                        className="border rounded px-2 py-1 w-full text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="time" className="block mb-2 text-sm">Time:</label>
                    <input
                        type="time"
                        id="time"
                        value={time}
                        onChange={handleTimeChange}
                        className="border rounded px-2 py-1 w-full text-sm"
                    />
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button
                    onClick={handleCheckout}
                    className={`mt-4 px-4 py-2 text-white rounded ${isSubmitting ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'}`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Processing...' : 'Checkout'}
                </button>
            </div>
        </div>
    );
};

export default BookPro;
