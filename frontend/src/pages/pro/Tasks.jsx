import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProNav from '../../components/Pro/ProNav';
import { useAuthProContext } from '../../context/AuthProContext';

export default function Tasks() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [tasks, setTasks] = useState([]);
  const { authUser } = useAuthProContext();  //get the id of the auth pro by authUser._id
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategoryOptions();
    fetchLocationOptions();
    fetchTasks();
  }, []);

  const fetchCategoryOptions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/category/all');
      setCategoryOptions(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
  };

  const fetchLocationOptions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/location/all');
      setLocationOptions(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error.message);
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/tasks/all');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
      setError('Failed to fetch tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const category = categoryOptions.find(category => category.name === selectedCategory);
      const location = locationOptions.find(location => location.city_name === selectedLocation);
  
      // Parse duration as a number
      const numericDuration = parseFloat(duration);
      if (isNaN(numericDuration)) {
        throw new Error('Please enter a valid number for duration (hours)');
      }
  
      const response = await axios.post('http://localhost:5000/api/tasks/add', {
        pro_id: authUser._id,
        title,
        description,
        category_id: category._id,
        location_id: location._id,
        price,
        duration: numericDuration,
      });
  
      console.log('Task added successfully:', response.data);
      setTitle('');
      setDescription('');
      setSelectedCategory('');
      setSelectedLocation('');
      setPrice('');
      setDuration('');
      fetchTasks(); // Fetch updated tasks after successful addition
    } catch (error) {
      console.error('Error adding task:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gray-100 p-4">
      <ProNav />
      <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-6">Add Task</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded"
              placeholder="Enter task title"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded"
              placeholder="Enter task description"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded"
            >
              <option value="">Select category</option>
              {categoryOptions.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <select
              id="location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded"
            >
              <option value="">Select location</option>
              {locationOptions.map((location) => (
                <option key={location._id} value={location.city_name}>
                  {location.city_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded"
              placeholder="Enter price per hour"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration</label>
            <input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded"
              placeholder="Enter duration in hours"
            /> 
            <span className="text-sm text-gray-500 mx-2">Hours</span>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {loading ? 'Adding Task...' : 'Add Task'}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
      <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-6">Tasks</h1>
        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task._id} className="mb-4 p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <p className="text-sm text-gray-700"><strong>Description:</strong> {task.description}</p>
                <p className="text-sm text-gray-700"><strong>Category:</strong> {task.category}</p>
                <p className="text-sm text-gray-700"><strong>Location:</strong> {task.location}</p>
                <p className="text-sm text-gray-700"><strong>Price:</strong> {task.price}</p>
                <p className="text-sm text-gray-700"><strong>Date:</strong> {task.date}</p>
                <p className="text-sm text-gray-700"><strong>Duration:</strong> {task.duration} hours</p>
                <p className="text-sm text-gray-700"><strong>Status:</strong> {task.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
