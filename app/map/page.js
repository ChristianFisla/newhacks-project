'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams to get the query parameters
import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { inter } from '../fonts';

const cityCoordinates = {
    Toronto: [43.65107, -79.347015],
    Vancouver: [49.2827, -123.1207],
    Montreal: [45.5017, -73.5673],
    Calgary: [51.0447, -114.0719],
    Edmonton: [53.5461, -113.4938],
    Ottawa: [45.4215, -75.6972],
    Winnipeg: [49.8951, -97.1384],
    "Quebec City": [46.8139, -71.2082],
    Hamilton: [43.2557, -79.8711],
    Kitchener: [43.4516, -80.4925],
    Victoria: [48.4284, -123.3656],
    Halifax: [44.6488, -63.5752],
    Saskatoon: [52.1332, -106.6700],
    Regina: [50.4452, -104.6189],
    "St. John's": [47.5615, -52.7126],
    Sudbury: [46.4917, -80.993],
    Windsor: [42.3149, -83.0364],
    Charlottetown: [46.2382, -63.1311],
    Fredericton: [45.9636, -66.6431],
    Moncton: [46.0878, -64.7782],
    Kelowna: [49.888, -119.496],
    London: [42.9849, -81.2453],
    Barrie: [44.3894, -79.6903],
};

// Configure the default icon for Leaflet markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

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
    const searchParams = useSearchParams(); // Get the query parameters
    const selectedCity = searchParams.get('city'); // Extract the 'city' parameter

    const defaultCenter = [56.1304, -106.3468]; // Default center of Canada
    const zoomLevel = selectedCity ? 10 : 4;

    useEffect(() => {
        // Cleanup function to reset the map container when the component unmounts
        return () => {
        const mapContainer = document.getElementById('map-container');
        if (mapContainer && mapContainer._leaflet_id) {
            delete mapContainer._leaflet_id;
        }
        };
    }, [selectedCity]);

    return (
        <>
            <header className="w-full p-4 bg-white shadow-md flex justify-between items-center">
                <div className={`${inter.className} text-xl font-bold`}>
                    reliefmap.ca
                </div>
            </header>

            <MapContainer
            id="map-container"
            key={selectedCity || 'default'} // Force remount on city change
            center={selectedCity ? cityCoordinates[selectedCity] : defaultCenter}
            zoom={zoomLevel}
            scrollWheelZoom={true}
            style={{ height: '100vh', width: '100vw', position: 'relative', zIndex: 1 }} // Ensure the height and width are set
            >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {selectedCity && (
                <>
                <Marker position={cityCoordinates[selectedCity]}>
                    <Popup>{selectedCity}</Popup>
                </Marker>
                <CenterMap selectedCity={selectedCity} />
                </>
            )}

            {/* Render markers for all cities */}
            {Object.entries(cityCoordinates).map(([city, coords]) => (
                <Marker key={city} position={coords}>
                <Popup>{city}</Popup>
                </Marker>
            ))}
            </MapContainer>
        </>
    );
};

export default Page;
