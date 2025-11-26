import React from 'react';
import { Heart } from 'lucide-react';

export const MenuItem = ({ item, onAddToCart }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);

  return (
    <div className="card overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 duration-300 p-4 sm:p-6">
      <div className="relative overflow-hidden bg-gray-200 aspect-[4/3] sm:aspect-[3/2]">
        <img
          src={item.image || 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(item.name)}
          alt={item.name}
          className="w-full h-full object-cover hover:scale-110 transition duration-300 menu-item-img"
        />
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100 transition"
          aria-pressed={isFavorite}
          aria-label="Toggle favorite"
        >
          <Heart size={20} fill={isFavorite ? 'red' : 'none'} color={isFavorite ? 'red' : 'gray'} />
        </button>

        <div className="absolute top-3 left-3 flex gap-2">
          {item.is_vegetarian && (
            <span className="bg-green-500 text-white px-2 py-1 text-xs rounded font-semibold">VEG</span>
          )}
          {item.is_vegan && (
            <span className="bg-yellow-500 text-white px-2 py-1 text-xs rounded font-semibold">VEGAN</span>
          )}
          {item.is_gluten_free && (
            <span className="bg-orange-500 text-white px-2 py-1 text-xs rounded font-semibold">GLUTEN FREE</span>
          )}
        </div>
      </div>

      <div className="p-2 sm:p-4">
        <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-2 line-clamp-2">{item.name}</h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-purple-600">₹{item.price}</p>
            {item.servings && <p className="text-xs text-gray-500">Serves {item.servings}</p>}
          </div>

          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
            <span className="text-sm font-semibold text-yellow-600">⭐ {item.rating || 'New'}</span>
          </div>
        </div>

        {item.preparation_time && (
          <p className="text-xs text-gray-500 mb-4">⏱️ {item.preparation_time} mins</p>
        )}

        {item.is_available ? (
          <button
            onClick={() => onAddToCart(item)}
            className="btn-primary w-full"
            aria-label={`Add ${item.name} to cart`}
          >
            Add to Cart
          </button>
        ) : (
          <button disabled className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg font-semibold cursor-not-allowed">
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
};
