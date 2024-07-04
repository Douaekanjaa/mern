import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookPro = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const taskdescription = params.get('taskdescription');
    const categoryId = params.get('categoryId');
    const price = params.get('price');

    const [day, setDay] = useState('');
    const [time, setTime] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleDayChange = (event) => {
        setDay(event.target.value);
        setError('');
    };

    const handleTimeChange = (event) => {
        setTime(event.target.value);
        setError('');
    };

    const handleCheckout = () => {
        if (!day || !time) {
            setError('Please select both day and time for the booking.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        setTimeout(() => {
            console.log(`Proceeding to checkout with Task ID: ${categoryId}, Price: ${price}, Day: ${day}, Time: ${time}`);
            setIsSubmitting(false);
            setSuccess(true);
            toast.success('Request sent successfully!');
        }, 1000);
    };

    return (
        <div className='h-screen w-screen'>
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-100 p-4">
                <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-6">BookPro Page</h1>
                    <p><strong>Task :</strong> {taskdescription}</p>
                    <p><strong>Price:</strong> {price}</p>
                    <div className="mb-4">
                        <label htmlFor="day" className="block mb-2 text-sm">Select Day:</label>
                        <input
                            type="date"
                            id="day"
                            value={day}
                            onChange={handleDayChange}
                            className="border rounded px-2 py-1 w-full text-sm"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="time" className="block mb-2 text-sm">Select Time:</label>
                        <input
                            type="time"
                            id="time"
                            value={time}
                            onChange={handleTimeChange}
                            className="border rounded px-2 py-1 w-full text-sm"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    {success && <p className="text-green-500 mb-4">Request Sent successful!</p>}
                    <button
                        onClick={handleCheckout}
                        className={`mt-4 px-4 py-2 text-white rounded ${isSubmitting ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Processing...' : 'Send Request'}
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default BookPro;
