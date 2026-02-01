import type { Restaurant } from '../types';
import { Card } from './ui/card';

type Props = {
  restaurant: Restaurant;
  distance?: number | null;
  isLoggedIn: boolean;
  onClick?: () => void;
};

export default function RestaurantCard({ restaurant, distance, isLoggedIn, onClick }: Props) {
  return (
    <Card
      className={`bg-white rounded-2xl shadow-md p-5 flex flex-col gap-2 border border-gray-100 hover:shadow-xl transition-all w-full min-h-[152px] ${
        isLoggedIn ? 'cursor-pointer' : 'cursor-not-allowed'
      }`}
      onClick={onClick}
      style={!isLoggedIn ? { pointerEvents: 'auto' } : {}}
    >
      <div className="flex items-center gap-3 h-full">
        <img
          src={restaurant.logo || '/logos/foody_logo.svg'}
          alt={restaurant.name || 'Restaurant Logo'}
          className="h-[120px] w-[120px] object-cover rounded-xl"
        />
        <div className="flex-1">
          <div className="font-extrabold text-[clamp(1.125rem,1.5vw,1.25rem)] text-gray-900 leading-tight">
            {restaurant.name}
          </div>
          <div className="flex items-center gap-2 text-md text-gray-950">
            <span className="flex items-center gap-1 text-gray-950 font-medium">
              <img
                src="/icons/star.svg"
                alt="star"
                className="w-6 h-6 object-contain"
                style={{ width: 24, height: 24 }}
              />
              {restaurant.star ?? '-'}
            </span>
          </div>
          <div className="text-md text-gray-950 mt-1">
            {restaurant.place ?? '-'} <span className="mx-1">·</span>
            {isLoggedIn
              ? (
                  typeof distance === 'number'
                    ? `${distance.toFixed(1)} km`
                    : <span className="text-gray-400 text-text-md italic">Set address to see distance</span>
                )
              : <span className="text-gray-400">-</span>
            }
          </div>
        </div>
      </div>
      {!isLoggedIn && (
        <div className="mt-1 text-sm text-primary font-medium">
          Login to view restaurant details
        </div>
      )}
    </Card>
  );
}