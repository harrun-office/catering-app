-- Sample menu data for CaterHub

USE catering_db;

-- Insert Categories (if they don't exist)
INSERT IGNORE INTO categories (name, description) VALUES
('Appetizers', 'Starters and finger foods'),
('Main Courses', 'Hearty main dishes'),
('Desserts', 'Sweet treats and desserts'),
('Beverages', 'Drinks and beverages'),
('Vegetarian', 'Plant-based options'),
('Vegan', 'Fully vegan options');

-- Insert Menu Items
INSERT INTO menu_items (category_id, name, description, price, image, is_vegetarian, is_vegan, is_available) VALUES

-- Appetizers
(1, 'Spring Rolls', 'Crispy spring rolls with sweet dipping sauce', 5.99, 'https://via.placeholder.com/300x200?text=Spring+Rolls', 1, 1, 1),
(1, 'Bruschetta', 'Toasted bread with tomato and basil', 6.99, 'https://via.placeholder.com/300x200?text=Bruschetta', 1, 1, 1),
(1, 'Chicken Wings', 'Spicy buffalo wings with ranch dip', 7.99, 'https://via.placeholder.com/300x200?text=Chicken+Wings', 0, 0, 1),
(1, 'Shrimp Appetizer', 'Garlic shrimp skewers', 8.99, 'https://via.placeholder.com/300x200?text=Shrimp+Appetizer', 0, 0, 1),

-- Main Courses
(2, 'Grilled Salmon', 'Fresh salmon fillet with lemon butter', 18.99, 'https://via.placeholder.com/300x200?text=Grilled+Salmon', 0, 0, 1),
(2, 'Ribeye Steak', 'Prime cut steak with herb butter', 24.99, 'https://via.placeholder.com/300x200?text=Ribeye+Steak', 0, 0, 1),
(2, 'Chicken Parmesan', 'Breaded chicken with marinara and cheese', 14.99, 'https://via.placeholder.com/300x200?text=Chicken+Parmesan', 0, 0, 1),
(2, 'Vegetable Stir Fry', 'Mixed vegetables with rice', 12.99, 'https://via.placeholder.com/300x200?text=Vegetable+Stir+Fry', 1, 1, 1),

-- Desserts
(3, 'Chocolate Cake', 'Rich chocolate layer cake', 5.99, 'https://via.placeholder.com/300x200?text=Chocolate+Cake', 1, 0, 1),
(3, 'Cheesecake', 'Classic New York cheesecake', 6.99, 'https://via.placeholder.com/300x200?text=Cheesecake', 1, 0, 1),
(3, 'Fruit Salad', 'Fresh mixed fruit salad', 4.99, 'https://via.placeholder.com/300x200?text=Fruit+Salad', 1, 1, 1),
(3, 'Ice Cream Sundae', 'Vanilla ice cream with toppings', 4.99, 'https://via.placeholder.com/300x200?text=Ice+Cream+Sundae', 1, 0, 1),

-- Beverages
(4, 'Coffee', 'Freshly brewed coffee', 2.99, 'https://via.placeholder.com/300x200?text=Coffee', 1, 1, 1),
(4, 'Orange Juice', 'Fresh squeezed orange juice', 3.99, 'https://via.placeholder.com/300x200?text=Orange+Juice', 1, 1, 1),
(4, 'Soft Drink', 'Assorted sodas', 2.49, 'https://via.placeholder.com/300x200?text=Soft+Drink', 1, 1, 1),
(4, 'Iced Tea', 'Refreshing iced tea', 3.49, 'https://via.placeholder.com/300x200?text=Iced+Tea', 1, 1, 1),

-- Vegetarian Special
(5, 'Paneer Tikka', 'Indian cottage cheese with spices', 13.99, 'https://via.placeholder.com/300x200?text=Paneer+Tikka', 1, 0, 1),
(5, 'Buddha Bowl', 'Healthy bowl with quinoa and veggies', 11.99, 'https://via.placeholder.com/300x200?text=Buddha+Bowl', 1, 1, 1),
(5, 'Mushroom Risotto', 'Creamy risotto with mushrooms', 12.99, 'https://via.placeholder.com/300x200?text=Mushroom+Risotto', 1, 0, 1),

-- Vegan Special
(6, 'Vegan Burger', 'Plant-based burger with avocado', 10.99, 'https://via.placeholder.com/300x200?text=Vegan+Burger', 1, 1, 1),
(6, 'Tofu Pad Thai', 'Thai noodles with crispy tofu', 11.99, 'https://via.placeholder.com/300x200?text=Tofu+Pad+Thai', 1, 1, 1),
(6, 'Chickpea Curry', 'Aromatic curry with chickpeas', 10.99, 'https://via.placeholder.com/300x200?text=Chickpea+Curry', 1, 1, 1),

-- Biryani & Mandhi Specials (to match Home page showcase names)
-- Use existing categories: 2 = Main Courses, 5 = Vegetarian
(2, 'Hyderabadi Dum Biryani', 'Layered basmati rice, saffron, and slow-cooked chicken sealed in dum.', 499.00, '/images/hyderabadi-biryani.jpg', 0, 0, 1),
(2, 'Ambur Mutton Biryani', 'Short-grain seeraga samba rice with tender mutton and spice-laced broth.', 549.00, '/images/ambur-biryani.jpg', 0, 0, 1),
(5, 'Royal Veg Biryani', 'Seasonal vegetables tossed with caramelized onions and cashews.', 459.00, '/images/veg-biryani.jpg', 1, 0, 1),
(5, 'Paneer Tikka Biryani', 'Smoky paneer tikka cubes layered with fragrant rice and mint.', 479.00, '/images/paneer-biryani.jpg', 1, 0, 1),
(2, 'Smoked Chicken Mandhi', 'Yemeni-style mandi rice with charcoal-smoked chicken and roasted nuts.', 639.00, '/images/chicken-mandhi.jpg', 0, 0, 1),
(2, 'Mutton Mandhi', 'Tender mutton slow-cooked over pit fire, served atop spiced rice.', 699.00, '/images/mutton-mandhi.jpg', 0, 0, 1),
(2, 'Coastal Fish Mandhi', 'Coastal marinated fish, lemon zest, and light mandhi spices.', 619.00, '/images/fish-mandhi.jpg', 0, 0, 1),
(2, 'Family Mixed Mandhi', 'Chicken + mutton portions with generous toppings, perfect for gatherings.', 799.00, '/images/mixed-mandhi.jpg', 0, 0, 1);
