import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Profile2 = () => {
  const { proId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const response = await axios.get(`/pros/api/${proId}`);
        setProfile(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, [proId]);
  
  // Log the profile object
  console.log("profil: ",profile);
  

  

  return (
    <div className="container mx-auto">
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {profile && (
        <>
          <section className="bg-white p-6 rounded-lg shadow-lg mb-6 mt-6 relative">
            <div
              className="relative h-64 w-full bg-cover bg-center rounded-lg"
              style={{ backgroundImage: `url(${profile.coverPhoto || 'default-cover.jpg'})` }}
            >
              <img
                className="w-32 h-32 rounded-full object-cover absolute bottom-[-2rem] left-6 border-4 border-white shadow-md"
                src={profile.photo}
                alt="Profile"
              />
            </div>
            <div className="mt-16 px-6">
              <h1 className="text-4xl font-bold text-gray-900">{`${profile.first_name} ${profile.last_name}`}</h1>
              <p className="my-10 text-lg text-black ">{profile.bio}</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <p className='text-gray-800'><strong className='text-emerald-800 font-bold'>Email:</strong> {profile.email}</p>
                <p className='text-gray-800'><strong className='text-emerald-800 font-bold'>Phone:</strong> {profile.phone_number}</p>
                <p className='text-gray-800'><strong className='text-emerald-800 font-bold'>Address:</strong> {profile.address}</p>
                <p className='text-gray-800'><strong className='text-emerald-800 font-bold'>Rate</strong> 
                  <div className="star-rating flex">
                    {[...Array(profile.rate)].map((_, index) => (
                      <svg key={index} className="h-5 w-5" fill="#fae588" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Availability</h2>
            <ul className="list-inside list-none text-gray-700">
              {profile.availability.map((slot, index) => (
                <li key={index}>
                  {`${slot.day}: ${slot.hours.map(hour => hour.hour).join(', ')}`}
                </li>
              ))}
            </ul>
          </section>



        </>
      )}
    </div>
  );
};

export default Profile2;
