import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '../components/ui/skeleton';

const fetchOrders = async () => {
  return [
    {
      id: '1',
      customerName: 'Budi',
      total: 50000,
      createdAt: '2025-09-10',
      items: [{ id: 'a', name: 'Nasi Goreng', price: 25000, qty: 2 }],
    },
  ];
};

export default function OrdersPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    staleTime: 60_000,
  });

  if (isLoading) return <Skeleton className="h-40 w-full" />;
  if (isError) return <div className="text-red-500">Gagal memuat riwayat pesanan.</div>;
  if (!data?.length) return <div className="text-gray-500">Belum ada pesanan.</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Riwayat Pesanan</h2>
      <div className="space-y-4">
        {data.map((order) => (
          <div key={order.id} className="border rounded p-4 bg-white shadow">
            <div className="font-bold">{order.customerName}</div>
            <div className="text-sm text-gray-500">Total: Rp {order.total}</div>
            <div className="text-xs text-gray-400">Tanggal: {order.createdAt}</div>
            <ul className="mt-2 text-sm">
              {order.items.map((item: { id: string; name: string; price: number; qty: number }) => (
                <li key={item.id}>
                  {item.name} x{item.qty} (Rp {item.price})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
