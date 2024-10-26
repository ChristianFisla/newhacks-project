'use client'; // Ensures client-side rendering

import { useState } from 'react';
import { inter } from './fonts';

import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'; // Import DialogTitle from Radix
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'; // Import VisuallyHidden from Radix

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
    <div className="relative h-screen flex flex-col items-center justify-center">

      <div className={`${inter.className} absolute top-5 left-5 font-bold text-lg z-50`}>
        <a href="/" className="text-black">reliefmap.ca</a>
      </div>
      <Button onClick={openSearch}>Search</Button>

      <div className="text-center">
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
      </div>
    </div>
  );
};

export default Page;
