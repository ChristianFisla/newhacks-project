'use client'; // Ensures client-side rendering

import { useState } from 'react';
import { inter } from './fonts';

import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'; // Import DialogTitle from Radix
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'; // Import VisuallyHidden from Radix

import Image from 'next/image';

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
      <header className="w-full p-4 h-20 bg-white shadow-md flex items-center">
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
      </header>

      <div className="relative h-screen flex flex-col justify-center items-center">

        <div className="text-center justify-centre">
          <h className={`${inter.className} text-5xl font-medium`}>
            Find relief near you:
            <CommandDialog open={open} onOpenChange={setOpen}>
              <VisuallyHidden>
                <DialogTitle>Search for Canadian Cities</DialogTitle>
                <DialogDescription>
                  Search for a Canadian city to find relief resources near you.
                </DialogDescription>
              </VisuallyHidden>
              <CommandInput
                placeholder="Type a command or search..."
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
          </h>
          <Button onClick={openSearch}>Search</Button>
        </div>
      </div>
    </>

  );
};

export default Page;
