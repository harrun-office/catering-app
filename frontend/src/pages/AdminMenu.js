// src/pages/AdminMenu.jsx
import React from 'react';
import MenuItem from '../components/MenuItem';
import { ImagePlus, Plus, Save, ToggleLeft, ToggleRight } from 'lucide-react';

const seedItems = [
  {
    id: 1,
    name: 'Smoked Chicken Mandhi',
    description: 'Pit-roasted chicken mandhi finished with toasted nuts.',
    image: '/images/chicken-mandhi.jpg',
    price: 639,
    is_available: true,
    category: 'Signature',
  },
  {
    id: 2,
    name: 'Hyderabadi Dum Biryani',
    description: 'Slow-cooked dum biryani layered with saffron basmati.',
    image: '/images/hyderabadi-biryani.jpg',
    price: 499,
    is_available: true,
    category: 'Biryani',
  },
  {
    id: 3,
    name: 'Paneer Tikka Biryani',
    description: 'Charred paneer tikka folded through fragrant rice.',
    image: '/images/paneer-biryani.jpg',
    price: 479,
    is_available: false,
    category: 'Vegetarian',
  },
];

export default function AdminMenu() {
  const [items, setItems] = React.useState(seedItems);

  const handleFieldChange = (id, field, value) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleToggleAvailability = (id) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, is_available: !item.is_available } : item)));
  };

  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      name: 'New menu item',
      description: 'Add a short description',
      image: '/images/g6.jpg',
      price: 0,
      is_available: true,
      category: 'Category',
    };
    setItems((prev) => [newItem, ...prev]);
  };

  const handleSave = (item) => {
    // placeholder — wire up to backend admin endpoints
    alert(`Saving ${item.name}. Connect to adminAPI to persist.`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Menu Studio</p>
          <h1 className="text-3xl font-semibold text-slate-900">Curate every dish</h1>
          <p className="text-sm text-slate-500">Update imagery, pricing, and availability with real-time previews.</p>
        </div>
        <button
          onClick={handleAddItem}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-xl"
        >
          <Plus size={16} />
          Add new item
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className="rounded-2xl border border-dashed border-slate-200 p-4 mb-4">
              <MenuItem item={item} onAddToCart={() => {}} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-semibold text-slate-600">
                Dish name
                <input
                  value={item.name}
                  onChange={(e) => handleFieldChange(item.id, 'name', e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none"
                />
              </label>
              <label className="space-y-2 text-sm font-semibold text-slate-600">
                Category
                <input
                  value={item.category}
                  onChange={(e) => handleFieldChange(item.id, 'category', e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none"
                />
              </label>
            </div>

            <label className="mt-4 block space-y-2 text-sm font-semibold text-slate-600">
              Description
              <textarea
                value={item.description}
                onChange={(e) => handleFieldChange(item.id, 'description', e.target.value)}
                rows="2"
                className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none"
              />
            </label>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-semibold text-slate-600">
                Price (₹)
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => handleFieldChange(item.id, 'price', Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none"
                />
              </label>
              <label className="space-y-2 text-sm font-semibold text-slate-600">
                Image path / URL
                <div className="flex items-center gap-2">
                  <div className="rounded-2xl border border-slate-200 px-3 py-2 flex-1">
                    <input
                      value={item.image}
                      onChange={(e) => handleFieldChange(item.id, 'image', e.target.value)}
                      className="w-full border-none bg-transparent text-sm focus:outline-none"
                      placeholder="pasta.jpg or /images/pasta.jpg"
                    />
                  </div>
                  <span className="rounded-2xl bg-slate-100 p-2 text-slate-500">
                    <ImagePlus size={16} />
                  </span>
                </div>
                <p className="text-xs text-slate-400">Use filenames inside /public/images or paste an external URL.</p>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-slate-200 pt-4">
              <button
                onClick={() => handleToggleAvailability(item.id)}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold ${
                  item.is_available ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {item.is_available ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                {item.is_available ? 'Currently live' : 'Hidden from menu'}
              </button>

              <button
                onClick={() => handleSave(item)}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:shadow-lg"
              >
                <Save size={16} />
                Save changes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
