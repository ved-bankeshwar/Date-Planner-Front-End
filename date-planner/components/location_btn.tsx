// components/LocationButton.tsx

'use client';
import { useState } from 'react';

export default function LocationButton() {
  const [location, setLocation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(`Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`);
        setError(null);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setError("Permission denied. Please allow location access.");
        } else {
          setError("Failed to retrieve location.");
        }
      }
    );
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 text-center">
      <h2 className="text-xl font-semibold">Location Access</h2>
      <button
        onClick={handleGetLocation}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Get My Location
      </button>
      {location && <p className="text-green-700 font-medium">{location}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
