import React from 'react';
import AutocompleteSearch from './AutocompleteSearch';

const Hero = () => {
  const handleSelectCategory = (category) => {
    console.log('Selected category:', category);
  };

  return (
    <div className='hero-2 my-4' style={{ height: "455px !important"  }}>
      <section className=" w-screen" style={{ height: "450px" }}>
  <div className="p-8 w-screen md:p-12 lg:px-16 lg:py-24">
    <div className="mx-auto max-w-lg  text-center">
      <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                Get Things Done with Ease
      </h2>

    </div>
    <div className="mx-auto max-w-lg text-center">
      <p className="hidden text-gray-700  sm:mt-4 sm:block">
                Easy Booking for Reliable and Affordable Services, Tailored to Meet Your Every Need. From Home Cleaning and Gardening to Electrical Repairs and More, <strong>We've Got You Covered.</strong> 
      </p>
    </div>

    <div className="mx-auto mt-8 max-w-xl flex justify-center">
        <AutocompleteSearch onSelectCategory={handleSelectCategory}  />
      
    </div>
  </div>
</section>
    </div>
  );
};

export default Hero;
