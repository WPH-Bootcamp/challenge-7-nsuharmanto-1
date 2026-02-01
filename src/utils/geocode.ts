export async function geocodeAddress(area: string) {
  const url = `http://localhost:3001/geocode?q=${encodeURIComponent(area)}`;
  const response = await fetch(url);
  const data = await response.json();
  if (Array.isArray(data) && data.length > 0) {
    return { lat: Number(data[0].lat), lng: Number(data[0].lon) };
  }
  return null;
}