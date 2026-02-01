import { useUserLocation } from '@/hooks/useUserLocation';
import { useEffect, useState } from 'react';
import { getDistanceFromLatLonInKm } from '@/utils/distances';
import RestaurantCard from '@/components/RestaurantCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Restaurant } from '@/types';
import { useState as useReactState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../features/store';
import { useNavigate } from 'react-router-dom';

type CategoryPageProps = {
  restaurants: Restaurant[];
};

const DISTANCE_OPTIONS = [
  { label: "Nearby", value: "nearby", defaultChecked: true },
  { label: "Within 1 km", value: "1km" },
  { label: "Within 3 km", value: "3km" },
  { label: "Within 5 km", value: "5km" },
];

function formatRupiah(num: number | ''): string {
  if (num === '' || isNaN(Number(num))) return '';
  return Number(num).toLocaleString('id-ID');
}
function parseRupiah(str: string): number | '' {
  const cleaned = str.replace(/[^\d]/g, '');
  return cleaned === '' ? '' : Number(cleaned);
}

function getDistanceLimit(value: string) {
  if (value === "1km") return 1;
  if (value === "3km") return 3;
  if (value === "5km") return 5;
  return null;
}

export default function CategoryPage({ restaurants }: CategoryPageProps) {
  const location = useUserLocation();
  const [distances, setDistances] = useState<Record<number, number>>({});
  const [showMobileFilter, setShowMobileFilter] = useReactState(false);
  const [distanceFilter, setDistanceFilter] = useState("nearby");
  const [ratingFilter, setRatingFilter] = useState<number[]>([]);
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const { isLoggedIn } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const hasLocation =
    location &&
    typeof location.latitude === 'number' &&
    typeof location.longitude === 'number';

  useEffect(() => {
    if (!hasLocation) return;

    const userLat = location.latitude;
    const userLng = location.longitude;

    const newDistances: Record<number, number> = {};
    restaurants.forEach((resto) => {
      const lat = resto.coordinates?.lat ?? (resto as { lat?: number }).lat;
      const long = resto.coordinates?.long ?? (resto as { long?: number }).long;
      if (
        typeof lat === 'number' &&
        typeof long === 'number'
      ) {
        newDistances[resto.id] = getDistanceFromLatLonInKm(
          userLat,
          userLng,
          lat,
          long
        );
      }
    });
    setDistances(newDistances);
  }, [hasLocation, location, restaurants]);

  const filteredRestaurants = restaurants.filter((resto) => {
    if (hasLocation) {
      const dist = distances[resto.id];
      const limit = getDistanceLimit(distanceFilter);
      if (limit !== null && !(typeof dist === "number" && dist <= limit)) {
        return false;
      }
    }
    if (minPrice !== '' && resto.priceRange.min < minPrice) {
      return false;
    }
    if (maxPrice !== '' && resto.priceRange.max > maxPrice) {
      return false;
    }
    if (ratingFilter.length > 0) {
      const star = resto.star ?? 0;
      if (ratingFilter.length === 1) {
        if (star !== ratingFilter[0]) {
          return false;
        }
      } else {
        const minRating = Math.min(...ratingFilter);
        const maxRating = Math.max(...ratingFilter);
        if (star < minRating || star > maxRating) {
          return false;
        }
      }
    }
    return true;
  });

  if (!restaurants || restaurants.length === 0) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#fafafa]">
        <span className="text-gray-600 text-lg">No restaurants found.</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <Header solid/>
      <main className="flex-1 w-full flex flex-col pt-[120px] px-4 md:px-[clamp(32px,8vw,120px)] bbg-[#fafafa] transition-all pb-[100px]">
        <div className="flex items-center justify-between mb-4 md:mb-8">
          <h1 className="font-extrabold text-2xl md:text-3xl text-gray-900">
            All Restaurant
          </h1>
          <button
            className="md:hidden flex items-center gap-2 px-3 py-2"
            onClick={() => setShowMobileFilter(true)}
          >
            <img
              src="/icons/filter-lines.svg"
              alt="Filter"
              width={20}
              height={20}
              className="inline-block"
            />
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <aside
            className={`
              bg-white rounded-2xl shadow-md p-4 mb-2 md:mb-0
              w-full md:w-[266px] md:sticky md:top-28
              ${showMobileFilter ? 'fixed z-50 left-0 top-0 w-full h-full md:static md:w-[266px]' : 'hidden md:block'}
            `}
            style={{
              maxWidth: showMobileFilter ? '90vw' : undefined,
              minHeight: showMobileFilter ? '100vh' : undefined,
            }}
          >
            <div className="flex justify-between items-center mb-3 md:mb-0">
              <div className="font-extrabold text-md text-gray-950 md:mb-3">FILTER</div>
              {showMobileFilter && (
                <button
                  className="md:hidden text-2xl text-gray-500"
                  onClick={() => setShowMobileFilter(false)}
                  aria-label="Close filter"
                >
                  ×
                </button>
              )}
            </div>
            <div className="mb-4">
              <div className="font-extrabold text-lg  text-gray-950 mb-[10px]">Distance</div>
              <div className="flex flex-col gap-1">
                {DISTANCE_OPTIONS.map((item) => {
                  const isDisabled = !hasLocation && item.value !== "nearby";
                  return (
                    <label
                      key={item.value}
                      className={`group flex items-center gap-2 text-base mb-[10px] cursor-pointer relative ${
                        isDisabled ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="distance"
                        checked={distanceFilter === item.value}
                        onChange={() => {
                          if (!isDisabled) setDistanceFilter(item.value);
                        }}
                        value={item.value}
                        className="peer opacity-0 absolute w-5 h-5"
                        disabled={isDisabled}
                      />
                      <span className="
                        w-5 h-5 rounded-[6px] border border-gray-400 bg-white flex items-center justify-center
                        transition-all
                        peer-checked:bg-red-600 peer-checked:border-red-600
                        relative
                      ">
                        <svg
                          className={`w-5 h-5 absolute inset-0 m-auto pointer-events-none ${
                            distanceFilter === item.value ? "opacity-100" : "opacity-0"
                          }`}
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <polyline
                            points="5 11 9 15 15 7"
                            stroke="white"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      {item.label}
                      {isDisabled && (
                        <div
                          className="absolute left-1/2 -translate-x-1/2 -top-7 z-10
                            pointer-events-none
                            opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100
                            transition-all duration-200 ease-in-out
                            px-3 py-1 rounded bg-gray-700 text-white text-text-sm font-semibold
                            truncate max-w-[230px] shadow-lg"
                        >
                          Login & set address to enable
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>
            <div className="border-b border-gray-300 mt-3 mb-3 md:mt-3 md:mb-3" />
            </div>
            <div className="mb-4">
              <div className="font-extrabold text-lg  text-gray-950 mb-[10px]">Price</div>
              <div className="flex flex-col gap-[10px]">
                <div className="relative flex items-center">
                  <span
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-[38px] h-[38px] flex items-center justify-center rounded bg-gray-200 text-gray-950 font-semibold text-base"
                    style={{ padding: 0 }}
                  >
                    Rp
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Minimum Price"
                    className="w-full border border-gray-300 rounded pl-[54px] pr-2 py-1 h-12 text-gray-500 text-sm font-normal"
                    value={minPrice === '' ? '' : formatRupiah(minPrice)}
                    onChange={e => setMinPrice(parseRupiah(e.target.value))}
                  />
                </div>
                <div className="relative flex items-center">
                  <span
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-[38px] h-[38px] flex items-center justify-center rounded bg-gray-200 text-gray-950 font-semibold text-base"
                    style={{ padding: 0 }}
                  >
                    Rp
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Maximum Price"
                    className="w-full border border-gray-300 rounded pl-[54px] pr-2 py-1 h-12 text-gray-500 text-sm font-normal"
                    value={maxPrice === '' ? '' : formatRupiah(maxPrice)}
                    onChange={e => setMaxPrice(parseRupiah(e.target.value))}
                  />
                </div>
              </div>
            <div className="border-b border-gray-300 mt-3 mb-3 md:mt-3 md:mb-3" />
            </div>
            <div>
              <div className="font-extrabold text-lg  text-gray-950 mb-[10px]">Rating</div>
              {[5, 4, 3, 2, 1].map(star => (
                <label key={star} className="flex items-center px-2 gap-1 text-base mb-[16px] cursor-pointer relative group">
                  <span className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={ratingFilter.includes(star)}
                      onChange={() => {
                        setRatingFilter((prev) =>
                          prev.includes(star)
                            ? prev.filter((s) => s !== star)
                            : [...prev, star]
                        );
                      }}
                      className="peer appearance-none w-5 h-5 rounded-[6px] border border-gray-400 bg-white
                        transition-all cursor-pointer
                        checked:bg-red-600 checked:border-red-600
                        "
                    />
                    <svg
                      className="absolute left-0 top-0 w-5 h-5 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline
                        points="5 11 9 15 15 7"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <img src="/icons/star.svg" alt={`${star} star`} className="w-6 h-6" />
                  <span>{star}</span>
                </label>
              ))}
            </div>
          </aside>
          {showMobileFilter && (
            <div
              className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
              onClick={() => setShowMobileFilter(false)}
            />
          )}
          <section className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRestaurants.length === 0 ? (
                <div className="col-span-full text-center text-lg text-gray-600 py-10">
                  {(() => {
                    const isDistanceFiltered = distanceFilter !== "nearby";
                    const isRatingFiltered = ratingFilter.length > 0;
                    const isPriceFiltered = minPrice !== '' || maxPrice !== '';
                    if (isDistanceFiltered && isRatingFiltered && isPriceFiltered) {
                      return "No restaurants found for this distance, rating, and price.";
                    }
                    if (isDistanceFiltered && isRatingFiltered) {
                      return "No restaurants found for this distance and rating.";
                    }
                    if (isDistanceFiltered && isPriceFiltered) {
                      return "No restaurants found for this distance and price.";
                    }
                    if (isRatingFiltered && isPriceFiltered) {
                      return "No restaurants found for this rating and price.";
                    }
                    if (isDistanceFiltered) {
                      return "No restaurants found for this distance.";
                    }
                    if (isRatingFiltered) {
                      return "No restaurants found for this rating.";
                    }
                    if (isPriceFiltered) {
                      return "No restaurants found for this price.";
                    }
                  })()}
                </div>
              ) : (
                filteredRestaurants.map((resto) => (
                  <RestaurantCard
                    key={resto.id}
                    restaurant={resto}
                    distance={distances[resto.id]}
                    isLoggedIn={isLoggedIn}
                    onClick={() => {
                      if (isLoggedIn) {
                        navigate(`/restaurant/${resto.id}`);
                      }
                    }}
                  />
                ))
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}