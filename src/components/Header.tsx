import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../features/store';
import { logout } from '../features/user/userSlice';
import { getAvatar } from '../utils/getAvatar';
import { Button } from '@/components/ui/button';

type HeaderProps = {
  solid?: boolean;
};

export default function Header({ solid = false }: HeaderProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, user } = useSelector((state: RootState) => state.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);

  useEffect(() => {
    if (solid) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [solid]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!(e.target as HTMLElement).closest('#user-dropdown')) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  return (
    <header
      className={`header-solid top-0 left-0 w-full h-[clamp(64px,8vw,80px)] flex items-center justify-between px-4 md:px-[clamp(32px,8vw,120px)] transition-colors duration-300 ${
        scrolled ? 'bg-white shadow' : 'bg-none'
      }`}
    >
      <div className="flex items-center gap-3 md:gap-4">
        <button
          type="button"
          onClick={() => {
            if (solid) navigate('/');
          }}
          className="flex items-center gap-3 md:gap-4 focus:outline-none bg-transparent border-none p-0 m-0"
          style={{ cursor: solid ? 'pointer' : 'default' }}
          tabIndex={0}
          aria-label="Back to Home"
        >
          <img
            src={scrolled ? '/logos/foody_logo_r.svg' : '/logos/foody_logo.svg'}
            alt="Foody Logo"
            className="h-8 w-8 md:h-10 md:w-10 transition-all duration-300"
          />
          <span
            className={`font-extrabold font-sans tracking-tight text-[clamp(1.5rem,4vw,2.5rem)] transition-colors duration-300 ${
              scrolled ? 'text-gray-900' : 'text-white'
            }`}
          >
            Foody
          </span>
        </button>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        {isLoggedIn && user ? (
          <>
            {/* Cart */}
            <button
              className={`relative p-2 rounded-full bg-transparent transition
              ${scrolled ? 'hover:bg-gray-300' : 'hover:bg-gray-800'}`}
                    aria-label="Cart"
              onClick={() => navigate('/cart')}
            >
              <img
                src={scrolled ? '/icons/cart.svg' : '/icons/cart_w.svg'}
                alt="Cart"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
              {/* Badge item number */}
              {totalQty > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[20px] text-center border-2 border-white"
                  style={{ fontSize: 12, lineHeight: '18px' }}
                  data-testid="cart-badge"
                >
                  {totalQty}
                </span>
              )}
            </button>
            {/* User Avatar */}
            {/* Mobile: Avatar only, no name */}
            <button
              className="flex md:hidden items-center gap-0 focus:outline-none"
              onClick={() => setDropdownOpen((open) => !open)}
              aria-label="Profile"
              id="user-dropdown"
            >
              <img
                src={getAvatar(user)}
                alt={user?.name || 'User'}
                className="w-12 h-12 rounded-full object-cover"
              />
            </button>
            {/* Dropdown menu for mobile */}
            {dropdownOpen && (
              <div
                className="absolute top-[calc(100%)] right-4 left-auto bg-white rounded-2xl shadow-xl border border-gray-100 py-4 z-30 flex flex-col"
                style={{
                  minWidth: 0,
                  width: 'auto',
                  maxWidth: '90vw',
                  paddingLeft: 0,
                  paddingRight: 0,
                }}
                id="user-dropdown"
              >
                {/* Profile section */}
                <div className="flex items-center gap-3 px-5 pb-3 border-b border-gray-200 mb-2 min-w-[220px]">
                  <img
                    src={getAvatar(user)}
                    alt={user?.name || 'User'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="font-bold text-lg text-gray-900 break-all">{user?.name}</div>
                </div>
                {/* Menu items */}
                <button
                  className="w-full text-left px-5 py-3 hover:bg-gray-50 text-gray-900 flex items-center gap-3 transition"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/address');
                  }}
                >
                  <img
                    src="/icons/delivery_address.svg"
                    alt="Delivery Address"
                    width={22}
                    height={22}
                    className="inline-block"
                  />
                  <span className="text-base">Delivery Address</span>
                </button>
                <button
                  className="w-full text-left px-5 py-3 hover:bg-gray-50 text-gray-900 flex items-center gap-3 transition"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/orders');
                  }}
                >
                  <img
                    src="/icons/my_orders.svg"
                    alt="My Orders"
                    width={22}
                    height={22}
                    className="inline-block"
                  />
                  <span className="text-base">My Orders</span>
                </button>
                <button
                  className="w-full text-left px-5 py-3 hover:bg-gray-50 text-red-600 flex items-center gap-3 transition"
                  onClick={() => {
                    dispatch(logout());
                    setDropdownOpen(false);
                    navigate('/login');
                  }}
                >
                  <img
                    src="/icons/logout.svg"
                    alt="Logout"
                    width={22}
                    height={22}
                    className="inline-block"
                  />
                  <span className="text-base">Logout</span>
                </button>
              </div>
            )}
            {/* Desktop: Avatar + name */}
            <button
              className="hidden md:flex items-center gap-2 focus:outline-none"
              onClick={() => navigate('/profile')}
              aria-label="Profile"
            >
              <img
                src={getAvatar(user)}
                alt={user?.name || 'User'}
                className="w-12 h-12 rounded-full object-cover"
              />
              <span
                className={`font-semibold text-base transition-colors duration-300 ${
                  scrolled ? 'text-gray-900' : 'text-white'
                }`}
              >
                {user.name}
              </span>
            </button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              className={`rounded-full px-4 md:px-8 py-2 font-semibold text-base md:text-[1rem] transition-all duration-300 border-2 shadow-none
                ${
                  scrolled
                    ? 'border-gray-900 text-gray-900 bg-transparent hover:bg-gray-100'
                    : 'border-[#E9EAEB] text-white bg-transparent hover:bg-white/10'
                }`}
              style={{ height: 'clamp(40px,6vw,48px)', minWidth: 'clamp(100px,12vw,160px)' }}
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
            <Button
              variant="default"
              className={`rounded-full px-4 md:px-8 py-2 font-semibold text-base md:text-[1rem] transition-all duration-300 border-2 shadow-none
                ${
                  scrolled
                    ? 'border-primary bg-primary text-white hover:bg-red-700'
                    : 'border-white bg-white text-[#181818] hover:bg-gray-100'
                }`}
              style={{ height: 'clamp(40px,6vw,48px)', minWidth: 'clamp(100px,12vw,160px)' }}
              onClick={() => {
                navigate('/register');
              }}
            >
              Sign Up
            </Button>
          </>
        )}
      </div>
    </header>
  );
}