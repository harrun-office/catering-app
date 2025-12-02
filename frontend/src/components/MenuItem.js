// src/components/MenuItem.jsx
import React, { useContext, useMemo, useState } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/* SVG fallback */
const SVG_PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
       <rect fill='#f3f4f6' width='100%' height='100%'/>
       <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
             font-size='28' fill='#9ca3af'>Image unavailable</text>
     </svg>`
  );

/* Local image mapping */
const LOCAL_IMAGE_MAP = {
  "spring-rolls": "/images/spring-rolls.jpg",
  "bruschetta": "/images/bruschetta.jpg",
  "chicken-wings": "/images/chicken-wings.jpg",
  "shrimp-appetizer": "/images/shrimp-appetizer.jpg",
  "grilled-salmon": "/images/grilled-salmon.jpg",
  "ribeye-steak": "/images/ribeye-steak.jpg",
  "chicken-parmesan": "/images/chicken-parmesan.jpg",
  "vegetable-stir-fry": "/images/vegetable-stir-fry.jpg",
  "chocolate-cake": "/images/chocolate-cake.jpg",
  "cheesecake": "/images/cheesecake.jpg",
  "fruit-salad": "/images/fruit-salad.jpg",
  "ice-cream-sundae": "/images/ice-cream-sundae.jpg",
  coffee: "/images/coffee.jpg",
  "orange-juice": "/images/orange-juice.jpg",
  "soft-drink": "/images/soft-drink.jpg",
  "iced-tea": "/images/iced-tea.jpg",
  "paneer-tikka": "/images/paneer-tikka.jpg",
  "buddha-bowl": "/images/buddha-bowl.jpg",
  "mushroom-risotto": "/images/mushroom-risotto.jpg",
  "vegan-burger": "/images/vegan-burger.jpg",
  "tofu-pad-thai": "/images/tofu-pad-thai.jpg",
  "chickpea-curry": "/images/chickpea-curry.jpg",
  "hyderabadi-dum-biryani": "/images/hyderabadi-biryani.jpg",
  "ambur-mutton-biryani": "/images/ambur-biryani.jpg",
  "royal-veg-biryani": "/images/veg-biryani.jpg",
  "paneer-tikka-biryani": "/images/paneer-biryani.jpg",
  "smoked-chicken-mandhi": "/images/chicken-mandhi.jpg",
  "mutton-mandhi": "/images/mutton-mandhi.jpg",
  "coastal-fish-mandhi": "/images/fish-mandhi.jpg",
  "family-mixed-mandhi": "/images/mixed-mandhi.jpg",
};

/* helpers */
const getBasename = (p) => {
  if (!p) return "";
  const normalized = p.replace(/\\/g, "/").replace(/\/+$/, "");
  return normalized.split("/").pop();
};

const ensureLeadingSlash = (p) => (p.startsWith("/") ? p : "/" + p);
const slugify = (str = "") =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const resolveLocalImage = (img, itemName) => {
  const trySlug = (v) => LOCAL_IMAGE_MAP[slugify(String(v || ""))] || null;

  if (img && /placeholder\.com/i.test(img)) {
    try {
      const url = new URL(img);
      const text = url.searchParams.get("text");
      return trySlug(text);
    } catch {}
  }

  if (itemName) {
    const byName = trySlug(itemName);
    if (byName) return byName;
  }

  if (img) {
    const base = getBasename(img).split(".")[0];
    return trySlug(base);
  }

  return null;
};

/* exported for Cart.js */
export const resolveImageSrc = (img, itemName) => {
  const localOverride = resolveLocalImage(img, itemName);
  if (localOverride) return localOverride;

  if (!img && !itemName) return SVG_PLACEHOLDER;
  if (!img && itemName) {
    const byName = resolveLocalImage(null, itemName);
    return byName || SVG_PLACEHOLDER;
  }

  if (/^https?:\/\//i.test(img)) return img;
  if (img.startsWith("/")) return img;

  let cleaned = String(img || "")
    .replace(/^yimages\/?/i, "images/")
    .replace(/^\/?images\/?/i, "images/");

  if (/^[A-Za-z]:\\/.test(img) || img.includes("\\")) {
    const name = getBasename(img);
    return name ? ensureLeadingSlash(`images/${name}`) : SVG_PLACEHOLDER;
  }

  const basename = getBasename(cleaned);
  if (basename) return ensureLeadingSlash(`images/${basename}`);

  return SVG_PLACEHOLDER;
};

/* Component */
export const MenuItem = ({ item = {}, onAddToCart = () => {}, onImgError }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(false);

  /* image safe resolver */
  const resolved = useMemo(() => {
    const r = resolveImageSrc(item?.image, item?.name);
    const s = String(r || "").trim();
    if (!s || s === "0" || /^0+$/.test(s)) return SVG_PLACEHOLDER;
    if (/^(\/|https?:\/\/|data:image\/)/i.test(s)) return s;
    return SVG_PLACEHOLDER;
  }, [item?.image, item?.name]);

  const handleImgError = (e) => {
    const t = e?.target;
    if (t && !t.dataset.fallback) {
      t.dataset.fallback = "1";
      t.src = SVG_PLACEHOLDER;
    }
  };

  /* Only allow cart if logged in */
  const handleAddClick = () => {
    // Allow adding to cart for guests as well — checkout will enforce authentication.
    try {
      console.debug && console.debug('MenuItem handleAddClick', { item });
      onAddToCart(item);
    } catch (err) {
      console.error('onAddToCart handler failed', err);
    }
  };

  /* CLEAN BADGE — remove 0 always */
  const rawBadge = item?.badge;
  const badgeStr = String(rawBadge ?? "").trim();
  const showBadge =
    badgeStr !== "" && badgeStr !== "0" && !/^0+(\s*,\s*0+)*$/.test(badgeStr);

  return (
    <div className="card overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 duration-300 p-4 sm:p-6 flex flex-col h-full">
      {/* IMAGE */}
      <div className="relative overflow-hidden bg-gray-200 aspect-[4/3] sm:aspect-[3/2]">
        <img
          src={resolved}
          alt={item?.name || "menu item"}
          onError={handleImgError}
          className="w-full h-full object-cover hover:scale-110 transition duration-300 menu-item-img"
        />

        {/* FAVORITE */}
        {/* <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100 transition"
        >
          <Heart
            size={20}
            fill={isFavorite ? "red" : "none"}
            color={isFavorite ? "red" : "gray"}
          />
        </button> */}

        {/* BADGES */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">

          {/* FIXED: badge never shows 0 */}
          {/*{showBadge && (
            <span className="bg-white/90 text-purple-700 px-3 py-1 text-xs rounded font-semibold shadow">
              {badgeStr}
            </span>
          )}

          <div className="flex gap-2">
            {item?.is_vegetarian && (
              <span className="bg-green-500 text-white px-2 py-1 text-xs rounded font-semibold">
                VEG
              </span>
            )}
            {item?.is_vegan && (
              <span className="bg-yellow-500 text-white px-2 py-1 text-xs rounded font-semibold">
                VEGAN
              </span>
            )}
            {item?.is_gluten_free && (
              <span className="bg-orange-500 text-white px-2 py-1 text-xs rounded font-semibold">
                GLUTEN FREE
              </span>
            )}
          </div> */}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-2 sm:p-4 flex flex-col flex-1">
        <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-2 line-clamp-2">
          {item?.name}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item?.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-purple-600">₹{item?.price}</p>
            {item?.servings && (
              <p className="text-xs text-gray-500">Serves {item.servings}</p>
            )}
          </div>
        </div>

        {/* ADD TO CART */}
        {item?.is_available ? (
          <button className="btn-primary w-full mt-auto" onClick={handleAddClick}>
            Add to Cart
          </button>
        ) : (
          <button
            disabled
            className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg font-semibold cursor-not-allowed mt-auto"
          >
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuItem;
