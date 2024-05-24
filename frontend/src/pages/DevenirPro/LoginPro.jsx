// Login.jsx

import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAuthProContext } from '../../context/AuthProContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuthProContext();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/api/pros/login", { email, password });
            login(response.data.user);
            if (response.status === 200) {
                navigate("/profile");
            }
        } catch (error) {
            console.error('Login error:', error.message);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
