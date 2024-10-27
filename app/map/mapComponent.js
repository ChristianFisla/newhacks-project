'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { fetchFacilities } from '@/utils/fetchFacilities';
import { loadCSV } from '@/utils/loadCsv';

// Define the path for the custom icon
const pingIcon = new L.Icon({
  iconUrl: '/images/ping.png',
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
});
const pegman = new L.Icon({
    iconUrl: '/images/pegman.png',
    iconSize: [45, 45],
    iconAnchor: [15, 45],
    popupAnchor: [1, -34],
  });

const pingIconYellow = new L.Icon({
  iconUrl: '/images/pinggreen.png',
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
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
      map.setView(cityCoordinates[selectedCity], 12, { animate: true });
    }
  }, [selectedCity, map]);

  return null;
};

const MapComponent = ({ selectedCity }) => {
  const [facilities, setFacilities] = useState([]);
  const [csvFacilities, setCsvFacilities] = useState([]);
  const [position, setPosition] = useState(null); // Use state to store user's location

  // Set Toronto as the default center with a higher zoom level
  const defaultCenter = cityCoordinates.Toronto;
  const defaultZoomLevel = 12;

  // Checklist state to toggle visibility of different facility types
  const [showCsvHospitals, setShowCsvHospitals] = useState(true);
  const [showShelters, setShowShelters] = useState(true);

  // Get the user's geolocation
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.error('Geolocation error:', err);
      }
    );
  }, []);

  useEffect(() => {
    // Fetch facilities from Overpass API
    if (selectedCity && cityCoordinates[selectedCity]) {
      const [lat, lon] = cityCoordinates[selectedCity];
      fetchFacilities(lat, lon).then((data) => {
        console.log('Overpass API data:', data);
        setFacilities(data);
      });
    }

    // Load filtered CSV data
    loadCSV('/odhf_v1.csv') // Assuming the CSV file is in the public directory
      .then((data) => {
        const filteredData = data.filter(row => row.latitude && row.longitude);
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
      .catch((error) => {
        console.error('Error loading CSV:', error);
      });
  }, [selectedCity]);

  return (
    <div style={{ display: 'flex' }}>
      {/* Checklist UI */}
      <div style={{ padding: '10px', width: '250px', backgroundColor: '#f8f9fa' }}>
        <h3>Toggle Facility Types</h3>
        <div>
          <input
            type="checkbox"
            checked={showCsvHospitals}
            onChange={() => setShowCsvHospitals(!showCsvHospitals)}
          />{' '}
          Show Hospitals
        </div>
        <div>
          <input
            type="checkbox"
            checked={showShelters}
            onChange={() => setShowShelters(!showShelters)}
          />{' '}
          Show Shelters
        </div>
      </div>

      {/* Map Component */}
      <MapContainer
        center={selectedCity ? cityCoordinates[selectedCity] : defaultCenter}
        zoom={selectedCity ? 14 : defaultZoomLevel}
        scrollWheelZoom={true}
        style={{ height: '100vh', width: 'calc(100vw - 250px)', position: 'relative', zIndex: 1 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        

        {/* Conditionally render markers based on the checklist toggle */}

        {showShelters &&
          facilities
            .filter(facility => facility.tags.amenity === 'shelter')
            .map((facility, index) => (
              <Marker key={`api-${index}`} position={[facility.lat, facility.lon]} icon={pingIconYellow}>
                <Popup>
                  {facility.tags.name || 'Unnamed Facility'}<br />
                  {facility.tags.amenity}
                </Popup>
              </Marker>
            ))}

        {showCsvHospitals &&
          csvFacilities.map((facility, index) => (
            <Marker key={`csv-${index}`} position={[facility.lat, facility.lon]} icon={pingIcon}>
              <Popup>
                {facility.tags.name || 'Unnamed Facility'}<br />
                {facility.tags.amenity}
              </Popup>
            </Marker>
          ))}

        {/* Render marker for user's location */}
        {position && (
          <Marker position={position} icon={pegman}>
            <Popup>
              {'Your Location'}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
