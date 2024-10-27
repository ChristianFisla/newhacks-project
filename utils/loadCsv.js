import Papa from 'papaparse';

// Utility function to load, parse, and filter CSV data
export const loadCSV = (url) => {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      complete: (results) => {
        // Filter the data here
        const filteredData = results.data.filter((row) => {
          // Ensure the row has the necessary data
          if (!row.source_facility_type) return false;

          // Define the facility types you want to include
          const includedTypes = [
            'acute',
            'general',
            // Add other types that represent major/general hospitals
          ];

          // Normalize the facility type for case-insensitive comparison
          const facilityType = row.source_facility_type.toLowerCase();

          // Check if the facility type is in the included types
          return includedTypes.includes(facilityType);
        });

        resolve(filteredData);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};
