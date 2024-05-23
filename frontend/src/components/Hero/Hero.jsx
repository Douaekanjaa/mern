import React from 'react';
import AutocompleteSearch from './AutocompleteSearch';

const Hero = () => {
  const handleSelectCategory = (category) => {
    console.log('Selected category:', category);
  };

  return (
    <div className={"flex hero1 justify-center items-center h-screen"}>
      <AutocompleteSearch onSelectCategory={handleSelectCategory} />
    </div>
  );
};

export default Hero;
