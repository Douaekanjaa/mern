import { useState } from 'react';
import axios from 'axios';

const useSignUp = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const signup = async (userData) => {
        setIsLoading(true);
        try {
            console.log('POST request URL:', '/api/auth/signup');
            console.log('Request data:', userData);

            const response = await axios.post('/api/auth/signup', userData);
            setIsLoading(false);
            return response.data;
        } catch (error) {
            setIsLoading(false);
            setError(error.response.data.error);
            throw error;
        }
    };

    return { signup, error, isLoading };
};

export default useSignUp;
