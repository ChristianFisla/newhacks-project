'use client'; // Ensures client-side rendering

import { useState } from 'react';
import { inter } from './fonts';

import { useRouter } from 'next/navigation';

import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'; // Import DialogTitle from Radix
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'; // Import VisuallyHidden from Radix

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";


const canadianCities = [
  "Toronto", "Vancouver", "Montreal", "Calgary", "Edmonton", "Ottawa",
  "Winnipeg", "Quebec City", "Hamilton", "Kitchener", "Victoria",
  "Halifax", "Saskatoon", "Regina", "St. John's", "Sudbury", "Windsor",
  "Charlottetown", "Fredericton", "Moncton", "Kelowna", "London", "Barrie",
];

const Page = () => {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const handleSearch = city => {
    router.push(`/map?city=${encodeURIComponent(city)}`); // Encode the city to handle special characters
  }

  const openSearch = () => {
    setOpen(true);
  }

  return (
    <>
      <div className="w-full h-screen overflow-hidden relative">
        <header className="w-full p-4 h-20 bg-white shadow-lg flex items-center z-30 fixed top-0 left-0">
          <a href='/' className={`${inter.className} text-xl font-bold ml-6 flex items-center space-x-2`}>
            <Image
              src="/images/ping.png" // Path to your PNG file in the public folder
              alt="A description of the image"
              width={18} // Desired width
              height={18} // Desired height
              priority // Optional: Prioritizes image loading
            />
            <span>reliefmap.ca</span>
          </a>
          <Button variant="secondary" className={`${inter.className} font-semibold mr-10 ml-auto`}>
            Register Relief Site
          </Button>
        </header>

        <div className="relative w-full h-screen z-10">
          <Image
            src="/images/landingphoto.jpg" // Path to your PNG file in the public folder
            alt="A description of the image"
            fill // Makes the image fill the parent container
            style={{ objectFit: 'cover' }} // Updated to Next.js 13+ image style
            priority // Optional: Prioritizes image loading
            className='z-0' // Ensure the image is behind everything else
          />
        </div>

        <div className="absolute inset-0 flex flex-col justify-center items-center z-10">
          <div className="bg-black bg-opacity-50 px-6 py-4 rounded-lg">
            <h className={`${inter.className} text-5xl font-bold text-white hover:cursor-pointer`} onClick={openSearch}>
              Find Relief Resources Near You
            </h>
          </div>
        </div>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <VisuallyHidden>
            <DialogTitle>Search for Canadian Cities</DialogTitle>
            <DialogDescription>
              Search for a Canadian city to find relief resources near you.
            </DialogDescription>
          </VisuallyHidden>
          <CommandInput
            placeholder="Where are you located?"
            />
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