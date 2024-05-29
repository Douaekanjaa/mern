import React, { useState, useEffect } from 'react';
import { useAuthProContext } from '../../context/AuthProContext';
import axios from 'axios';

const Profile = () => {
  const { authUser, login } = useAuthProContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState(null);


useEffect(() => {
    const fetchCategories = async () => {
        setIsLoadingCategories(true);
        setCategoriesError(null);
      
        try {
          if (authUser && authUser.categories && authUser.categories.length > 0) {
            const categoryIds = authUser.categories.map((category) => category._id);
            console.log('Category IDs:', categoryIds);
            const response = await axios.post('/api/category/filter', { categoryIds });
            setFilteredCategories(response.data);
          } else {
            setFilteredCategories([]);
          }
        } catch (error) {
          setCategoriesError(error.message);
        } finally {
          setIsLoadingCategories(false);
        }
      };
      
  
    if (authUser && authUser.categories) {
      setFormData({ ...authUser });
      fetchCategories();
    }
  }, [authUser]);
  


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const { name, files } = e.target;
    if (name === 'photo') setProfilePhoto(files[0]);
    if (name === 'coverPhoto') setCoverPhoto(files[0]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSubmit = new FormData();
    for (const key in formData) {
      formDataToSubmit.append(key, formData[key]);
    }
    if (profilePhoto) formDataToSubmit.append('photo', profilePhoto);
    if (coverPhoto) formDataToSubmit.append('coverPhoto', coverPhoto);

    try {
      const response = await axios.put('/api/pro/update', formDataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      login(response.data);
      setIsEditing(false);
      setSubmitMessage('Profile updated successfully!');
    } catch (error) {
      setSubmitMessage('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex w-full">
      <main className="flex-1 p-6 w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          {/* <span className="text-2xl font-bold text-gray-800">
            Welcome, {authUser ? `${authUser.first_name} ${authUser.last_name}` : 'Guest'}
          </span> */}
          {/* {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-lime-600 hover:bg-lime-700 text-white rounded-md transition"
            >
              Edit
            </button>
          )} */}
        </div>
        <section className="bg-white p-6 rounded-lg shadow-lg mb-6 mt-6 relative">
          <div
            className="relative h-64 w-full bg-cover bg-center rounded-lg"
            style={{ backgroundImage: `url(${authUser?.coverPhoto || 'default-cover.jpg'})` }}
          >
            <img
              className="w-32 h-32 rounded-full object-cover absolute bottom-[-2rem] left-6 border-4 border-white shadow-md"
              src={authUser?.photo}
              alt="Profile"
            />
            {/* {isEditing && (
              <>
                <label
                  htmlFor="coverPhotoUpload"
                  className="absolute top-2 right-2 bg-lime-600 hover:bg-lime-700 text-white p-2 rounded-md cursor-pointer transition"
                >
                  Change Cover Photo
                </label>
                <input
                  type="file"
                  id="coverPhotoUpload"
                  name="coverPhoto"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </>
            )} */}
          </div>
          <div className="mt-16 px-6">
            <h1 className="text-4xl font-bold text-gray-900">{`${authUser?.first_name} ${authUser?.last_name}`}</h1>
            <p className="my-10 text-lg text-black ">{authUser?.bio}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <p className=' text-gray-800'><strong className=' text-emerald-800 font-bold'>Email:</strong> {authUser?.email}</p>
              <p className=' text-gray-800'><strong className=' text-emerald-800 font-bold'>Phone:</strong> {authUser?.phone_number}</p>
              <p className=' text-gray-800'><strong className=' text-emerald-800 font-bold'>Address:</strong> {authUser?.address}</p>
              <p className=' text-gray-800'><strong className=' text-emerald-800 font-bold'>Rate</strong> 
  <div class="star-rating flex">
    <svg class="h-5 w-5" fill="#fae588" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" ><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
    <svg class="h-5 w-5" fill="#fae588" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" ><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
    <svg class="h-5 w-5" fill="#fae588" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" ><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
    <svg class="h-5 w-5" fill="#fae588" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" ><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
  </div>
</p>

              
            </div>
          </div>
        </section>

        {isEditing && (
          <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
            <form onSubmit={handleFormSubmit} encType="multipart/form-data">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Phone</label>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Rate</label>
                  <input
                    type="number"
                    name="rate"
                    value={formData.rate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-700">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  ></textarea>
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-700">Profile Photo</label>
                  <input
                    type="file"
                    name="photo"
                    onChange={handlePhotoChange}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 mr-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-lime-600 hover:bg-lime-700 text-white rounded-md transition"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
            {submitMessage && <p className="mt-4 text-center text-green-500">{submitMessage}</p>}
          </section>
        )}

        <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Availability</h2>
          <ul className=" list-inside list-none text-gray-700">
  {authUser?.availability.map((slot, index) => (
    <li key={index}>
      {`${slot.day}: ${slot.hours.map(hour => hour.hour).join(', ')}`}
    </li>
  ))}
</ul>

        </section>

        <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Categories</h2>
          <ul className="list-disc list-inside text-gray-700 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
  {isLoadingCategories ? (
    <p>Loading categories...</p>
  ) : categoriesError ? (
    <p className="text-red-500">Error fetching categories: {categoriesError}</p>
  ) : filteredCategories.length > 0 ? (
    filteredCategories.map((category, index) => (
      <li key={index} className="flex items-center space-x-2">
        <img src={category.picture} alt={category.name} className="w-12 h-12 rounded-full" />
        <span>{category.name}</span>
      </li>
    ))
  ) : (
    <p>No categories found.</p>
  )}
</ul>

        </section>
      </main>
    </div>
  );
};

export default Profile;
