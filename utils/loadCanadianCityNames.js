import Papa from 'papaparse';

let cachedCityNames = null;

export const loadCanadianCityNames = async () => {
  if (cachedCityNames) {
    return cachedCityNames;
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

    const cityNames = results.data
      .map((row) => {
        let cityName = row.city_ascii;
        if (cityName) {
          cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
          return cityName;
        }
        return null;
      })
      .filter(Boolean); // Remove null values

    cachedCityNames = cityNames;
    return cityNames;
  } catch (error) {
    console.error('Error loading Canadian city names:', error);
    throw error;
  }
};
