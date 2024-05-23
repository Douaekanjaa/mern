import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';

const AutocompleteSearch = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/category/all');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = () => {
    if (selectedCategory) {
      onSelectCategory(selectedCategory);
    } else {
      console.error('No category selected');
    }
  };

  return (
    <Stack spacing={2} sx={{ width: 390 }}>
      <Stack direction="row" alignItems="center">
        <Autocomplete
          id="free-solo-demo"
          style={{ width: "370px" }}
          freeSolo
          options={categories.map((category) => category.name)}
          renderInput={(params) => <TextField {...params} label="Search for a category" />}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          onChange={(event, newValue) => {
            const selected = categories.find(category => category.name === newValue) || null;
            setSelectedCategory(selected);
          }}
        />
       

        <button 
          class="button SearchButton"
          type="button"
          onClick={handleSubmit}
        >
  <span>
    <svg viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M9.145 18.29c-5.042 0-9.145-4.102-9.145-9.145s4.103-9.145 9.145-9.145 9.145 4.103 9.145 9.145-4.102 9.145-9.145 9.145zm0-15.167c-3.321 0-6.022 2.702-6.022 6.022s2.702 6.022 6.022 6.022 6.023-2.702 6.023-6.022-2.702-6.022-6.023-6.022zm9.263 12.443c-.817 1.176-1.852 2.188-3.046 2.981l5.452 5.453 3.014-3.013-5.42-5.421z"></path></svg>
  </span>
</button>
      </Stack>
    </Stack>

  );
};

export default AutocompleteSearch;
