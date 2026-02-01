import Header from '../components/Header';
import { useRestaurantsQuery } from '../services/queries/restaurant';
import type { Restaurant } from '../types';
import { useSelector } from 'react-redux';
import type { RootState } from '../features/store';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import RestaurantCard from '../components/RestaurantCard';
import { Button } from "../components/ui/button";
import { useUserLocation } from '@/hooks/useUserLocation';
import { getDistanceFromLatLonInKm } from '@/utils/distances';
import { useState } from 'react';

export default function HomePage() {
  const { isLoggedIn } = useSelector((state: RootState) => state.user);
  const { data: restaurants, isLoading, error } = useRestaurantsQuery(isLoggedIn);
  const navigate = useNavigate();
  const location = useUserLocation();
  const [visibleCount, setVisibleCount] = useState(6);
  const distances: Record<number, number> = {};
  if (
    location &&
    typeof location.latitude === 'number' &&
    typeof location.longitude === 'number' &&
    restaurants
  ) {
    restaurants.forEach((resto: Restaurant) => {
      const lat = resto.coordinates?.lat ?? (resto as { lat?: number }).lat;
      const long = resto.coordinates?.long ?? (resto as { long?: number }).long;
      if (typeof lat === 'number' && typeof long === 'number') {
        distances[resto.id] = getDistanceFromLatLonInKm(
          location.latitude,
          location.longitude,
          lat,
          long
        );
      }
    });
  }

  const categories = [
    { icon: '/icons/all_restaurant.svg', label: 'All Restaurant', path: '/category/all' },
    { icon: '/icons/nearby.svg', label: 'Nearby', path: '/category/nearby' },
    { icon: '/icons/discount.svg', label: 'Discount', path: '/category/discount' },
    { icon: '/icons/best_seller.svg', label: 'Best Seller', path: '/category/best' },
    { icon: '/icons/delivery.svg', label: 'Delivery', path: '/category/delivery' },
    { icon: '/icons/lunch.svg', label: 'Lunch', path: '/category/lunch' },
  ];

  const visibleRestaurants = restaurants?.slice(0, visibleCount) ?? [];
  const allShown = restaurants && visibleCount >= restaurants.length;

  return (
    <div className="relative min-w-0 w-full flex flex-col items-center justify-start overflow-y-auto">
      <Header />
      <div
        className="flex flex-col items-center justify-center w-full relative min-h-[clamp(500px,80vw,827px)] bg-cover bg-no-repeat bg-top px-0 sm:px-0"
        style={{
          backgroundImage: "url('/images/burger_hero.svg')",
          backgroundPosition: 'top',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="flex flex-col items-center justify-center w-full relative z-20 px-[22px] sm:px-0">
          <h1 className="text-white text-center font-extrabold font-sans tracking-tight text-[clamp(2rem,5vw,3rem)] leading-[clamp(2.2rem,6vw,3.3rem)] drop-shadow-lg">
            Explore Culinary Experiences
          </h1>
          <p className="text-white text-center w-auto text-[clamp(1rem,2vw,1.5rem)] font-bold mt-[clamp(0.25rem,1vw,0.5rem)] mb-[clamp(2rem,5vw,2.5rem)] drop-shadow">
            Search and refine your choice to discover the perfect restaurant.
          </p>
          <div className="w-full max-w-[500px] flex items-center bg-white rounded-[2rem] shadow-lg px-[22px] md:px-[clamp(1.5rem,3vw,2rem)] py-[clamp(0.5rem,2vw,1rem)] mt-0">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search restaurants, food and drink"
              className="w-full bg-transparent outline-none border-none ring-0 text-gray-900 text-[clamp(0.9rem,1vw,1rem)] font-normal px-1.5 placeholder-gray-600"
            />
          </div>
        </div>
      </div>
      <div className="w-full bg-white z-30 pt-[clamp(2rem,5vw,3rem)] px-4 md:px-[clamp(1rem,8vw,120px)]">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-x-[clamp(1.5rem,5vw,47px)] gap-y-[clamp(1rem,3vw,2rem)]">
          {categories.map((cat) => (
            <div
              key={cat.label}
              className="flex flex-col items-center justify-center min-w-0 px-0 py-0 bg-transparent cursor-pointer"
              onClick={() => navigate(cat.path)}
              tabIndex={0}
              role="button"
              aria-label={cat.label}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') navigate(cat.path);
              }}
            >
              <div className="flex items-center justify-center w-full h-[100px] bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200">
                <img
                  src={cat.icon}
                  alt={cat.label}
                  className="w-[clamp(2.5rem,6vw,4.0625rem)] h-[clamp(2.5rem,6vw,4.0625rem)] object-contain"
                />
              </div>
              <div className="mt-1 text-[clamp(0.9rem,2vw,1.1rem)] font-bold text-gray-900 text-center">
                {cat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full px-4 md:px-[clamp(1rem,8vw,120px)] py-[clamp(2rem,5vw,3rem)]">
        <div className="flex justify-between items-center w-full">
          <div className="font-extrabold text-lg md:text-xl text-gray-900">
            Recommended
          </div>
          <button
            className="text-primary font-bold text-base hover:underline focus:outline-none"
            onClick={() => navigate('/category/all')}
          >
            See All
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-center">
          {isLoading &&
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-gray-100 animate-pulse rounded-2xl shadow-md p-5 min-h-[152px] w-full"
              />
            ))}
          {error && (
            <div className="col-span-3 text-center text-primary">
              Failed to load restaurant data.
            </div>
          )}
          {visibleRestaurants &&
            visibleRestaurants.length > 0 &&
            visibleRestaurants.map((item: Restaurant) => (
              <RestaurantCard
                key={item.id}
                restaurant={item}
                distance={distances[item.id]}
                isLoggedIn={isLoggedIn}
                onClick={() => {
                  if (isLoggedIn) {
                    navigate(`/restaurant/${item.id}`);
                  }
                }}
              />
            ))}
        </div>
        <div className="flex justify-center mt-[clamp(16px,4vw,32px)] mb-[clamp(48px,8vw,100px)]">
          <Button
            variant="outline"
            className={`px-8 py-2 h-12 rounded-full bg-white border border-gray-300 shadow text-[clamp(1rem,2vw,1.1rem)] font-semibold hover:bg-gray-50 hover:shadow-lg transition-shadow duration-200
              ${allShown ? "text-gray-500 cursor-not-allowed" : "text-gray-950"}
            `}
            onClick={() => setVisibleCount((prev) => prev + 6)}
            disabled={allShown}
          >
            {allShown ? "No more restaurants" : "Show More"}
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}