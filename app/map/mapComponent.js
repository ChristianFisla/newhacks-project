'use client';

import app from '@/firebase/firebase-config';
import { fetchFacilities } from '@/utils/fetchFacilities';
import { loadCanadianCityCoordinates } from '@/utils/loadCanadianCityCoordinates';
import { loadCSV } from '@/utils/loadCsv';
import { collection, getFirestore, onSnapshot } from 'firebase/firestore'; // Import Firestore utilities
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';

const db = getFirestore(app);

// Define custom icons
const pingIcon = new L.Icon({
  iconUrl: '/images/ping.png',
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
});

const pingIconGreen = new L.Icon({
  iconUrl: '/images/pinggreen.png',
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
});

const pegman = new L.Icon({
  iconUrl: '/images/pegman.png',
  iconSize: [45, 45],
  iconAnchor: [22.5, 45],
  popupAnchor: [1, -34],
});

const pingIconYellow = new L.Icon({
  iconUrl: '/images/pingyellow.png',
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
});

const MapComponent = ({ selectedCity }) => {
  const [cityCoordinates, setCityCoordinates] = useState({});
  const [facilities, setFacilities] = useState([]);
  const [csvFacilities, setCsvFacilities] = useState([]);
  const [position, setPosition] = useState(null);
  const [userSites, setUserSites] = useState([]);

  // Load cityCoordinates asynchronously
  useEffect(() => {
    const loadCities = async () => {
      const cities = await loadCanadianCityCoordinates();
      setCityCoordinates(cities);
    };
    loadCities();
  }, []);

  // Load user sites from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'sites'),
      (snapshot) => {
        const sites = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log('Real-time Sites:', sites);
        setUserSites(sites);
      }
    );

    return () => unsubscribe();
  }, []);

  // Set a default center for Canada if no city is selected
  const defaultCenter = [56.1304, -106.3468]; // Coordinates for Canada's geographic center
  const defaultZoomLevel = 4;

  // Toggle visibility of facility types
  const [showCsvHospitals, setShowCsvHospitals] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showUserSites, setShowUserSites] = useState(true); // Add state for user sites

  // Get user's geolocation
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

  // Fetch facilities when selectedCity or cityCoordinates change
  useEffect(() => {
    if (selectedCity && cityCoordinates[selectedCity]) {
      const [lat, lon] = cityCoordinates[selectedCity];
      fetchFacilities(lat, lon).then((data) => {
        console.log('Overpass API data:', data);
        setFacilities(data);
      });
    }
  }, [selectedCity, cityCoordinates]);

  // Load CSV facilities
  useEffect(() => {
    loadCSV('/odhf_v1.csv')
      .then((data) => {
        const filteredData = data.filter(
          (row) => row.latitude && row.longitude
        );
        const parsedCsvFacilities = filteredData
          .map((facility) => ({
            lat: parseFloat(facility.latitude),
            lon: parseFloat(facility.longitude),
            tags: {
              name: facility.facility_name,
              amenity: facility.odhf_facility_type,
            },
          }))
          .filter(
            (facility) => !isNaN(facility.lat) && !isNaN(facility.lon)
          );
        console.log('CSV data:', parsedCsvFacilities);
        setCsvFacilities(parsedCsvFacilities);
      })
      .catch((error) => {
        console.error('Error loading CSV:', error);
      });
  }, []);

  return (
    <div style={{ display: 'flex', position: 'relative' }}>
      {/* Checklist UI */}
      <div
        style={{
          padding: '10px',
          width: '250px',
          backgroundColor: '#f8f9fa',
        }}
      >
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
        <div>
          <input
            type="checkbox"
            checked={showUserSites}
            onChange={() => setShowUserSites(!showUserSites)}
          />{' '}
          Show User Sites
        </div>
      </div>

      {/* Map Component */}
      <MapContainer
        center={
          selectedCity && cityCoordinates[selectedCity]
            ? cityCoordinates[selectedCity]
            : position || defaultCenter
        }
        zoom={
          selectedCity && cityCoordinates[selectedCity] ? 14 : defaultZoomLevel
        }
        scrollWheelZoom={true}
        style={{
          height: '100vh',
          width: 'calc(100vw - 250px)',
          position: 'relative',
          zIndex: 1,
        }}
        id="map-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Center the map on selectedCity when selectedCity changes */}
        {selectedCity && cityCoordinates[selectedCity] && (
          <CenterMap
            selectedCity={selectedCity}
            cityCoordinates={cityCoordinates}
          />
        )}

        {/* Conditionally render markers based on the checklist toggle */}
        {showShelters &&
          facilities
            .filter((facility) => facility.tags.amenity === 'shelter')
            .map((facility, index) => (
              <Marker
                key={`api-${index}`}
                position={[facility.lat, facility.lon]}
                icon={pingIconYellow}
              >
                <Popup>
                  {facility.tags.name || 'Unnamed Facility'}
                  <br />
                  {facility.tags.amenity}
                </Popup>
              </Marker>
            ))}

        {showCsvHospitals &&
          csvFacilities.map((facility, index) => (
            <Marker
              key={`csv-${index}`}
              position={[facility.lat, facility.lon]}
              icon={pingIcon}
            >
              <Popup>
                {facility.tags.name || 'Unnamed Facility'}
                <br />
                {facility.tags.amenity}
              </Popup>
            </Marker>
          ))}

        {showUserSites &&
          userSites.map((site, index) => (
            <Marker
              key={`user-${index}`}
              position={[site.location.lat, site.location.lng]}
              icon={pingIconGreen}
            >
              <Popup>
                {site.name || 'Unnamed Facility'}
                <br />
                {site.tags.join(', ')}
              </Popup>
            </Marker>
          ))}

        {position && (
          <Marker position={position} icon={pegman}>
            <Popup>{'Your Location'}</Popup>
          </Marker>
        )}

        {/* Add the RecenterButton */}
        <RecenterButton position={position} />
      </MapContainer>
    </div>
  );
};

const CenterMap = ({ selectedCity, cityCoordinates }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedCity && cityCoordinates[selectedCity]) {
      map.setView(cityCoordinates[selectedCity], 14, { animate: true });
    }
  }, [selectedCity, cityCoordinates, map]);

  return null;
};

// RecenterButton component remains the same
const RecenterButton = ({ position }) => {
  const map = useMap();

  const handleClick = () => {
    if (position) {
      map.setView(position, 14, { animate: true });
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!position}
      style={{
        padding: '10px',
        height: '50px',
        width: '50px',
        marginBottom: '80px',
        borderRadius: '5px',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        cursor: position ? 'pointer' : 'not-allowed',
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
      }}
    >
      <img
        src="/images/nearme.png"
        alt="Center on Me"
        style={{ width: '100%', height: '100%' }}
      />
    </button>
  );
};

export default MapComponent;
