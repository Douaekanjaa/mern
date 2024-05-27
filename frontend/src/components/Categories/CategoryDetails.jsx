import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Nav from '../navbar/Nav';

const CategoryDetails = () => {
    const { categoryId } = useParams();
    const [category, setCategory] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [Locations, setLocations] = useState([]); // Corrected variable name to Locations
    const [filters, setFilters] = useState({
        price: '',
        day: '',
        time: '',
        location: ''
    });

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

    return (
        <>
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
        {Locations.map(location => ( // Corrected variable name to Locations
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
                        <div key={task.taskId} className="border p-6 mb-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">{task.title}</h3>
                            {/* Display more details about the task */}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default CategoryDetails;
