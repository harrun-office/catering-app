// src/pages/AdminMenu.js
import React, { useEffect, useState } from 'react';
import MenuItem from '../components/MenuItem';
import { ImagePlus, Plus, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import { menuAPI } from '../utils/api';

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
  const [items, setItems] = useState(seedItems);
  const [loadingIds, setLoadingIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [mode, setMode] = useState('edit'); // 'edit' | 'add'

  const [addForm, setAddForm] = useState({
    category_id: '',
    name: '',
    description: '',
    price: '',
    servings: '',
    preparation_time: '',
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false,
    file: null,
  });
  const [addErrors, setAddErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});

  useEffect(() => {
    let mounted = true;
    menuAPI
      .getCategories()
      .then((res) => {
        if (!mounted) return;
        const cats = res.data?.categories || [];
        setCategories(cats);
        if (cats.length > 0) setAddForm((f) => ({ ...f, category_id: String(cats[0].id) }));
      })
      .catch((err) => console.error('Failed to load categories', err));
    return () => (mounted = false);
  }, []);

  const handleFieldChange = (id, field, value) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleFileChange = (id, file) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, file } : item)));
  };

  const handleToggleAvailability = (id) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, is_available: !item.is_available } : item)));
  };

  const switchToAdd = () => {
    setMode('add');
    setAddForm({
      category_id: categories?.[0]?.id ? String(categories[0].id) : '',
      name: '',
      description: '',
      price: '',
      servings: '',
      preparation_time: '',
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: false,
      file: null,
    });
    setAddErrors({});
  };

  const validateAddForm = () => {
    const errs = {};
    if (!addForm.category_id) errs.category_id = 'Category is required';
    if (!addForm.name || addForm.name.trim().length < 2) errs.name = 'Name is required';
    if (addForm.price === '' || Number(addForm.price) < 0) errs.price = 'Price must be 0 or more';
    if (!addForm.file) errs.file = 'Image is required';
    setAddErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddSubmit = async () => {
    if (!validateAddForm()) return;
    try {
      setLoadingIds((s) => [...s, 'add']);
      const form = new FormData();
      form.append('category_id', addForm.category_id);
      form.append('name', addForm.name);
      form.append('description', addForm.description);
      form.append('price', addForm.price);
      form.append('servings', addForm.servings || '');
      form.append('preparation_time', addForm.preparation_time || '');
      form.append('is_vegetarian', addForm.is_vegetarian ? 1 : 0);
      form.append('is_vegan', addForm.is_vegan ? 1 : 0);
      form.append('is_gluten_free', addForm.is_gluten_free ? 1 : 0);
      form.append('image', addForm.file);

      const res = await menuAPI.createMenuItem(form);
      const created = res?.data?.item;
      if (created) {
        setItems((prev) => [created, ...prev]);
        setMode('edit');
      }
    } catch (err) {
      console.error('Add failed', err);
      alert('Failed to add item. See console for details.');
    } finally {
      setLoadingIds((s) => s.filter((i) => i !== 'add'));
    }
  };

  const handleEditSave = async (item) => {
    // client-side validation for edits
    const errs = {};
    if (!item.name || String(item.name).trim().length < 2) errs.name = 'Name is required';
    if (item.price === undefined || item.price === '' || Number(item.price) < 0) errs.price = 'Price must be 0 or more';
    if (Object.keys(errs).length > 0) {
      setEditErrors((prev) => ({ ...prev, [item.id]: errs }));
      return;
    } else {
      setEditErrors((prev) => {
        const copy = { ...prev };
        delete copy[item.id];
        return copy;
      });
    }
    try {
      setLoadingIds((s) => [...s, item.id]);
      const form = new FormData();
      let categoryId = item.category_id || '';
      if (!categoryId && item.category && categories.length > 0) {
        const found = categories.find((c) => c.name === item.category || String(c.id) === String(item.category));
        if (found) categoryId = String(found.id);
      }
      if (!categoryId && categories.length > 0) categoryId = String(categories[0].id);

      form.append('category_id', categoryId);
      form.append('name', item.name || 'Untitled');
      form.append('description', item.description || '');
      form.append('price', item.price || 0);
      form.append('servings', item.servings || '');
      form.append('preparation_time', item.preparation_time || '');
      form.append('is_vegetarian', item.is_vegetarian ? 1 : 0);
      form.append('is_vegan', item.is_vegan ? 1 : 0);
      form.append('is_gluten_free', item.is_gluten_free ? 1 : 0);
      if (item.file) form.append('image', item.file);

      const res = await menuAPI.updateMenuItem(item.id, form);
      if (res.status === 200) {
        setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, ...item, file: null } : it)));
      }
    } catch (err) {
      console.error('Save failed', err);
      alert('Failed to save item. See console for details.');
    } finally {
      setLoadingIds((s) => s.filter((i) => i !== item.id));
    }
  };

  const filteredItems = items.filter((item) => {
    if (!selectedCategory) return true;
    const cat = categories.find((c) => String(c.id) === String(selectedCategory));
    if (!cat) return true;
    // match by category name or category_id if available
    return (
      String(item.category) === String(cat.name) ||
      String(item.category_id || '') === String(selectedCategory) ||
      String(item.category || '') === String(selectedCategory)
    );
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Menu Studio</p>
          <h1 className="text-3xl font-semibold text-slate-900">Curate every dish</h1>
          <p className="text-sm text-slate-500">Update imagery, pricing, and availability with real-time previews.</p>
        </div>
        <div className="inline-flex items-center gap-2">
          <button
            onClick={() => setMode('edit')}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold ${mode === 'edit' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>
            Edit Menu
          </button>
          <button
            onClick={switchToAdd}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold ${mode === 'add' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>
            <Plus size={14} /> Add New
          </button>
        </div>
      </div>

      {mode === 'edit' && (
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-600">Filter by category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      {mode === 'add' ? (
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 max-w-3xl">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-slate-600">
              Category
              <select
                value={addForm.category_id}
                onChange={(e) => setAddForm((f) => ({ ...f, category_id: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {addErrors.category_id && <div className="text-xs text-red-600">{addErrors.category_id}</div>}
            </label>

            <label className="space-y-2 text-sm font-semibold text-slate-600">
              Dish name
              <input
                value={addForm.name}
                onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none"
              />
              {addErrors.name && <div className="text-xs text-red-600">{addErrors.name}</div>}
            </label>
          </div>

          <label className="mt-4 block space-y-2 text-sm font-semibold text-slate-600">
            Description
            <textarea
              value={addForm.description}
              onChange={(e) => setAddForm((f) => ({ ...f, description: e.target.value }))}
              rows="3"
              className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none"
            />
          </label>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-slate-600">
              Price (₹)
              <input
                type="number"
                value={addForm.price}
                onChange={(e) => setAddForm((f) => ({ ...f, price: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none"
              />
              {addErrors.price && <div className="text-xs text-red-600">{addErrors.price}</div>}
            </label>

            <label className="space-y-2 text-sm font-semibold text-slate-600">
              Image
              <div className="flex items-center gap-2">
                <label className="rounded-2xl bg-slate-100 px-3 py-2 text-slate-500 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setAddForm((f) => ({ ...f, file: e.target.files?.[0] || null }))}
                  />
                  <ImagePlus size={16} />
                </label>
                <div className="text-sm text-slate-500">{addForm.file ? addForm.file.name : 'No file chosen'}</div>
              </div>
              {addErrors.file && <div className="text-xs text-red-600">{addErrors.file}</div>}
            </label>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleAddSubmit}
              disabled={loadingIds.includes('add')}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:shadow-lg"
            >
              <Save size={16} />
              {loadingIds.includes('add') ? 'Adding...' : 'Add menu item'}
            </button>

            <button
              onClick={() => setMode('edit')}
              className="rounded-2xl px-4 py-2 text-sm font-semibold bg-slate-100 text-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredItems.map((item) => (
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
                  {editErrors[item.id]?.name && <div className="text-xs text-red-600">{editErrors[item.id].name}</div>}
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
                  {editErrors[item.id]?.price && <div className="text-xs text-red-600">{editErrors[item.id].price}</div>}
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
                    <label className="rounded-2xl bg-slate-100 p-2 text-slate-500 cursor-pointer">
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(item.id, e.target.files[0])} />
                      <ImagePlus size={16} />
                    </label>
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
                  onClick={() => handleEditSave(item)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:shadow-lg"
                  disabled={loadingIds.includes(item.id)}
                >
                  <Save size={16} />
                  {loadingIds.includes(item.id) ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
