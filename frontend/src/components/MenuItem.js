// src/components/MenuItem.jsx
import React from 'react';
import { Heart } from 'lucide-react';

/**
 * MenuItem with robust image resolution and graceful fallbacks.
 * - Resolves many common backend shapes into /images/<basename>
 * - Supports absolute URLs
 * - Handles Windows paths, bare filenames, and common typo 'yimages'
 */

// inline SVG placeholder used as ultimate fallback
const SVG_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><rect fill='#f3f4f6' width='100%' height='100%'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='28' fill='#9ca3af'>Image unavailable</text></svg>`
  );

// Map seed menu items to images stored under /public/images
const LOCAL_IMAGE_MAP = {
  'spring-rolls': '/images/spring-rolls.jpg',
  'bruschetta': '/images/bruschetta.jpg',
  'chicken-wings': '/images/chicken-wings.jpg',
  'shrimp-appetizer': '/images/shrimp-appetizer.jpg',
  'grilled-salmon': '/images/grilled-salmon.jpg',
  'ribeye-steak': '/images/ribeye-steak.jpg',
  'chicken-parmesan': '/images/chicken-parmesan.jpg',
  'vegetable-stir-fry': '/images/vegetable-stir-fry.jpg',
  'chocolate-cake': '/images/chocolate-cake.jpg',
  'cheesecake': '/images/cheesecake.jpg',
  'fruit-salad': '/images/fruit-salad.jpg',
  'ice-cream-sundae': '/images/ice-cream-sundae.jpg',
  'coffee': '/images/coffee.jpg',
  'orange-juice': '/images/orange-juice.jpg',
  'soft-drink': '/images/soft-drink.jpg',
  'iced-tea': '/images/iced-tea.jpg',
  'paneer-tikka': '/images/paneer-tikka.jpg',
  'buddha-bowl': '/images/buddha-bowl.jpg',
  'mushroom-risotto': '/images/mushroom-risotto.jpg',
  'vegan-burger': '/images/vegan-burger.jpg',
  'tofu-pad-thai': '/images/tofu-pad-thai.jpg',
  'chickpea-curry': '/images/chickpea-curry.jpg',
  'hyderabadi-dum-biryani': '/images/hyderabadi-biryani.jpg',
  'ambur-mutton-biryani': '/images/ambur-biryani.jpg',
  'royal-veg-biryani': '/images/veg-biryani.jpg',
  'paneer-tikka-biryani': '/images/paneer-biryani.jpg',
  'smoked-chicken-mandhi': '/images/chicken-mandhi.jpg',
  'mutton-mandhi': '/images/mutton-mandhi.jpg',
  'coastal-fish-mandhi': '/images/fish-mandhi.jpg',
  'family-mixed-mandhi': '/images/mixed-mandhi.jpg',
};

const getBasename = (p) => {
  if (!p) return '';
  // normalize separators, strip trailing slashes
  const normalized = p.replace(/\\/g, '/').replace(/\/+$/, '');
  const parts = normalized.split('/');
  return parts[parts.length - 1];
};
const ensureLeadingSlash = (p) => (p.startsWith('/') ? p : '/' + p);

const formatPrice = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  const num = Number(value);
  if (Number.isNaN(num)) return value;
  return Math.round(num).toString();
};

const slugify = (str = '') =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const resolveLocalImage = (img, itemName) => {
  const trySlug = (value) => {
    const slug = slugify(value);
    return slug && LOCAL_IMAGE_MAP[slug] ? LOCAL_IMAGE_MAP[slug] : null;
  };

  // detect placeholder.com URLs with ?text=<name>
  if (img && /placeholder\.com/i.test(img)) {
    try {
      const url = new URL(img);
      const text = url.searchParams.get('text');
      const fromPlaceholder = trySlug(text);
      if (fromPlaceholder) return fromPlaceholder;
    } catch (_) {
      // ignore URL parse errors
    }
  }

  // allow mapping based on the menu item name itself
  if (itemName) {
    const fromName = trySlug(itemName);
    if (fromName) return fromName;
  }

  // fallback to filename without extension if it matches a known slug
  if (img) {
    const base = getBasename(img).split('.')[0];
    const fromImageName = trySlug(base);
    if (fromImageName) return fromImageName;
  }

  return null;
};

/**
 * resolveImageSrc(img)
 * Accepts:
 * - absolute URL: https://...
 * - already root-relative: /images/foo.jpg
 * - "images/foo.jpg" or "foo.jpg" -> /images/foo.jpg
 * - Windows path: "D:\...\foo.jpg" -> /images/foo.jpg
 * - common typo "yimages/foo.jpg" -> /images/foo.jpg
 * Returns either a URL (string) or the SVG placeholder data URI.
 */
export const resolveImageSrc = (img, itemName) => {
  const localOverride = resolveLocalImage(img, itemName);
  if (localOverride) return localOverride;

  if (!img) return SVG_PLACEHOLDER;

  // already an absolute external URL
  if (/^https?:\/\//i.test(img)) return img;

  // If it's already root-relative path like /images/foo.jpg -> keep it
  if (img.startsWith('/')) return img;

  // Clean common typo/folder: yimages -> images
  let cleaned = img.replace(/^yimages\/?/i, 'images/');

  // Normalize leading "images/" (strip optional leading slash)
  cleaned = cleaned.replace(/^\/?images\/?/i, 'images/');

  // If it's a Windows path (C:\... or contains backslashes), pick basename
  if (/^[A-Za-z]:\\/.test(img) || img.includes('\\')) {
    const name = getBasename(img);
    return name ? ensureLeadingSlash(`images/${name}`) : SVG_PLACEHOLDER;
  }

  // If cleaned looks like "images/foo.jpg" or "foo.jpg", pick basename
  const basename = getBasename(cleaned);
  if (basename) return ensureLeadingSlash(`images/${basename}`);

  return SVG_PLACEHOLDER;
};

export const MenuItem = ({ item = {}, onAddToCart = () => {}, onImgError }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);

  // resolved final src
  const resolved = React.useMemo(() => resolveImageSrc(item?.image, item?.name), [item?.image, item?.name]);

  const handleImgError = (e) => {
    // allow parent handler first (and guard)
    if (typeof onImgError === 'function') {
      try {
        onImgError(e);
      } catch (err) {
        console.warn('parent onImgError threw', err);
      }
    }

    const t = e?.target;
    console.error(`[MenuItem] image load failed for resolved="${t?.currentSrc || t?.src}" alt="${t?.alt}"`);

    // only swap to placeholder once
    if (t && !t.dataset.fallback) {
      t.dataset.fallback = '1';
      t.src = SVG_PLACEHOLDER;
    }
  };

  return (
    <div className="card overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 duration-300 p-4 sm:p-6">
      <div className="relative overflow-hidden bg-gray-200 aspect-[4/3] sm:aspect-[3/2]">
        <img
          src={resolved}
          alt={item?.name || 'menu item'}
          onError={handleImgError}
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

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {item?.badge && (
            <span className="bg-white/90 text-purple-700 px-3 py-1 text-xs rounded font-semibold shadow">
              {item.badge}
            </span>
          )}
          <div className="flex gap-2">
            {item?.is_vegetarian && <span className="bg-green-500 text-white px-2 py-1 text-xs rounded font-semibold">VEG</span>}
            {item?.is_vegan && <span className="bg-yellow-500 text-white px-2 py-1 text-xs rounded font-semibold">VEGAN</span>}
            {item?.is_gluten_free && <span className="bg-orange-500 text-white px-2 py-1 text-xs rounded font-semibold">GLUTEN FREE</span>}
          </div>
        </div>
      </div>

      <div className="p-2 sm:p-4">
        <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-2 line-clamp-2">{item?.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item?.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-purple-600">₹{formatPrice(item?.price)}</p>
            {item?.servings && <p className="text-xs text-gray-500">Serves {item.servings}</p>}
          </div>
        </div>

        {item?.is_available ? (
          <button onClick={() => onAddToCart(item)} className="btn-primary w-full" aria-label={`Add ${item?.name} to cart`}>
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

export default MenuItem;
