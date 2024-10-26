'use client'; // Ensures client-side rendering

import { useState } from 'react';

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
    <div style={styles.pageContainer}>
      {/* Top Left Corner Text */}
      <div style={styles.header}>
        <a href="/" style={styles.headerText}>reliefmap.ca</a>
      </div>

      {/* Main Content */}
      <div style={styles.container}>
        <p style={styles.text}>
          Find relief near you:
          <input 
            type="text" 
            value={location} 
            onChange={handleChange} 
            placeholder="my location" 
            style={styles.input} 
          />
        </p>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div style={styles.suggestionsBox}>
            {suggestions.map((city, index) => (
              <div 
                key={index} 
                onClick={() => handleSuggestionClick(city)}
                style={styles.suggestion}
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

const styles = {
  pageContainer: {
    position: 'relative',
    height: '100vh',
    width: '100%',
  },
  header: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  headerText: {
    textDecoration: 'none',
    color: 'black',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
    fontFamily: 'Arial, sans-serif',
  },
  text: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  input: {
    border: 'none',
    borderBottom: '2px solid red',
    outline: 'none',
    fontSize: '24px',
    fontStyle: 'italic',
    marginLeft: '8px',
  },
  suggestionsBox: {
    position: 'absolute',
    top: '60%',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    width: '200px',
    maxHeight: '150px',
    overflowY: 'auto',
    zIndex: 1000,
  },
  suggestion: {
    padding: '10px',
    cursor: 'pointer',
    borderBottom: '1px solid #ddd',
  },
};

export default Page;
