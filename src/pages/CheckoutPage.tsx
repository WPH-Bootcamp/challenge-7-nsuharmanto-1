import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../features/store';
import { clearCart } from '../features/cart/cartSlice';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

export default function CheckoutPage() {
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    dispatch(clearCart());
  };

  if (submitted) {
    return <div className="p-8 text-center text-green-600 font-bold">Pesanan berhasil disimpan!</div>;
  }

  return (
    <form className="max-w-md mx-auto bg-white p-6 rounded shadow" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Checkout</h2>
      <div className="mb-2">
        <Input placeholder="Nama" value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div className="mb-2">
        <Input placeholder="No HP" value={phone} onChange={e => setPhone(e.target.value)} required />
      </div>
      <div className="mb-2">
        <Input placeholder="Alamat" value={address} onChange={e => setAddress(e.target.value)} required />
      </div>
      <div className="mb-4 font-bold">Total: Rp {total}</div>
      <Button type="submit" className="w-full">Simpan Pesanan</Button>
    </form>
  );
}
