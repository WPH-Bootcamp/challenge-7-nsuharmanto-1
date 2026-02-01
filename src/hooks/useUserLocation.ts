import { useEffect, useState } from "react";

type Location = { latitude: number; longitude: number };

export function useUserLocation() {
  const [location, setLocation] = useState<Location | null>(null);

  // Helper untuk update state dari localStorage
  const updateLocation = () => {
    const lat = localStorage.getItem("user_lat");
    const lng = localStorage.getItem("user_lng");
    if (lat && lng) {
      setLocation({
        latitude: Number(lat),
        longitude: Number(lng),
      });
    } else {
      setLocation(null);
    }
  };

  useEffect(() => {
    updateLocation(); // initial load

    // Listen to storage event (for cross-tab)
    window.addEventListener("storage", updateLocation);
    // Listen to custom event (for same-tab)
    window.addEventListener("user_location_updated", updateLocation);

    return () => {
      window.removeEventListener("storage", updateLocation);
      window.removeEventListener("user_location_updated", updateLocation);
    };
  }, []);

  return location;
}