'use client';

import app from '@/firebase/firebase-config';
import { fetchFacilities } from '@/utils/fetchFacilities';
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

// Define the path for the custom icons
const pingIcon = new L.Icon({
  iconUrl: '/images/ping.png',
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
  iconUrl: '/images/pinggreen.png',
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
});

// Coordinates for Canadian cities
const cityCoordinates = {
    Toronto: [43.65107, -79.347015],
    Montreal: [45.5017, -73.5673],
    Vancouver: [49.2827, -123.1207],
    Calgary: [51.0447, -114.0719],
    Edmonton: [53.5461, -113.4938],
    Ottawa: [45.4215, -75.6972],
    Winnipeg: [49.8951, -97.1384],
    Quebec: [46.8139, -71.2082],
    Hamilton: [43.2557, -79.8711],
    Kitchener: [43.4516, -80.4925],
    London: [42.9849, -81.2453],
    Victoria: [48.4284, -123.3656],
    Halifax: [44.6488, -63.5752],
    Oshawa: [43.8971, -78.8658],
    Windsor: [42.3149, -83.0364],
    Saskatoon: [52.1332, -106.6700],
    StJohns: [47.5615, -52.7126],
    Regina: [50.4452, -104.6189],
    Sherbrooke: [45.4042, -71.8824],
    Barrie: [44.3894, -79.6903],
    Kelowna: [49.8880, -119.4960],
    Abbotsford: [49.0504, -122.3045],
    Kingston: [44.2312, -76.4860],
    Kanata: [45.3080, -75.8980],
    TroisRivieres: [46.3452, -72.5477],
    Guelph: [43.5448, -80.2482],
    Moncton: [46.0878, -64.7782],
    ThunderBay: [48.3809, -89.2477],
    StCatharines: [43.1594, -79.2469],
    Milton: [43.5183, -79.8774],
    StAlbert: [53.6305, -113.6256],
    Kamloops: [50.6745, -120.3273],
    RedDeer: [52.2681, -113.8112],
    Brantford: [43.1394, -80.2644],
    WhiteRock: [49.0266, -122.8026],
    MapleRidge: [49.2192, -122.6019],
    Lethbridge: [49.6935, -112.8418],
    Peterborough: [44.3091, -78.3197],
    Sarnia: [42.9784, -82.4041],
    Drummondville: [45.8833, -72.4833],
    PrinceGeorge: [53.9171, -122.7497],
    SaultSteMarie: [46.5219, -84.3461],
    Nanaimo: [49.1659, -123.9401],
    SaintJohn: [45.2739, -66.0628],
    Chilliwack: [49.1579, -121.9515],
    NorthBay: [46.3091, -79.4608],
    GrandePrairie: [55.1707, -118.7947],
    Welland: [42.9863, -79.2483],
    MedicineHat: [50.0405, -110.6764],
    Fredericton: [45.9636, -66.6431],
    Belleville: [44.1628, -77.3832],
    Airdrie: [51.2917, -114.0144],
    StThomas: [42.7774, -81.1820],
    PrinceAlbert: [53.2033, -105.7531],
    Granby: [45.3976, -72.7228],
    SorelTracy: [46.0409, -73.1211],
    NorthVancouver: [49.3168, -123.0728],
    Blainville: [45.6745, -73.8822],
    MooseJaw: [50.3929, -105.5511],
    Stratford: [43.3700, -80.9811],
    FortMcMurray: [56.7268, -111.3790],
    Cornwall: [45.0273, -74.7411],
    Brockville: [44.5895, -75.6843],
    Penticton: [49.4991, -119.5937],
    Orillia: [44.6082, -79.4190],
    LaSalle: [42.2418, -83.0737],
    Mirabel: [45.6501, -74.0753],
    WestVancouver: [49.3289, -123.1590],
    Mission: [49.1325, -122.3115],
    PrinceRupert: [54.3154, -130.3203],
    Courtenay: [49.6841, -124.9904],
    Midland: [44.7495, -79.8839],
    CampbellRiver: [50.0331, -125.2733],
    PortAlberni: [49.2338, -124.8052],
    MooseCreek: [45.2858, -74.9628],
    Summerside: [46.3934, -63.7902],
    Yellowknife: [62.4540, -114.3718],
    Iqaluit: [63.7467, -68.5160],
    Timmins: [48.4758, -81.3305],
    Leamington: [42.0531, -82.5935],
    Parksville: [49.3191, -124.3136],
    Bathurst: [47.6187, -65.6513],
    Cobourg: [43.9591, -78.1657],
    Selkirk: [50.1430, -96.8830],
    Terrace: [54.5182, -128.6034],
    Kenora: [49.7670, -94.4893],
    DawsonCreek: [55.7606, -120.2358],
    HappyValleyGooseBay: [53.3027, -60.3257],
    FortStJohn: [56.2528, -120.8467],
    RouynNoranda: [48.2321, -79.0177],
    Cranbrook: [49.5120, -115.7694],
    PowellRiver: [49.8355, -124.5240],
    PortageLaPrairie: [49.9727, -98.2928],
    ColdLake: [54.4641, -110.1821],
    Camrose: [53.0222, -112.8209],
    Whitehorse: [60.7212, -135.0568],
    Thompson: [55.7436, -97.8558],
    Markham: [43.8561, -79.3370],
  };
  

// Adjusted CenterMap component to center on selectedCity
const CenterMap = ({ selectedCity }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedCity && cityCoordinates[selectedCity]) {
      map.setView(cityCoordinates[selectedCity], 14, { animate: true });
    }
  }, [selectedCity, map]);

  return null;
};

// New RecenterButton component
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

const MapComponent = ({ selectedCity }) => {
  const [facilities, setFacilities] = useState([]);
  const [csvFacilities, setCsvFacilities] = useState([]);
  const [position, setPosition] = useState(null);

  const [userSites, setUserSites] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'sites'), // Replace 'relief_sites' with the correct collection name
      (snapshot) => {
        const sites = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log('Real-time Sites:', sites);
        setUserSites(sites); // Update state with real-time data
      }
    );

    return () => unsubscribe(); // Unsubscribe from updates when the component unmounts
  }, []);

  console.log('User Sites:', userSites);

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
          ); // Ensure coordinates are valid numbers
        console.log('CSV data:', parsedCsvFacilities);
        setCsvFacilities(parsedCsvFacilities);
      })
      .catch((error) => {
        console.error('Error loading CSV:', error);
      });
  }, [selectedCity]);

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
      </div>

      {/* Map Component */}
      <MapContainer
        center={selectedCity ? cityCoordinates[selectedCity] : defaultCenter}
        zoom={selectedCity ? 14 : defaultZoomLevel}
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
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Center the map on selectedCity when selectedCity changes */}
        {selectedCity && <CenterMap selectedCity={selectedCity} />}

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
        {userSites.length > 0 ? (
          userSites.map((site, index) => (
            <Marker
              key={`user-${index}`}
              position={site.location}
              icon={pingIcon}
            >
              <Popup>
                {site.name || 'Unnamed Facility'}
                <br />
                {site.tags.join(', ')}
              </Popup>
            </Marker>
            ))
        ) : (
          console.log('No user sites found')
        )}
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

export default MapComponent;