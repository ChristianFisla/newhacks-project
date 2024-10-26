'use client'; // Ensures client-side rendering

import { useState } from 'react';
import { inter } from './fonts';

const canadianCities = [
  "Toronto", "Vancouver", "Montreal", "Calgary", "Edmonton", "Ottawa", 
  "Winnipeg", "Quebec City", "Hamilton", "Kitchener", "Victoria", 
  "Halifax", "Saskatoon", "Regina", "St. John's", "Sudbury", "Windsor",
  "Charlottetown", "Fredericton", "Moncton", "Kelowna", "London", "Barrie",
];

const Page = () => {
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Handle user input change
  const handleChange = (e) => {
    const value = e.target.value;
    setLocation(value);

    // Filter the list of cities based on input
    if (value.length > 0) {
      const filteredCities = canadianCities.filter(city =>
        city.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredCities);
    } else {
      setSuggestions([]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (city) => {
    setLocation(city);
    setSuggestions([]);
  };

  return (
    <div className="relative h-screen flex flex-col items-center justify-center">
      {/* Top Left Corner Text */}
      <div className={`${inter.className} absolute top-5 left-5 font-bold text-lg`}>
        <a href="/" className="text-black">reliefmap.ca</a>
      </div>

      {/* Main Content */}
      <div className="text-center">
        <h className={`${inter.className} text-5xl font-medium`}>
          Find relief near you:
          <input
            type="text"
            value={location}
            onChange={handleChange}
            placeholder="my location"
            className="ml-2 border-b-2 border-red-500 outline-none italic text-xl"
          />
        </h>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute mt-4 bg-white border border-gray-300 w-48 max-h-40 overflow-y-auto z-10">
            {suggestions.map((city, index) => (
              <div 
                key={index} 
                onClick={() => handleSuggestionClick(city)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {city}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
