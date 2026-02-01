import { useMap } from "react-leaflet";
import { useEffect } from "react";

export function MapAutoCenter({ lat, lng }: { lat: number | null; lng: number | null }) {
  const map = useMap();
  useEffect(() => {
    if (lat !== null && lng !== null) {
      map.setView([lat, lng]);
    }
  }, [lat, lng, map]);
  return null;
}