// app/map/MapPageClient.js

'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { inter } from '../fonts';
import Image from 'next/image';

const DynamicMapComponent = dynamic(() => import('./mapComponent'), {
  ssr: false,
});

const MapPageClient = () => {
  const searchParams = useSearchParams();
  const selectedCity = searchParams.get('city');

  return (
    <>
      <header className="w-full p-4 bg-white shadow-lg relative flex h-20 items-center z-50">
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
      </header>

      <DynamicMapComponent selectedCity={selectedCity} />
    </>
  );
};

export default MapPageClient;
