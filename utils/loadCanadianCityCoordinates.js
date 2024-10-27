// utils/loadCanadianCityCoordinates.js

import Papa from 'papaparse';

let cachedCityCoordinates = null;

export const loadCanadianCityCoordinates = async () => {
  if (cachedCityCoordinates) {
    return cachedCityCoordinates;
  }

  try {
    const response = await fetch('/canadacities.csv');

    if (!response.ok) {
      throw new Error(`Failed to fetch canadacities.csv: ${response.status} ${response.statusText}`);
    }

    const csvText = await response.text();

    const results = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    if (!results.data) {
      throw new Error('No data found in CSV');
    }

    if (results.errors && results.errors.length > 0) {
      console.error('CSV Parsing Errors:', results.errors);
      throw new Error('Error parsing CSV');
    }

    const cityCoordinates = {};
    results.data.forEach((row) => {
      let cityName = row.city_ascii;
      const lat = parseFloat(row.lat);
      const lng = parseFloat(row.lng);
      if (cityName && !isNaN(lat) && !isNaN(lng)) {
        cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
        cityCoordinates[cityName] = [lat, lng];
      }
    });

    cachedCityCoordinates = cityCoordinates;
    return cityCoordinates;
  } catch (error) {
    console.error('Error loading Canadian city coordinates:', error);
    throw error;
  }
};
