import Papa from 'papaparse';

let cachedData = null; // Optional caching to prevent multiple fetches

export const loadCanadianCities = async () => {
  if (cachedData) {
    return cachedData;
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

    if (results.errors && results.errors.length > 0) {
      console.error('CSV Parsing Errors:', results.errors);
      throw new Error('Error parsing CSV');
    }

    const cityNames = results.data
      .map((row) => {
        const cityName = row.city_ascii;
        if (cityName) {
          return cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
        }
        return null;
      })
      .filter(Boolean); // Remove null values

    cachedData = cityNames;
    return cachedData;
  } catch (error) {
    console.error('Error loading Canadian cities:', error);
    throw error;
  }
};
