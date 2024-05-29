import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DevenirPro = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
    location_id: "",
    address: "",
    phone_number: "",
    photo: null,
    date_of_birth: "",
    bio: "",
    cv: "",
    categories: ["", "", ""],
    availability: []
  });

  const [currentStep, setCurrentStep] = useState(1);
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
      const hourIndex = updatedAvailability[dayIndex].hours.findIndex((h) => h.hour === hour);
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
      updatedAvailability[dayIndex].hours = [{ hour: "not-available", available: false }];
    } else {
      updatedAvailability.push({ day, hours: [{ hour: "not-available", available: false }] });
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
        } else if (key === "availability") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
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
          navigate("/profile");
        }
      }
    } catch (error) {
      console.log(formData.availability);
      console.log(JSON.stringify(formData.availability));

      console.error("Registration error:", error.message, error.response?.data);
    }
  };



  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="w-screen h-screen devenirprobackground ">
      <div className=" bg hd w-screen my-7 mx-auto p-6 px-20 rounded-lg  devenirprobackground2 shadow-2xl">
        <h1 className="text-2xl font-bold text-center text-emerald-800 mb-6">Become a Pro</h1>
        <div className="flex hd justify-center mx-auto mb-6 ">
          <Stepper currentStep={currentStep} />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 ">
          {currentStep === 1 && (
            <Step1
              formData={formData}
              handleChange={handleChange}
              prevStep={prevStep}
              nextStep={nextStep}
            />
          )}
          {currentStep === 2 && (
            <Step2
              formData={formData}
              handleChange={handleChange}
              locations={locations}
              prevStep={prevStep}
              nextStep={nextStep}
            />
          )}
          {currentStep === 3 && (
            <Step3
              formData={formData}
              handleChange={handleChange}
              handleCategoryChange={handleCategoryChange}
              categories={categories}
              handleAvailabilityChange={handleAvailabilityChange}
              handleNotAvailableChange={handleNotAvailableChange}
              prevStep={prevStep}
              nextStep={nextStep}
              handleSubmit={handleSubmit}
            />
          )}
        </form>
      </div>

    </div>
  );
};

const Stepper = ({ currentStep }) => (
  <div className="flex space-x-4 steps steps-vertical lg:steps-horizontal">
    {[1, 2, 3].map((step) => (
      <div
        key={step}
        className={`w-8 h-8 flex items-center justify-center rounded-full ${currentStep === step ? "bg-emerald-800 text-white" : "bg-gray-200 text-gray-500"
          }`}
      >
        {step}
      </div>

    ))}
  </div>
);

const Step1 = ({ formData, handleChange, prevStep, nextStep }) => (
  <>
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
      <label htmlFor="male" className="text-zinc-800">Male</label>
      <input
        type="radio"
        id="female"
        name="gender"
        value="female"
        checked={formData.gender === "female"}
        onChange={handleChange}
        className="mr-2 ml-9 "
      />
      <label htmlFor="female" className="text-zinc-800">Female</label>
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


    <div className="flex justify-between">
      <button type="button" onClick={prevStep} className="w-1/3 p-2 bg-gray-400 text-white rounded hover:bg-gray-500">
        Previous
      </button>
      <button type="button" onClick={nextStep} className="w-1/3 p-2 bg-emerald-800 text-white rounded hover:bg-emerald-600">
        Next
      </button>
    </div>
  </>
);

const Step2 = ({ formData, handleChange, locations, prevStep, nextStep }) => (
  <>
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
      name="address"
      value={formData.address}
      onChange={handleChange}
      placeholder="Address"
      className="w-full p-2 border border-gray-300 rounded"
      required
    />
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
    <div className="flex justify-between">
      <button type="button" onClick={prevStep} className="w-1/3 p-2 bg-gray-400 text-white rounded hover:bg-gray-500">
        Previous
      </button>
      <button type="button" onClick={nextStep} className="w-1/3 p-2 bg-emerald-800 text-white rounded hover:bg-emerald-600">
        Next
      </button>
    </div>
  </>
);

const Step3 = ({ formData, handleChange, handleCategoryChange, categories, handleAvailabilityChange, handleNotAvailableChange, prevStep, nextStep }) => (
  <>
    <textarea
      name="bio"
      value={formData.bio}
      onChange={handleChange}
      placeholder="Bio"
      className="w-full p-2 border border-gray-300 rounded"
    ></textarea>
    <input
      type="text"
      name="cv"
      value={formData.cv}
      onChange={handleChange}
      placeholder="CV URL"
      className="w-full p-2 border border-gray-300 rounded"
      required
    />
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
    <div className="space-y-6">
      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
        <div key={day} className="p-4 border rounded-lg shadow-md bg-white">
          <p className="text-center font-bold text-lg mb-3">{day}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                <label
                  className={`text-sm ${hour === "not-available" ? 'text-red-600' : 'text-green-600'} `}
                  title={hour === "not-available" ? "Mark as not available for the whole day" : `Available from ${hour}`}
                >
                  {hour === "not-available" ? "Not Available" : hour}
                </label>
              </div>
            ))}
          </div>
          <div className="text-center mt-2">
            {formData.availability.some((avail) => avail.day === day && avail.hours.some((h) => h.hour === "not-available" && h.available)) && (
              <p className="text-sm text-red-600">You have marked yourself as not available for {day}.</p>
            )}
          </div>
        </div>
      ))}
    </div>
    <div className="flex justify-between">
      <button type="button" onClick={prevStep} className="w-1/3 p-2 bg-gray-400 text-white rounded hover:bg-gray-500">
        Previous
      </button>
      <button type="submit" className="w-1/3 p-2 bg-emerald-800 text-white rounded hover:bg-emerald-600">
        Register
      </button>

    </div>
  </>
);

export default DevenirPro;
