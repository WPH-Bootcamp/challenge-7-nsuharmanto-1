import { Button } from './ui/button';
import { Card } from './ui/card';
import { Minus, Plus } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../features/cart/cartSlice';
import type { MenuItem, CartItem } from '../types';
import type { RootState } from '../features/store';

export default function ProductCard({ item }: { item: MenuItem }) {
  const dispatch = useDispatch();

  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find((i: CartItem) => i.id === item.id)
  );
  const qty = cartItem?.qty || 0;

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: 1,
      imageUrl: item.imageUrl,
      restoName: item.restoName,
      restoLogo: item.restoLogo,
    }));
  };

  const handlePlus = () => {
    dispatch(addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: 1,
      imageUrl: item.imageUrl,
      restoName: item.restoName,
      restoLogo: item.restoLogo,
    }));
  };

  const handleMinus = () => {
    dispatch(removeFromCart(item.id));
  };

  return (
    <Card className="bg-white shadow-md flex flex-col items-center hover:shadow-lg transition-all min-h-[180px] h-full">
      {/* Product Image */}
      <img
        src={item.imageUrl || '/assets/no_image.png'}
        alt={item.name}
        className="w-full rounded-t-xl object-cover mb-2 h-[172.5px] md:h-[285px]"
      />
      {/* Name, Price , and Button */}
      <div className="w-full flex flex-col gap-2 flex-1 px-4 py-4">
        {/* Desktop: horizontal layout */}
        <div className="hidden md:flex w-full items-center justify-between gap-2">
          <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
            <div className="font-medium text-[clamp(1rem,1.2vw,1.15rem)] text-gray-900 leading-tight truncate w-full">
              {item.name}
            </div>
            <div className="text-neutral-950 font-extrabold text-lg">
              Rp {item.price.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="flex items-center">
            {qty === 0 ? (
              <Button
                className="rounded-full px-5 py-2 bg-primary text-white font-bold text-base hover:bg-primary/90 transition"
                onClick={handleAddToCart}
              >
                Add
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full border border-gray-300 w-8 h-8 p-0"
                  onClick={handleMinus}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="font-semibold w-6 text-center">{qty}</span>
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full bg-primary text-white w-8 h-8 p-0 hover:bg-primary/90"
                  onClick={handlePlus}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        {/* Mobile: vertical layout */}
        <div className="flex flex-col md:hidden w-full gap-2">
          <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
            <div className="font-extrabold text-[clamp(1rem,1.2vw,1.15rem)] text-gray-900 leading-tight truncate w-full">
              {item.name}
            </div>
            <div className="text-primary font-bold text-base">
              Rp {item.price.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="flex items-center mt-2">
            {qty === 0 ? (
              <Button
                className="rounded-full px-6 py-2 bg-primary text-white font-bold text-base w-full hover:bg-primary/90 transition"
                onClick={handleAddToCart}
              >
                Add
              </Button>
            ) : (
              <div className="flex items-center gap-2 w-full justify-center">
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full border border-gray-300 w-8 h-8 p-0"
                  onClick={handleMinus}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="font-semibold w-6 text-center">{qty}</span>
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full bg-primary text-white w-8 h-8 p-0 hover:bg-primary/90"
                  onClick={handlePlus}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}