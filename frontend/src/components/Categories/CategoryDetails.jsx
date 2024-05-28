import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

const CategoryDetails = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const { authUser } = useAuthContext();
    const [category, setCategory] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [locations, setLocations] = useState([]);
    const [filters, setFilters] = useState({
        price: '',
        day: '',
        time: '',
        location: ''
    });
    const [proDetails, setProDetails] = useState(null);
    

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/category/${categoryId}`);
                setCategory(response.data);
            } catch (error) {
                console.error('Error fetching category details:', error.message);
            }
        };

        fetchCategory();
    }, [categoryId]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.post('http://localhost:5000/api/tasks/filter', {
                    categoryId,
                    filters
                });
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error.message);
            }
        };

        fetchTasks();
    }, [categoryId, filters]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/location/all');
                setLocations(response.data);
            } catch (error) {
                console.error('Error fetching locations:', error.message);
            }
        };

        fetchLocations();
    }, []);

    const handleFilterChange = (filterName, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value
        }));
    };

    if (!category) {
        return <div>Loading...</div>;
    }

    const handleBookTask = async (task) => {
        try {
            const proResponse = await axios.get(`http://localhost:5000/api/pro/${task.pro_id}`);
            const pro = proResponse.data;
            setProDetails(pro); 
            navigate(`/book-pro?taskId=${task._id}&categoryId=${categoryId}&price=${task.price}&proId=${pro._id}&userId=${authUser._id}`);  // Include Pro and User details in the URL
        } catch (error) {
            console.error('Error fetching pro details or creating booking:', error.message);
        }
    };

    return (
        <div className="flex w-screen h-screen">
            <div className="flex w-screen h-screen">
                <div className="w-1/4 p-4 border-r">
                    <h3 className="text-lg font-semibold mb-4">Filter Tasks</h3>
                    <div className="mb-4">
                        <label htmlFor="price" className="block mb-2 text-sm">Price:</label>
                        <input type="text" id="price" value={filters.price} onChange={e => handleFilterChange('price', e.target.value)} className="border rounded px-2 py-1 w-full text-sm" />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm">Day:</label>
                        <div>
                            <label htmlFor="monday" className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    id="monday"
                                    checked={filters.day === 'Monday'}
                                    onChange={() => handleFilterChange('day', 'Monday')}
                                    className="mr-1"
                                />
                                Monday
                            </label>
                            <label htmlFor="tuesday" className="inline-flex items-center ml-4">
                                <input
                                    type="checkbox"
                                    id="tuesday"
                                    checked={filters.day === 'Tuesday'}
                                    onChange={() => handleFilterChange('day', 'Tuesday')}
                                    className="mr-1"
                                />
                                Tuesday
                            </label>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="time" className="block mb-2 text-sm">Time:</label>
                        <input type="text" id="time" value={filters.time} onChange={e => handleFilterChange('time', e.target.value)} className="border rounded px-2 py-1 w-full text-sm" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="location" className="block mb-2 text-sm">Location:</label>
                        <select
                            id="location"
                            value={filters.location}
                            onChange={e => handleFilterChange('location', e.target.value)}
                            className="border rounded px-2 py-1 w-full text-sm"
                        >
                            <option value="">Select a location</option>
                            {locations.map(location => (
                                <option key={location.location_id} value={location.city_name}>
                                    {location.city_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="w-3/4 p-4">
                    <h2 className="text-3xl font-bold mb-8">{category.name} Tasks</h2>
                    {tasks.map(task => (
                        <div key={task._id} className="border p-6 mb-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">{task.title}</h3>
                            <p>{task.description}</p>
                            <p>Price: {task.price}</p>
                            <button onClick={() => handleBookTask(task)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                                Book Task
                            </button>
                        </div>
                    ))}

                    {proDetails && (
                        <div className="mt-8">
                            <h3 className="text-xl font-semibold">Pro Details</h3>
                            <img src={proDetails.photo} alt={`${proDetails.first_name} ${proDetails.last_name}`} className="w-16 h-16 rounded-full mt-4" />
                            <p className="mt-2"><strong>Name:</strong> {proDetails.first_name} {proDetails.last_name}</p>
                            <p className="mt-2"><strong>Bio:</strong> {proDetails.bio}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryDetails;
