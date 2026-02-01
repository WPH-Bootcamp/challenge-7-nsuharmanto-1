
const categories = [
  { id: "all", name: "All Restaurant", icon: "/assets/category-all.png" },
  { id: "nearby", name: "Nearby", icon: "/assets/category-nearby.png" },
  { id: "discount", name: "Discount", icon: "/assets/category-discount.png" },
  { id: "best", name: "Best Seller", icon: "/assets/category-best.png" },
  { id: "delivery", name: "Delivery", icon: "/assets/category-delivery.png" },
  { id: "lunch", name: "Lunch", icon: "/assets/category-lunch.png" },
];

export default function CategoryBar() {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex gap-4 min-w-max">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm px-6 py-4 min-w-[120px] cursor-pointer hover:bg-gray-50 transition border border-gray-100"
          >
            <img src={cat.icon} alt={cat.name} className="h-10 w-10 mb-2 object-contain" />
            <span className="font-medium text-[clamp(0.9rem,1vw,1.1rem)] text-gray-800 text-center">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
