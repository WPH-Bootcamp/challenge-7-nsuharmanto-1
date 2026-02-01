import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../features/store';
import { setCategory, setSort, setQuery } from '../features/filters/filtersSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';

const categories = [
  { id: '', name: 'All' },
  { id: 'food', name: 'Food' },
  { id: 'drink', name: 'Drink' },
];
const sorts = [
  { value: '', label: 'Default' },
  { value: 'price', label: 'Price' },
  { value: 'rating', label: 'Rating' },
];

export default function FilterBar() {
  const dispatch = useDispatch();
  const { category, sort, query } = useSelector((state: RootState) => state.filters);

  return (
    <div className="flex flex-wrap gap-3 mb-6 items-center justify-center bg-white rounded-xl shadow-sm px-4 py-3">
      <select
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        value={category || ''}
        onChange={e => dispatch(setCategory(e.target.value))}
      >
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      <select
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        value={sort || ''}
        onChange={e => dispatch(setSort(e.target.value))}
      >
        {sorts.map(s => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      <Input
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Cari menu..."
        value={query}
        onChange={e => dispatch(setQuery(e.target.value))}
      />
      <Button variant="outline" className="text-sm px-4 py-2" onClick={() => dispatch(setQuery(''))}>Reset</Button>
    </div>
  );
}
