import { Link } from "react-router-dom";
import GenderCheckbox from "./GenderCheckbox";
import { useState, useEffect } from 'react';
import useSignup from "../../hooks/useSignup";
import useLogin from "../../hooks/useLogin";

const SignUp = () => {
    const [inputs, setInputs] = useState({
        first_name: "",
        last_name: "",
        password: "",
        confirmPassword: "",
        email: "",
        phone_number: "",
        gender: "",
    });
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        console.log('Fetching locations from:', 'http://localhost:5000/api/location/all');

        const fetchLocations = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/location/all');
                const data = await response.json();
                setLocations(data);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };

        fetchLocations();
    }, []);
    const { loading, signup } = useSignup();
    const { login, loading: loginLoading } = useLogin();


    const handleCheckboxChange = (gender) => {
        setInputs({ ...inputs, gender });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs({ ...inputs, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Extract first name from first_name
        const firstName = inputs.first_name;
        // Extract last name from last_name
        const lastName = inputs.last_name;
        // Log the inputs object
        console.log("Inputs before signup:", inputs);
        // Send signup request with all input fields
        await signup({
            first_name: firstName,
            last_name: lastName,
            email: inputs.email,
            password: inputs.password,
            confirmPassword: inputs.confirmPassword,
            gender: inputs.gender,
            phone_number: inputs.phone_number
        });


        await login(inputs.email, inputs.password);
        // Redirect the user to the desired page after login
        return <Navigate to="/home" />;
    };



    return (
        <div className="flex w-screen justify-center items-center min-h-screen bg-gray-100">
            <div className="max-w-xl w-full px-6 py-8 bg-white shadow-md rounded-lg">
                <h1 className="text-3xl font-semibold text-center text-lime-700 mb-8">
                    Sign Up
                </h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            First Name
                        </label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50"
                            placeholder="Enter your First name"
                            name="first_name"
                            value={inputs.first_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Last Name
                        </label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50"
                            placeholder="Enter your Last name"
                            name="last_name"
                            value={inputs.last_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50"
                            placeholder="Enter your Password"
                            name="password"
                            value={inputs.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50"
                            placeholder="Confirm your Password"
                            name="confirmPassword"
                            value={inputs.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50"
                            placeholder="Enter your Phone Number"
                            name="phone_number"
                            value={inputs.phone_number}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50"
                            placeholder="Enter your email"
                            name="email"
                            value={inputs.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Location
                        </label>
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50"
                            name="location"
                            value={inputs.location}
                            onChange={handleChange}
                        >
                            <option value="">Select Location</option>
                            {locations.map((location) => (
                                <option key={location._id} value={location._id}>
                                    {location.city_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} />
                    <div className="mt-4 flex justify-between items-center">
                        <Link
                            to={"/login"}
                            className="text-sm text-emerald-700 hover:underline"
                        >
                            Already have an account?
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-lime-700 text-white px-4 py-2 rounded-md focus:outline-none focus:bg-lime-700 hover:bg-lime-500"
                        >
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
