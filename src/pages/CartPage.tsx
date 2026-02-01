import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../features/store';
import { addToCart, removeFromCart } from '../features/cart/cartSlice';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Minus, Plus } from 'lucide-react';

export default function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const grouped = cartItems.reduce<Record<string, typeof cartItems>>((acc, item) => {
    const key = item.restoName || 'Unknown Resto';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const getTotal = (items: typeof cartItems) =>
    items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafbfc]">
      <Header solid />
      <main className="flex-1 w-full flex flex-col items-center px-2 md:px-0 pt-[80px] md:pt-[128px] pb-[40px] md:pb-[100px]">
        <h1 className="font-extrabold text-2xl md:text-3xl text-gray-900 mb-4 md:mb-8 w-full max-w-2xl md:max-w-4xl px-2 md:px-0">
          My Cart
        </h1>
        <div className="flex flex-col gap-6 w-full max-w-2xl md:max-w-4xl">
          {Object.keys(grouped).length === 0 && (
            <div className="bg-white rounded-2xl shadow-md p-8 text-lg text-center text-gray-500 font-medium">
              Your cart is empty.
            </div>
          )}
          {Object.entries(grouped).map(([resto, items], idx) => (
            <div
              key={resto + idx}
              className="bg-white rounded-2xl shadow-md p-5 md:p-8 flex flex-col gap-4"
            >
              <div className="flex items-center gap-2 font-bold text-lg md:text-xl mb-2">
                <img src={items[0].restoLogo || '/icons/resto.svg'} alt={resto} className="w-8 h-8 object-contain" style={{ aspectRatio: '1 / 1' }} />
                <span>{resto}</span>
                <img src="/icons/arrow-right.svg" alt="arrow" className="ml-1 w-6 h-6" />
              </div>
              <div className="flex flex-col gap-5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 md:gap-5"
                  >
                    <img
                      src={item.imageUrl || '/assets/no_image.png'}
                      alt={item.name}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover"
                    />
                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                      <div className="font-bold text-base md:text-lg text-gray-900 truncate">
                        {item.name}
                      </div>
                      <div className="font-extrabold text-[1rem] md:text-lg text-gray-900">
                        Rp{item.price.toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-full border border-gray-300 w-8 h-8 p-0"
                        onClick={() => dispatch(removeFromCart(item.id))}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="font-semibold w-6 text-center">{item.qty}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-full bg-primary text-white w-8 h-8 p-0 hover:bg-primary/90"
                        onClick={() =>
                          dispatch(
                            addToCart({
                              ...item,
                              qty: 1,
                            })
                          )
                        }
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="border-t border-0 border-b border-gray-300 mt-4 mb-4"
                style={{
                  borderStyle: 'dashed',
                  borderWidth: '0 0 1px 0',
                  borderImage: 'repeating-linear-gradient(to right, #D1D5DB 0 4px, transparent 4px 8px) 100 1',
                }}
              />
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
                <div className="flex flex-col items-start">
                  <span className="font-medium text-gray-950 text-text-md">Total</span>
                  <span className="font-extrabold text-lg md:text-xl text-gray-950 mt-1">
                    Rp{getTotal(items).toLocaleString('id-ID')}
                  </span>
                </div>
                <Button
                  className="rounded-full bg-primary text-white font-bold text-base md:text-lg py-3 md:py-0 mt-2 md:mt-0 w-full md:w-[240px] md:h-12"
                  style={{ maxWidth: 'unset' }}
                  onClick={() => {/* handle checkout */}}
                >
                  Checkout
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}