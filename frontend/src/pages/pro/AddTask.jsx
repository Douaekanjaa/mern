import React, { useState } from 'react';

const AddTask = ({ categoryOptions, locationOptions, handleSubmit, loading, error }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-emerald-950">Add Task</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-2 text-sm text-emerald-950">Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-2 text-sm text-emerald-950">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            required
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>
        <div>
          <label htmlFor="category" className="block mb-2 text-sm text-emerald-950">Category:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md text-sm"
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
          <label htmlFor="location" className="block mb-2 text-sm text-emerald-950">Location:</label>
          <select
            id="location"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md text-sm"
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
          <label htmlFor="price" className="block mb-2 text-sm text-emerald-950">Price:</label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price per hour"
            required
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>
        <div>
          <label htmlFor="duration" className="block mb-2 text-sm text-emerald-950">Duration:</label>
          <div className="flex items-center">
            <input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Enter duration in hours"
              required
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
            <span className="ml-2 text-sm text-emerald-950">Hours</span>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700 transition-colors"
        >
          {loading ? 'Adding Task...' : 'Add Task'}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default AddTask;
