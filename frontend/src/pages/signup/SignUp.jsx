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
        <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
            <div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
                <h1 className='text-3xl font-semibold text-center text-gray-300'>
                    Sign Up <span className='text-blue-500'> </span>
                </h1>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label className='label p-2'>
                            <span className='text-base label-text'>First Name</span>
                        </label>
                        <input
                            type='text'
                            placeholder='Enter your First name'
                            className='w-full input input-bordered  h-10'
                            name='first_name'
                            value={inputs.first_name}
                            onChange={handleChange}
                        />
                    </div>
                   
                    <div>
                        <label className='label p-2 '>
                            <span className='text-base label-text'>Last Name</span>
                        </label>
                        <input
                            type='text'
                            placeholder='Enter Your Last Name'
                            className='w-full input input-bordered h-10'
                            name='last_name'
                            value={inputs.last_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className='label'>
                            <span className='text-base label-text'>Password</span>
                        </label>
                        <input
                            type='password'
                            placeholder='Enter Password'
                            className='w-full input input-bordered h-10'
                            name='password'
                            value={inputs.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className='label'>
                            <span className='text-base label-text'>Confirm Password</span>
                        </label>
                        <input
                            type='password'
                            placeholder='Confirm Password'
                            className='w-full input input-bordered h-10'
                            name='confirmPassword'
                            value={inputs.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className='label'>
                            <span className='text-base label-text'>Phone Number</span>
                        </label>
                        <input
                            type='text'
                            placeholder='Enter Phone Number'
                            className='w-full input input-bordered h-10'
                            name='phone_number'
                            value={inputs.phone_number}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className='label'>
                            <span className='text-base label-text'>Location</span>
                        </label>
                        <select
                            className='w-full input input-bordered h-10'
                            name='location'
                            value={inputs.location}
                            onChange={handleChange}
                        >
                            <option value="">Select Location</option>
                            {/* Render options dynamically based on locations data */}
                            {locations.map((location) => (
                                <option key={location._id} value={location._id}>
                                    {location.city_name} {/* Use city_name as the option text */}
                                </option>
                            ))}
                        </select>

                    </div>
                    
                    <div>
                        <label className='label'>
                            <span className='text-base label-text'>Email Address</span>
                        </label>
                        <input
                            type='email'
                            placeholder='Enter Your Email address'
                            className='w-full input input-bordered h-10'
                            name='email'
                            value={inputs.email}
                            onChange={handleChange}
                        />
                    </div>

                    <GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} />

                    <Link
                        to={"/login"}
                        className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block'
                        href='#'
                    >
                        Already have an account?
                    </Link>

                    <div>
                        <button className='btn btn-block btn-sm mt-2 border border-slate-700' disabled={loading}>
                            {loading ? <span className='loading loading-spinner'></span> : "Sign Up"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
