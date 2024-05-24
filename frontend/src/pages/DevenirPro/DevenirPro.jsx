import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoginPro from "./LoginPro"

const DevenirPro = () => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: "",
        location_id: "",
        phone_number: "",
        photo: null,
        categories: ["", "", ""],
        availability: [],
        cv: "",
        date_of_birth: "",
        address: "",
        bio: "",
        gender: ""
    });

    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/category/all");
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error.message);
            }
        };

        const fetchLocations = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/location/all");
                setLocations(response.data);
            } catch (error) {
                console.error("Error fetching locations:", error.message);
            }
        };

        fetchCategories();
        fetchLocations();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({ ...formData, [name]: files ? files[0] : value });
    };

    const handleCategoryChange = (index, value) => {
        const newCategories = [...formData.categories];
        newCategories[index] = value;
        setFormData({ ...formData, categories: newCategories });
    };

    

    const handleAvailabilityChange = (day, hour) => {
        const updatedAvailability = [...formData.availability];
        const dayIndex = updatedAvailability.findIndex((item) => item.day === day);
        if (dayIndex !== -1) {
            const hourIndex = updatedAvailability[dayIndex].hours.findIndex((item) => item.hour === hour);
            if (hourIndex !== -1) {
                updatedAvailability[dayIndex].hours[hourIndex].available = !updatedAvailability[dayIndex].hours[hourIndex].available;
            } else {
                updatedAvailability[dayIndex].hours.push({ hour, available: true });
            }
        } else {
            updatedAvailability.push({ day, hours: [{ hour, available: true }] });
        }
        setFormData({ ...formData, availability: updatedAvailability });
    };

    const handleNotAvailableChange = (day) => {
        const updatedAvailability = [...formData.availability];
        const dayIndex = updatedAvailability.findIndex((item) => item.day === day);
        if (dayIndex !== -1) {
            updatedAvailability[dayIndex].hours = [{ hour: "not-available", available: true }];
        } else {
            updatedAvailability.push({ day, hours: [{ hour: "not-available", available: true }] });
        }
        setFormData({ ...formData, availability: updatedAvailability });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach((key) => {
                if (key === "categories") {
                    formData[key].forEach((category, index) => {
                        formDataToSend.append(`categories[${index}]`, category);
                    });
                } else if (key === "photo") {
                    formDataToSend.append(key, formData[key]);
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });
    
            const response = await axios.post("http://localhost:3000/api/pros/register", formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            if (response.status === 201) {
                const loginResponse = await axios.post("http://localhost:3000/api/pros/login", {
                    email: formData.email,
                    password: formData.password
                });
                if (loginResponse.status === 200) {
                    navigate("/dashboard");
                }
            }
        } catch (error) {
            console.error("Registration error:", error.message, error.response?.data);
        }
    };
    

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-6">Become a Pro</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <div className="flex items-center mb-4">
                    <input
                        type="radio"
                        id="male"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    <label htmlFor="male">Male</label>
                    <input
                        type="radio"
                        id="female"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={handleChange}
                        className="mr-2 ml-9"
                    />
                    <label htmlFor="female">Female</label>
                </div>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />

                <select
                    className="w-full p-2 mb-4 border rounded"
                    name="location_id"
                    value={formData.location_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Location</option>
                    {locations.map((location) => (
                        <option key={location._id} value={location._id}>
                            {location.city_name}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <input
                    type="file"
                    name="photo"
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    placeholder="Date of Birth"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Address"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Bio"
                    className="w-full p-2 border border-gray-300 rounded"
                ></textarea>
                {formData.categories.map((category, index) => (
                    <select
                        key={index}
                        value={category}
                        onChange={(e) => handleCategoryChange(index, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                ))}
                
                <div className="space-y-4">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                        <div key={day} className="space-y-2">
                            <p className="text-center font-semibold">{day}</p>
                            <div className="grid grid-cols-4 gap-2">
                                {["8-12", "12-3", "3-6", "not-available"].map((hour) => (
                                    <div key={hour} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name={`${day}-${hour}`}
                                            checked={formData.availability.some(
                                                (avail) => avail.day === day && avail.hours.some((h) => h.hour === hour && h.available)
                                            )}
                                            onChange={() => hour === "not-available" ? handleNotAvailableChange(day) : handleAvailabilityChange(day, hour)}
                                            className="mr-2"
                                        />
                                        <label>{hour === "not-available" ? "Not Available" : hour}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    name="cv"
                    value={formData.cv}
                    onChange={handleChange}
                    placeholder="CV URL"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Register
                </button>
            </form>

            <a href="/pro-login">You have an account log in</a>
        </div>
    );
};

export default DevenirPro;
