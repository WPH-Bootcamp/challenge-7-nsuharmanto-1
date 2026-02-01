import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { geocodeAddress } from "@/utils/geocode";
import { MapAutoCenter } from "@/components/MapAutoCenter";
import Header from "../components/Header";
import Footer from "../components/Footer";

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const url = `http://localhost:3001/reverse?lat=${lat}&lon=${lng}`;
  const response = await fetch(url);
  const data = await response.json();
  const suburb = data.address?.suburb || data.address?.district || "";
  const city = data.address?.city || data.address?.town || data.address?.village || "";
  const state = data.address?.state || "";
  let result = "";
  if (suburb) result += suburb;
  if (city) result += (result ? ", " : "") + city;
  if (state) result += (result ? ", " : "") + state;
  return result || "";
}

export default function AddressPage() {
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const savedAddress = localStorage.getItem("user_address");
    const savedArea = localStorage.getItem("user_area");
    const savedLat = localStorage.getItem("user_lat");
    const savedLng = localStorage.getItem("user_lng");
    if (savedAddress) setAddress(savedAddress);
    if (savedArea) setArea(savedArea);
    if (savedLat) setLat(Number(savedLat));
    if (savedLng) setLng(Number(savedLng));
  }, []);

  const handleGeocodeArea = async () => {
    if (!area) return;
    setLoadingGeo(true);
    const result = await geocodeAddress(area);
    setLoadingGeo(false);
    if (result) {
      setLat(result.lat);
      setLng(result.lng);
      toast({
        title: "Success",
        description: "Area coordinates found!",
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: "Area/city not found! Try entering district and city name only.",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    if (lat !== null && lng !== null && address && area) {
      localStorage.setItem("user_address", address);
      localStorage.setItem("user_area", area);
      localStorage.setItem("user_lat", lat.toString());
      localStorage.setItem("user_lng", lng.toString());
      
      window.dispatchEvent(new Event("user_location_updated"));

      toast({
        title: "Success",
        description: "Delivery address & area saved (local only)!",
        variant: "default",
      });
      navigate("/profile");
    } else {
      toast({
        title: "Error",
        description: "Please complete the full address and area/city first.",
        variant: "destructive",
      });
    }
  };

  const handleClearAddress = () => setAddress("");
  const handleClearArea = () => {
    setArea("");
    setLat(null);
    setLng(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <Header solid />
      <main className="flex-1 w-full flex flex-col items-center px-4 md:px-[clamp(1rem,8vw,120px)] py-[clamp(1.5rem,4vw,3rem)] md:py-[clamp(2.5rem,6vw,4rem)] bg-[#fafafa] transition-all">
      <section className="w-full bg-white rounded-2xl shadow-[0_4px_24px_0_rgba(0,0,0,0.06)] p-6 flex flex-col md:flex-row gap-8 mt-[48px] mb-[48px] items-stretch min-h-[400px]">
          {/* Left: Form */}
          <div className="w-full md:w-1/2 flex flex-col">
            <h2 className="font-extrabold text-2xl md:text-3xl text-gray-900 mb-6">
              Set Delivery Address
            </h2>
            <label className="block mb-1 font-bold">Full Address (for delivery)</label>
            <div className="relative mb-4 w-full">
              <input
                className="w-full border rounded-xl p-2 pr-8 shadow focus:ring-1 focus:shadow-md focus:ring-gray-500 focus:outline-none"
                placeholder="e.g. Jl. Dr. Muwardi I No. 536, Grogol, Jakarta Barat"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
              {address && (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={handleClearAddress}
                  aria-label="Clear address"
                >
                  ×
                </button>
              )}
            </div>
            <label className="block mb-1 font-bold">Area/District & City (for distance calculation)</label>
            <div className="relative mb-2 w-full">
              <input
                className="w-full border rounded-xl p-2 pr-8 shadow focus:ring-1 focus:shadow-md focus:ring-gray-500 focus:outline-none"
                placeholder="e.g. Grogol, Jakarta Barat"
                value={area}
                onChange={e => setArea(e.target.value)}
              />
              {area && (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={handleClearArea}
                  aria-label="Clear area"
                >
                  ×
                </button>
              )}
            </div>
            <button
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-full font-semibold text-base hover:bg-blue-900 transition w-full"
              onClick={handleGeocodeArea}
              disabled={!area || loadingGeo}
            >
              {loadingGeo ? "Loading..." : "Find Area Coordinates"}
            </button>
            <div className="flex gap-2 mt-2 w-full">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-full font-semibold text-base w-1/2 hover:bg-gray-600 hover:text-gray-100 transition"
                onClick={() => navigate("/profile")}
                type="button"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded-full font-semibold text-base w-1/2 hover:bg-red-800 transition"
                onClick={handleSave}
                disabled={!address || !area || lat === null || lng === null}
                type="button"
              >
                Save Address
              </button>
            </div>
            <div className="mt-4 text-gray-500 text-sm w-full">
              <ul className="list-disc ml-5">
                <li>The full address is used for delivery.</li>
                <li>Area/district & city are used to calculate the distance to the restaurant.</li>
                <li>The area/city will be auto-filled if you move the marker on the map.</li>
                <li>If the area is not found, try entering only the district and city name.</li>
              </ul>
            </div>
          </div>
          {/* Right: Map */}
           <div className="w-full md:w-1/2 flex">
            <div className="w-full h-[340px] md:h-full border-2 border-blue-300 rounded-2xl">
              <MapContainer
                center={lat && lng ? [lat, lng] : [-6.2, 106.8]}
                zoom={13}
                style={{ height: "100%", width: "100%", borderRadius: "16px", overflow: "hidden" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {lat !== null && lng !== null && (
                  <>
                    <Marker
                      position={[lat, lng]}
                      draggable={true}
                      eventHandlers={{
                        dragend: async (e) => {
                          const marker = e.target;
                          const position = marker.getLatLng();
                          setLat(position.lat);
                          setLng(position.lng);
                          const areaName = await reverseGeocode(position.lat, position.lng);
                          if (areaName) setArea(areaName);
                        },
                      }}
                    />
                    <MapAutoCenter lat={lat} lng={lng} />
                  </>
                )}
              </MapContainer>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}