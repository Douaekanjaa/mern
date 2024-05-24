// Profile.jsx

import React from 'react';
import { useAuthProContext } from '../../context/AuthProContext';

const Profile = () => {
  const { authUser } = useAuthProContext();

  if (!authUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile">
      <h1>Profile</h1>
      <p><strong>First Name:</strong> {authUser.first_name}</p>
      <p><strong>Last Name:</strong> {authUser.last_name}</p>
      <p><strong>Email:</strong> {authUser.email}</p>
      <p><strong>Phone Number:</strong> {authUser.phone_number}</p>
      <p><strong>Categories:</strong> {authUser.categories.join(', ')}</p>
      <p><strong>Location:</strong> {authUser.location_id.city_name}</p>
      <p><strong>Date of Birth:</strong> {authUser.date_of_birth}</p>
      <p><strong>Gender:</strong> {authUser.gender}</p>
      <p><strong>CV:</strong> {authUser.cv}</p>
      <img src={authUser.photo} alt="Profile" className="profile__photo" />
    </div>
  );
};

export default Profile;
