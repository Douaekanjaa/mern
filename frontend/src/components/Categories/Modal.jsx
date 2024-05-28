import React, { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';

const Modal = ({ isOpen, onClose, onSubmit }) => {
    const { authUser } = useAuthContext(); // Accessing the authUser from the AuthContext
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        address: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        // Call onSubmit with the form data and the authUser
        onSubmit({ ...formData, user_id: authUser.id });
        // Reset form data and close modal
        setFormData({ date: '', time: '', address: '' });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Book Task</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Date:</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Time:</label>
                        <input type="time" name="time" value={formData.time} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Address:</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default Modal;