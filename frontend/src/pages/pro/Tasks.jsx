
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
  const { authUser, login } = useAuthProContext();  //get the id of the auth pro by authUser._id
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
    <div className='w-screen h-screen'>
      <ProNav /> <br /> <br />
      <h1>Add Task</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">Select category</option>
            {categoryOptions.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="location">Location:</label>
          <select
            id="location"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            required
          >
            <option value="">Select location</option>
            {locationOptions.map((location) => (
              <option key={location._id} value={location.name}>
                {location.city_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="duration">Duration:</label>
          <input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          /> <span  className=' mx-5'>Hours</span>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding Task...' : 'Add Task'}
        </button>
        {error && <p>{error}</p>}
      </form>

      <h1>Tasks</h1>
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task._id}>
              <h3>{task.title}</h3>
              <p>Description: {task.description}</p>
              <p>Category: {task.category}</p>
              <p>Location: {task.location}</p>
              <p>Price: {task.price}</p>
              <p>Date: {task.date}</p>
              <p>Duration: {task.duration}</p> hr
              <p>Status: {task.status}</p>
              <p>Status: {task.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  