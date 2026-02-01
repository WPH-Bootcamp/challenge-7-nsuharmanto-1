import { useEffect, useState, useRef } from 'react';
import axios from '../services/api/axios';
import { useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Share2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import type { MenuItem } from '../types';
import { useUserLocation } from '../hooks/useUserLocation';
import { getDistanceFromLatLonInKm } from '../utils/distances';
import { useSelector } from 'react-redux';
import type { RootState } from '../features/store';

const MENU_CATEGORIES = ['All Menu', 'Food', 'Drink'];

type Restaurant = {
  id: number;
  name: string;
  star: number;
  averageRating: number;
  place: string;
  logo: string;
  images: string[];
  category: string;
  totalMenus: number;
  totalReviews: number;
  coordinates?: { lat: number; long: number };
};

type Review = {
  id: number;
  star: number;
  comment: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    avatar?: string | null;
  };
};

type MenuItemWithType = MenuItem & { type?: string; restoLogo?: string };

type ApiMenu = {
  id: string | number;
  foodName: string;
  price: number;
  image?: string;
  type?: string;
};

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [activeCategory, setActiveCategory] = useState('All Menu');
  const [menuItems, setMenuItems] = useState<MenuItemWithType[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [reviewLimit, setReviewLimit] = useState(6);
  const [menuLimit, setMenuLimit] = useState(8);

  const reviewRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [lastVisibleIdx, setLastVisibleIdx] = useState<number>(-1);
  const [lastVisibleRect, setLastVisibleRect] = useState<DOMRect | null>(null);

  const isLoggedIn = true;
  const userLocation = useUserLocation();

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get(
        `${baseUrl}/api/resto/${id}?limitMenu=${menuLimit}&limitReview=${reviewLimit}`
      )
      .then((res) => {
        const data = res.data?.data;
        setRestaurant(data);
        setMenuItems(
          (data?.menus || []).map((m: ApiMenu) => ({
            id: String(m.id),
            name: m.foodName,
            price: m.price,
            imageUrl: m.image || '/assets/no_image.png',
            type: m.type,
            restoName: data.name,
            restoLogo: data.logo,
          }))
        );
        setReviews(data?.reviews || []);
      })
      .catch(() => {
        setError('Failed to load restaurant data. Please check the restaurant ID or try again later.');
      })
      .finally(() => setLoading(false));
  }, [id, menuLimit, reviewLimit, baseUrl]);

  useEffect(() => {
    if (lastVisibleIdx !== -1 && lastVisibleRect && reviewRefs.current[lastVisibleIdx + 1]) {
      const newRect = reviewRefs.current[lastVisibleIdx + 1]?.getBoundingClientRect();
      if (newRect) {
        const diff = newRect.top - lastVisibleRect.top;
        window.scrollBy({ top: diff, behavior: 'smooth' });
      }
      setLastVisibleIdx(-1);
      setLastVisibleRect(null);
    }
  }, [reviews, lastVisibleIdx, lastVisibleRect]);

  const filteredMenu =
    activeCategory === 'All Menu'
      ? menuItems
      : menuItems.filter((m) =>
          activeCategory === 'Food' ? m.type === 'food' : m.type === 'drink'
        );

  const reviewPerPage = 6;
  const menuPerPage = 8;

  const isAllMenuShown = menuItems.length >= (restaurant?.totalMenus ?? menuItems.length);
  const isAllReviewShown = reviews.length >= (restaurant?.totalReviews ?? reviews.length);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-500 text-lg">Loading...</span>
      </div>
    );
  }
  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-red-500 text-lg">{error || 'Restaurant not found.'}</span>
      </div>
    );
  }

  const restoLat = restaurant.coordinates?.lat ?? (restaurant as { lat?: number }).lat;
  const restoLong = restaurant.coordinates?.long ?? (restaurant as { long?: number }).long;

  let distance: number | null = null;
  if (
    userLocation &&
    typeof userLocation.latitude === 'number' &&
    typeof userLocation.longitude === 'number' &&
    typeof restoLat === 'number' &&
    typeof restoLong === 'number'
  ) {
    distance = getDistanceFromLatLonInKm(
      userLocation.latitude,
      userLocation.longitude,
      restoLat,
      restoLong
    );
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      <div className="fixed top-0 left-0 w-full z-50">
        <Header solid />
      </div>
      <main className="flex-1 w-full pt-[80px]">
        <div className="w-full px-4 md:px-[clamp(1rem,8vw,120px)] mx-auto">
          <section className="flex flex-col md:flex-row gap-6 mt-[clamp(1rem,4vw,32px)]">
            <div className="w-full md:w-[651px] md:h-[470px] flex flex-col gap-3">
              <img
                src={restaurant.images?.[0] || '/images/placeholder.png'}
                alt={restaurant.name}
                className="rounded-2xl w-full h-[220px] md:h-[470px] object-cover object-center"
                style={{ maxWidth: '100%' }}
              />
              <div className="flex md:hidden gap-3 justify-center">
                {(restaurant.images || []).slice(1).map((img: string, idx: number) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`resto-img-${idx}`}
                    className="rounded-xl w-[clamp(60px,22vw,100px)] h-[clamp(60px,22vw,100px)] object-cover object-center"
                  />
                ))}
              </div>
            </div>
            <div className="hidden md:flex flex-col gap-3 flex-1 h-[470px]">
              {(restaurant.images || [])[1] && (
                <img
                  src={restaurant.images[1]}
                  alt="resto-img-1"
                  className="rounded-xl w-full h-[302px] object-cover object-center"
                />
              )}
              <div className="flex gap-3 h-[156px]">
                {(restaurant.images || []).slice(2, 4).map((img: string, idx: number) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`resto-img-${idx + 2}`}
                    className="rounded-xl w-1/2 h-full object-cover object-center"
                    style={{ minWidth: 0 }}
                  />
                ))}
              </div>
            </div>
          </section>
          {/* Restaurant Info & Share Button */}
          <section className="mt-4 flex flex-row items-center justify-between gap-4">
            {/* Kiri: Logo + Nama + Rating + Lokasi/Jarak */}
            <div className="flex items-center gap-3 flex-1">
              <img
                src={restaurant.logo || '/logos/foody_logo.svg'}
                alt={restaurant.name}
                className="object-cover w-[56px] h-[56px] md:w-[120px] md:h-[120px]"
              />
              <div className="flex flex-col justify-center">
                <div className="font-extrabold text-[clamp(1.125rem,2vw,1.5rem)] text-gray-900">
                  {restaurant.name}
                </div>
                <div className="flex items-center gap-2 text-gray-700 text-base mt-1">
                  <img
                    src="/icons/star.svg"
                    alt="star"
                    className="w-6 h-6"
                    width={24}
                    height={24}
                  />
                  <span className="font-semibold">{restaurant.star}</span>
                </div>
                <div className="text-md text-gray-950 mt-1">
                  {restaurant.place ?? '-'} <span className="mx-1">·</span>
                  {isLoggedIn ? (
                    typeof distance === 'number' ? (
                      `${distance.toFixed(1)} km`
                    ) : (
                      <span className="text-gray-400 text-text-md italic">
                        Set address to see distance
                      </span>
                    )
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
              </div>
            </div>
            {/* Kanan: Tombol Share */}
            <div className="flex-shrink-0 flex items-center justify-center h-full">
              <Button
                variant="outline"
                className="hidden md:flex rounded-full items-center gap-2 px-4 py-2 shadow hover:shadow-lg transition-shadow duration-200"
              >
                <Share2 className="w-6 h-6" />
                <span className="font-bold">Share</span>
              </Button>
              <Button
                variant="outline"
                className="flex md:hidden rounded-full p-2 w-10 h-10 justify-center items-center shadow hover:shadow-lg transition-shadow duration-200"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </section>
          <div className="border-b border-gray-300 mt-4 md:mt-8" />
          <section className="mt-4 md:mt-8">
            <div className="font-extrabold text-[clamp(1.25rem,2vw,1.5rem)] text-gray-900 mb-4">
              Menu
            </div>
            <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
              {MENU_CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? 'default' : 'outline'}
                  className={`rounded-full px-4 py-2 text-[clamp(1rem,1.2vw,1.1rem)] font-semibold whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-[#FFECEC] text-primary/100 border border-primary/100 hover:text-gray-50'
                      : 'bg-white text-gray-900'
                  }`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
              style={{
                gridAutoRows: 'minmax(160px, auto)',
              }}
            >
              {filteredMenu.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                className={`px-8 py-2 h:10 md:h-12 rounded-full bg-white border border-gray-300 shadow text-[clamp(1rem,2vw,1.1rem)] font-bold hover:bg-gray-50 hover:shadow-lg transition-shadow-md duration-200
                  ${isAllMenuShown ? "text-gray-500 cursor-not-allowed" : "text-gray-950"}
                `}
                onClick={() => setMenuLimit((prev) => prev + menuPerPage)}
                disabled={isAllMenuShown}
              >
                {isAllMenuShown ? "No more menu" : "Show More"}
              </Button>
            </div>
          </section>
          <div className="border-b border-gray-300 mt-4 md:mt-8" />
          <section className="mt-8 mb-12">
            <div className="font-extrabold text-[clamp(1.25rem,2vw,1.5rem)] text-gray-900 mb-4">
              Review
            </div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/icons/star.svg"
                alt="star"
                className="w-[34px] h-[34px]"
                width={34}
                height={34}
              />
              <span className="font-extrabold text-xl">
                {restaurant.averageRating || restaurant.star || 4.9}
              </span>
              <span className="font-extrabold text-xl">
                ({restaurant.totalReviews || 0} Ulasan)
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((review, idx) => (
                <div
                  key={review.id}
                  ref={(el) => {
                    reviewRefs.current[idx] = el;
                  }}
                  className="bg-white rounded-2xl shadow-md p-4 flex flex-col gap-2"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={review.user.avatar || '/images/user_avatar.png'}
                      alt={review.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-extrabold text-[clamp(1rem,1.2vw,1.15rem)] text-gray-900">
                        {review.user.name}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {new Date(review.createdAt).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}{' '}
                        {new Date(review.createdAt).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(review.star)].map((_, i) => (
                      <img
                        key={i}
                        src="/icons/star.svg"
                        alt="star"
                        className="w-6 h-6"
                        width={24}
                        height={24}
                      />
                    ))}
                  </div>
                  <div className="text-base text-gray-800">{review.comment}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                className={`px-8 py-2 h:10 md:h-12 rounded-full bg-white border border-gray-300 shadow text-[clamp(1rem,2vw,1.1rem)] font-bold hover:bg-gray-50 hover:shadow-lg transition-shadow-md duration-200
                  ${isAllReviewShown ? "text-gray-500 cursor-not-allowed" : "text-gray-950"}
                `}
                onClick={() => {
                  const idx = reviews.length - 1;
                  if (reviewRefs.current[idx]) {
                    setLastVisibleRect(reviewRefs.current[idx]!.getBoundingClientRect());
                    setLastVisibleIdx(idx);
                  }
                  setReviewLimit((prev) => prev + reviewPerPage);
                }}
                disabled={isAllReviewShown}
              >
                {isAllReviewShown ? "No more review" : "Show More"}
              </Button>
            </div>
          </section>
        </div>
      </main>
      {cartItems.length > 0 && (
        <div
          className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-gray-200 flex items-center justify-between px-4 py-3 md:px-[clamp(1rem,8vw,120px)] md:py-4"
          style={{ boxShadow: '0 -2px 16px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-semibold text-gray-800">
              <img src="/icons/cart.svg" alt="cart" className="w-5 h-5" />
              {totalQty} Items
            </span>
            <span className="font-bold text-lg text-gray-900 ml-2">
              Rp{totalPrice.toLocaleString('id-ID')}
            </span>
          </div>
          <Button
            variant="default"
            className="rounded-full px-8 py-2 text-lg font-bold bg-primary text-white hover:bg-primary/90 transition-colors duration-200"
            onClick={() => {/* handle checkout logic */}}
          >
            Checkout
          </Button>
        </div>
      )}
      <Footer />
    </div>
  );
}