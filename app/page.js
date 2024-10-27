'use client'; // Ensures client-side rendering

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { inter } from './fonts';

import { v4 as uuidv4 } from 'uuid';

import { addSiteFirestore } from '@/firebase/firestore';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import Image from 'next/image';
import { loadCanadianCityNames } from '@/utils/loadCanadianCityNames';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Import Leaflet components
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

const pingIcon = new L.Icon({
  iconUrl: '/images/ping.png',
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
});

// Fix Leaflet's default icon issue with Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

const defaultTags = ['Food', 'Water', 'Medical Aid', 'Shelter']; // Define default tags

const Page = () => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [regOpen, setRegOpen] = useState(false);

  const [nameNewSite, setNameNewSite] = useState('');
  const [tagsNewSite, setTagsNewSite] = useState([]); // Initialize as an empty array
  const [position, setPosition] = useState(null); // Initialize position state

  const [canadianCities, setCanadianCities] = useState([])

  useEffect(() => {
    const fetchCities = async () => {
      const cities = await loadCanadianCityNames();
      setCanadianCities(cities);
    };
    fetchCities();
  }, []);

  const handleSearch = (city) => {
    router.push(`/map?city=${encodeURIComponent(city)}`); // Encode the city to handle special characters
  };

  const openSearch = () => {
    setOpen(true);
  };

  const addReliefSite = () => {
    console.log(nameNewSite, tagsNewSite, position); // Logs the name, tags, and position

    addSiteFirestore({
      id: uuidv4(),
      name: nameNewSite,
      tags: tagsNewSite,
      location: position ? { lat: position.lat, lng: position.lng } : null,
    }); // Add the new site to Firestore

    setRegOpen(false);
    setNameNewSite(''); // Reset the name input
    setTagsNewSite([]);
    setPosition(null); // Reset the position
  };

  // Component for picking location
  const LocationMarker = ({ position, setPosition }) => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
      },
    });

    return position === null ? null : (
      <Marker position={position} icon={pingIcon}></Marker>
    );
  };

  return (
    <>
      <div className="w-full h-screen overflow-hidden relative">
        <header className="w-full p-4 h-20 bg-white shadow-lg flex items-center z-30 fixed top-0 left-0">
          <a
            href="/"
            className={`${inter.className} text-xl font-bold ml-6 flex items-center space-x-2`}
          >
            <Image
              src="/images/ping.png"
              alt="A description of the image"
              width={18}
              height={18}
              priority
            />
            <span>reliefmap.ca</span>
          </a>
          <div className="ml-auto mr-8">
            <Dialog
              className={`${inter.className} ml-auto`}
              open={regOpen}
              onOpenChange={(isOpen) => {
                setRegOpen(isOpen);
                if (!isOpen) {
                  setNameNewSite(''); // Reset the name input
                  setTagsNewSite([]); // Reset the tags array
                  setPosition(null); // Reset the position
                }
              }}
            >
              <DialogTrigger asChild>
                <Button variant="outline" className={`${inter.className}`}>
                  Register New Relief Site
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] mx-auto">
                <DialogHeader>
                  <DialogTitle className="font-black text-xl">
                    Add a Disaster Relief Site
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                  {/* Name Input */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter the name of the relief site"
                      className="col-span-3"
                      value={nameNewSite}
                      onChange={(e) => setNameNewSite(e.target.value)}
                    />
                  </div>
                  {/* Tags Selection */}
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="tags" className="text-right mt-2">
                      Tags
                    </Label>
                    <div className="col-span-3">
                      {defaultTags.map((tag) => (
                        <div key={tag} className="flex items-center mb-2">
                          <Checkbox
                            id={`tag-${tag}`}
                            checked={tagsNewSite.includes(tag)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setTagsNewSite([...tagsNewSite, tag]);
                              } else {
                                setTagsNewSite(tagsNewSite.filter((t) => t !== tag));
                              }
                            }}
                          />
                          <label htmlFor={`tag-${tag}`} className="ml-2 text-gray-700">
                            {tag}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="location" className="text-right mt-2">
                      Location
                    </Label>
                    <div className="col-span-3">
                      <div className="h-60 w-full border-2 border-gray-300 rounded">
                        <MapContainer
                          center={[56.1304, -106.3468]}
                          zoom={4}
                          scrollWheelZoom={true}
                          style={{ height: '100%', width: '100%' }}
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <LocationMarker position={position} setPosition={setPosition} />
                        </MapContainer>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Click on the map to set the location of the relief site.
                      </p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={addReliefSite}>
                    Register
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>
        <div className="relative w-full h-screen z-10">
          <Image
            src="/images/landingphoto.jpg"
            alt="A description of the image"
            fill
            style={{ objectFit: 'cover' }}
            priority
            className="z-0" // Ensure the image is behind everything else
          />
          <div className="absolute inset-0 bg-black bg-opacity-70 z-10"></div>
        </div>

        <div className="absolute inset-0 flex flex-col justify-center items-center z-20">
          <h
            className={`${inter.className} text-6xl font-bold text-white hover:cursor-pointer`}
            onClick={openSearch}
          >
            Find Relief Resources Near You
          </h>
        </div>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <VisuallyHidden>
            <DialogTitle>Search for Canadian Cities</DialogTitle>
            <DialogDescription>
              Search for a Canadian city to find relief resources near you.
            </DialogDescription>
          </VisuallyHidden>
          <CommandInput placeholder="Where are you located?" />
          <CommandList>
            <CommandGroup heading="Suggestions">
              {canadianCities.map((city) => (
                <CommandItem
                  key={city}
                  value={city}
                  onSelect={() => handleSearch(city)}
                  className="cursor-pointer hover:bg-gray-200 p-2"
                >
                  {city}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandEmpty>No results found.</CommandEmpty>
          </CommandList>
        </CommandDialog>
      </div>
    </>
  );
};

export default Page;