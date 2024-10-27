// utils/fetchFacilities.js

export const fetchFacilities = async (lat, lon, radius = 50000) => {
    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    const query = `
      [out:json];
      (
        node["amenity"="hospital"](around:${radius},${lat},${lon});
        node["amenity"="food_bank"](around:${radius},${lat},${lon});
        node["amenity"="shelter"](around:${radius},${lat},${lon});
      );
      out body;
    `;
  
    try {
      const response = await fetch(overpassUrl, {
        method: 'POST',
        body: new URLSearchParams({ data: query }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch facilities data');
      }
  
      const data = await response.json();
      return data.elements; // Returns an array of facilities
    } catch (error) {
      console.error('Error fetching facilities:', error);
      return [];
    }
  };
  