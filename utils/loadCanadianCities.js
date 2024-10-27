import Papa from 'papaparse';

export const loadCanadianCities = async (url) => {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      complete: (results) => {
        const cityCoordinates = results.data.reduce((acc, city) => {
          const cityName = city.city_ascii;
          const lat = parseFloat(city.lat);
          const lng = parseFloat(city.lng);

          if (!isNaN(lat) && !isNaN(lng)) {
            acc[cityName] = [lat, lng];
          }

          return acc;
        }, {});

        resolve(cityCoordinates);
      },
      error: (error) => reject(error),
    });
  });
};
