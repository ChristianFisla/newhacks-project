'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { fetchFacilities } from '@/utils/fetchFacilities';
import { loadCSV } from '@/utils/loadCsv'; // Import the loadCSV utility
import { inter } from '../fonts';
import Image from 'next/image';

// Define the path for the custom icon
const pingIcon = new L.Icon({
  iconUrl: '/images/ping.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  shadowSize: [41, 41],
});

// Coordinates for Canadian cities
const cityCoordinates = {
  Toronto: [43.65107, -79.347015],
  Vancouver: [49.2827, -123.1207],
  Montreal: [45.5017, -73.5673],
  // Add more cities as needed...
};

const CenterMap = ({ selectedCity }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedCity && cityCoordinates[selectedCity]) {
      map.setView(cityCoordinates[selectedCity], 10, { animate: true });
    }
  }, [selectedCity, map]);

  return null;
};

const Page = () => {
  const searchParams = useSearchParams();
  const selectedCity = searchParams.get('city');
  const [facilities, setFacilities] = useState([]);
  const [csvFacilities, setCsvFacilities] = useState([]);

  const defaultCenter = [56.1304, -106.3468];
  const zoomLevel = selectedCity ? 10 : 4;

  useEffect(() => {
    // Fetch facilities from Overpass API
    if (selectedCity && cityCoordinates[selectedCity]) {
      const [lat, lon] = cityCoordinates[selectedCity];
      fetchFacilities(lat, lon).then(data => {
        console.log('Overpass API data:', data);
        setFacilities(data);
      });
    }

    // Load and parse CSV data
    loadCSV('/odhf_v1.csv') // Assuming the CSV file is in the public directory
      .then(data => {
        // Filter valid entries with latitude and longitude
        const filteredData = data.filter(row => row.latitude && row.longitude);
        // Map the CSV data to a format similar to the API data
        const parsedCsvFacilities = filteredData.map(facility => ({
          lat: parseFloat(facility.latitude),
          lon: parseFloat(facility.longitude),
          tags: {
            name: facility.facility_name,
            amenity: facility.odhf_facility_type,
          },
        }));
        console.log('CSV data:', parsedCsvFacilities);
        setCsvFacilities(parsedCsvFacilities);
      })
      .catch(error => {
        console.error('Error loading CSV:', error);
      });
  }, [selectedCity]);

  return (
    <>
      <header className="w-full p-4 bg-white shadow-lg relative flex h-20 items-center z-50">
        <a href='/' className={`${inter.className} text-xl font-bold ml-6 flex items-center space-x-2`}>
          <Image
            src="/images/ping.png"
            width={18}
            height={18}
            priority
            alt="Logo"
          />
          <span>reliefmap.ca</span>
        </a>
      </header>

      <MapContainer
        id="map-container"
        key={selectedCity || 'default'}
        center={selectedCity ? cityCoordinates[selectedCity] : defaultCenter}
        zoom={zoomLevel}
        scrollWheelZoom={true}
        style={{ height: '100vh', width: '100vw', position: 'relative', zIndex: 1 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {selectedCity && (
          <>
            <Marker position={cityCoordinates[selectedCity]} icon={pingIcon}>
              <Popup>{selectedCity}</Popup>
            </Marker>
            <CenterMap selectedCity={selectedCity} />
          </>
        )}

        {/* Render markers for facilities from Overpass API */}
        {facilities.map((facility, index) => (
          <Marker key={`overpass-${index}`} position={[facility.lat, facility.lon]} icon={pingIcon}>
            <Popup>
              {facility.tags.name || 'Unnamed Facility'}<br />
              {facility.tags.amenity}
            </Popup>
          </Marker>
        ))}

        {/* Render markers for facilities from CSV */}
        {csvFacilities.map((facility, index) => (
          <Marker key={`csv-${index}`} position={[facility.lat, facility.lon]} icon={pingIcon}>
            <Popup>
              {facility.tags.name || 'Unnamed Facility'}<br />
              {facility.tags.amenity}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
};

export default Page;
