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
    const [proDetailsMap, setProDetailsMap] = useState({});

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
                const tasksData = response.data;
                setTasks(tasksData);

                // Fetch pro details for each task
                const proDetailsPromises = tasksData
                    .filter(task => task.pro_id)  // Ensure pro_id is not null or undefined
                    .map(task =>
                        axios.get(`http://localhost:5000/api/pros/${task.pro_id}`).then(res => ({ [task.pro_id]: res.data }))
                    );

                const proDetailsResponses = await Promise.all(proDetailsPromises);
                const proDetails = proDetailsResponses.reduce((acc, curr) => ({ ...acc, ...curr }), {});
                setProDetailsMap(proDetails);

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

    const handleBookTask = (task) => {
        navigate(`/book-pro?taskId=${task._id}&categoryId=${categoryId}&price=${task.price}&proId=${task.pro_id}&userId=${authUser._id}`);
    };

    return (
        <div className="flex w-screen h-screen">
            <div className="flex w-screen h-screen">
                <div className="w-1/4 p-4 border-r">
                    <h3 className="text-lg font-semibold mb-4 text-emerald-900">Filter Tasks</h3>

                    <div>

                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm text-emerald-950">Day:</label>
                        <div className="grid grid-cols-2 gap-2">
                            <label htmlFor="monday" className="inline-flex items-center text-emerald-950">
                                <input
                                    type="checkbox"
                                    id="monday"
                                    checked={filters.day === 'Monday'}
                                    onChange={() => handleFilterChange('day', 'Monday')}
                                    className="mr-1 text-emerald-950"
                                />
                                Monday
                            </label>
                            <label htmlFor="tuesday" className="inline-flex items-center text-emerald-950">
                                <input
                                    type="checkbox"
                                    id="tuesday"
                                    checked={filters.day === 'Tuesday'}
                                    onChange={() => handleFilterChange('day', 'Tuesday')}
                                    className="mr-1 text-emerald-950"
                                />
                                Tuesday
                            </label>
                            <label htmlFor="wednesday" className="inline-flex items-center text-emerald-950">
                                <input
                                    type="checkbox"
                                    id="wednesday"
                                    checked={filters.day === 'Wednesday'}
                                    onChange={() => handleFilterChange('day', 'Wednesday')}
                                    className="mr-1 text-emerald-950"
                                />
                                Wednesday
                            </label>
                            <label htmlFor="thursday" className="inline-flex items-center text-emerald-950">
                                <input
                                    type="checkbox"
                                    id="thursday"
                                    checked={filters.day === 'Thursday'}
                                    onChange={() => handleFilterChange('day', 'Thursday')}
                                    className="mr-1 text-emerald-950"
                                />
                                Thursday
                            </label>
                            <label htmlFor="friday" className="inline-flex items-center text-emerald-950">
                                <input
                                    type="checkbox"
                                    id="friday"
                                    checked={filters.day === 'Friday'}
                                    onChange={() => handleFilterChange('day', 'Friday')}
                                    className="mr-1 text-emerald-950"
                                />
                                Friday
                            </label>
                            <label htmlFor="saturday" className="inline-flex items-center text-emerald-950">
                                <input
                                    type="checkbox"
                                    id="saturday"
                                    checked={filters.day === 'Saturday'}
                                    onChange={() => handleFilterChange('day', 'Saturday')}
                                    className="mr-1 text-emerald-950"
                                />
                                Saturday
                            </label>
                            <label htmlFor="sunday" className="inline-flex items-center text-emerald-950">
                                <input
                                    type="checkbox"
                                    id="sunday"
                                    checked={filters.day === 'Sunday'}
                                    onChange={() => handleFilterChange('day', 'Sunday')}
                                    className="mr-1 text-emerald-950"
                                />
                                Sunday
                            </label>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm text-emerald-950">Time:</label>
                        <div>
                            <label htmlFor="time1" className="inline-flex  mx-3 text-emerald-950 items-center mr-4">
                                <input
                                    type="radio"
                                    id="time1"
                                    checked={filters.time === '8h-12h'}
                                    onChange={() => handleFilterChange('time', '8h-12h')}
                                    className="mr-1"
                                />
                                8h-12h AM
                            </label>
                            <label htmlFor="time2" className="inline-flex  mx-3 text-emerald-950 items-center mr-4">
                                <input
                                    type="radio"
                                    id="time2"
                                    checked={filters.time === '12h-3h'}
                                    onChange={() => handleFilterChange('time', '12h-3h')}
                                    className="mr-1"
                                />
                                12h-3h PM
                            </label>
                            <label htmlFor="time3" className="inline-flex mx-3 text-emerald-950 items-center">
                                <input
                                    type="radio"
                                    id="time3"
                                    checked={filters.time === '3h-6h'}
                                    onChange={() => handleFilterChange('time', '3h-6h')}
                                    className="mr-1"
                                />
                                3h-6h PM
                            </label>
                            <label htmlFor="time3" className="inline-flex text-emerald-950 mx-6 items-center">
                                <input
                                    type="radio"
                                    id="time3"
                                    checked={filters.time === '6h-10h'}
                                    onChange={() => handleFilterChange('time', '3h-6h')}
                                    className="mr-1"
                                />
                                6h-10h PM
                            </label>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="location" className="block mb-2 text-sm text-emerald-950">Location:</label>
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
                        <div className="card-conteiner">
                            <div className="card-content">
                                <div className="card-title">Price <span>Range</span></div>
                                <div className="values">
                                    <div>$<span id="first">65</span></div> -
                                    <div>$<span id="second">221</span></div>
                                </div>

                                <div data-range="#third" data-value-1="#second" data-value-0="#first" className="slider">
                                    <label className="label-min-value">50</label>
                                    <label className="label-max-value">399</label>
                                </div>
                                <div className="rangeslider">
                                    <input className="min input-ranges" name="range_1" type="range" min="1" max="10000" value="735" />
                                    <input className="max input-ranges" name="range_1" type="range" min="1" max="10000" value="6465" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="w-3/4 p-4">
                    <h2 className="text-3xl font-bold mb-8 text-emerald-950">{category.name} Tasks</h2>
                    <div>
                        {tasks.map(task => (
                            <div key={task._id} className="border p-6 mb-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold mb-4">{task.title}</h3>
                                <p>{task.description}</p>
                                <p>Price: {task.price} per hour</p>

                                {proDetailsMap[task.pro_id] && (
                                    <div className="mt-4">
                                        <h4 className="text-lg font-semibold">Tasker Details:</h4>
                                        <img src={proDetailsMap[task.pro_id].photo} alt={`${proDetailsMap[task.pro_id].first_name} ${proDetailsMap[task.pro_id].last_name}`} className="w-16 h-16 rounded-full mt-4" />
                                        <p className="mt-2"><strong>Name:</strong> {proDetailsMap[task.pro_id].first_name} {proDetailsMap[task.pro_id].last_name}</p>

                                        <p className="mt-2"><strong>Bio:</strong> {proDetailsMap[task.pro_id].bio}</p>
                                        <p className="mt-2"><strong>Bio:</strong> {proDetailsMap[task.pro_id].email}</p>
                                    </div>
                                )}
                                <button onClick={() => handleBookTask(task)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                                    Book Task
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryDetails;
