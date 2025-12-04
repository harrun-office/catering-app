-- Clear existing menu items
DELETE FROM menu_items;

-- Insert all menu items
INSERT INTO menu_items 
(id, category_id, name, description, price, image, servings, preparation_time,
 is_vegetarian, is_vegan, is_gluten_free, rating, total_ratings, is_available,
 created_at, updated_at)
VALUES
(1, 1, 'Spring Roll', 'Crispy spring rolls with sweet dipping sauce', 50.00, 'https://via.placeholder.com/300x200?text=Spring+Rolls', 1, 1, 0, 0, 0, 0.0, 0, 1, '2025-11-26 15:25:43', '2025-12-01 12:02:10'),
(2, 1, 'Bruschetta', 'Toasted bread with tomato and basil', 280.00, 'https://via.placeholder.com/300x200?text=Bruschetta', 1, 1, 0, 0, 0, 0.0, 0, 1, '2025-11-26 15:25:43', '2025-12-03 12:12:44'),
(3, 1, 'Chicken Wings', 'Spicy buffalo wings with ranch dip', 350.00, 'https://via.placeholder.com/300x200?text=Chicken+Wings', 0, 0, 0, 0, 0, 0.0, 0, 1, '2025-11-26 15:25:43', '2025-12-03 12:12:44'),
(4, 1, 'Shrimp Appetizer', 'Garlic shrimp skewers', 450.00, 'https://via.placeholder.com/300x200?text=Shrimp+Appetizer', 0, 0, 0, 0, 0, 0.0, 0, 1, '2025-11-26 15:25:43', '2025-12-03 12:12:44'),
(5, 2, 'Grilled Salmon', 'Fresh salmon fillet with lemon butter', 1450.00, 'https://via.placeholder.com/300x200?text=Grilled+Salmon', 0, 0, 0, 0, 0, 0.0, 0, 1, '2025-11-26 15:25:43', '2025-12-03 12:12:44'),
(6, 2, 'Ribeye Steak', 'Prime cut steak with herb butter', 1800.00, 'https://via.placeholder.com/300x200?text=Ribeye+Steak', 0, 0, 0, 0, 0, 0.0, 0, 1, '2025-11-26 15:25:43', '2025-12-03 12:12:44'),
(7, 2, 'Chicken Parmesan', 'Breaded chicken with marinara and cheese', 650.00, 'https://via.placeholder.com/300x200?text=Chicken+Parmesan', 0, 0, 0, 0, 0, 0.0, 0, 1, '2025-11-26 15:25:43', '2025-12-03 12:12:44'),
(8, 2, 'Vegetable Stir Fry', 'Mixed vegetables with rice', 450.00, 'https://via.placeholder.com/300x200?text=Vegetable+Stir+Fry', 1, 1, 0, 0, 0, 0.0, 0, 1, '2025-11-26 15:25:43', '2025-12-03 12:12:44'),
(9, 3, 'Chocolate Cake', 'Rich chocolate layer cake', 250.00, 'https://via.placeholder.com/300x200?text=Chocolate+Cake', 1, 0, 0, 0, 0, 0.0, 0, 1, '2025-11-26 15:25:43', '2025-12-03 12:12:44'),
(10, 3, 'Cheesecake', 'Classic New York cheesecake', 300.00, 'https://via.placeholder.com/300x200?text=Cheesecake', 1, 0, 0, 0, 0, 0.0, 0, 1, '2025-11-26 15:25:43', '2025-12-03 12:12:44'),
(11, 3, 'Fruit Salad', 'Fresh mixed fruit salad', 200.00, 'https://via.placeholder.com/300x200?text=Fruit+Salad', 1, 1, 0, 0, 0, 0.0, 0, 1, '2025-11-26 15:25:43', '2025-12-03 12:12:44'),
(12, 3, 'Ice Cream Sundae', 'Vanilla ice cream with toppings', 180.00, 'https://via.placeholder.com/300x200?text=Ice+Cream+Sundae', 1, 0, 0, 0, 0, 0.0, 0, 1, '2025-11-26 15:25:43', '2025-12-03 12:12:44'),
(13, 4, 'Coffee', 'Freshly brewed coffee', 120.00, 'https://via.placeholder.com/300x200?text=Coffee', 1, 1, 0, 0, 0, 0.0, 0, 1, '2025-11-26 15:25:43', '2025-12-03 12:12:44'),
(14, 4, 'Orange Juice', 'Fresh squeezed orange juice', 150.00, 'https://via.placeholder.com/300x200?text=Orange+Juice', 1, 1, 0, 0, 0, 0.0, 0, 1, '2025-11-26 15:25:43', '2025-12-03 12:12:44'),
(15, 4, 'Soft Drink', 'Assorted sodas', 80.00, 'https://via.placeholder.com/300x200?text=Soft+Drink', 1, 1, 0, 0, 0, 0.0, 0, 1, '2025-11-26 15:25:43', '2025-12-03 12:12:44'),
(16, 4, 'Iced Tea', 'Refreshing iced tea', 120.00, 'https://via.placeholder.com/300x200?text=Iced+Tea', 1, 1, 0, 0, 0, 0.0, 0, 1, '2025-11-26 15:25:43', '2025-12-03 12:12:44'),
(17, 5, 'Paneer Tikka', 'Indian cottage cheese with spices', 380.00, 'https://via.placeholder.com/300x200?text=Paneer+Tikka', 1, 0, 0, 0, 0, 0.0, 0, 1, '2025-11-26 15:25:43', '2025-12-03 12:12:44'),
(18, 5, 'Buddha Bowl', 'Healthy bowl with quinoa and veggies', 420.00, 'https://via.placeholder.com/300x200?text=Buddha+Bowl', 1, 1, 0, 0, 0, 0.0, 0, 1, '2025-11-26 15:25:43', '2025-12-03 12:12:44'),
(19, 5, 'Mushroom Risotto', 'Creamy risotto with mushrooms', 480.00, 'https://via.placeholder.com/300x200?text=Mushroom+Risotto', 1, 0, 0, 0, 0, 0.0, 0, 1, '2025-11-26 15:25:43', '2025-12-03 12:12:44'),
(20, 6, 'Vegan Burger', 'Plant-based burger with avocado', 350.00, 'https://via.placeholder.com/300x200?text=Vegan+Burger', 1, 1, 0, 0, 0, 0.0, 0, 1, '2025-11-26 15:25:43', '2025-12-03 12:12:44'),
(21, 6, 'Tofu Pad Thai', 'Thai noodles with crispy tofu', 400.00, 'https://via.placeholder.com/300x200?text=Tofu+Pad+Thai', 1, 1, 0, 0, 0, 0.0, 0, 1, '2025-11-26 15:25:43', '2025-12-03 12:12:44'),
(22, 6, 'Chickpea Curry', 'Aromatic curry with chickpeas', 320.00, 'https://via.placeholder.com/300x200?text=Chickpea+Curry', 1, 1, 0, 0, 0, 0.0, 0, 1, '2025-11-26 15:25:43', '2025-12-03 12:12:44'),
(23, 3, 'Choco Pie', 'An biscuit dipped by chocolate lava', 30.00, '/uploads/images/1764570850911-choco-pie.jpg', 0, 0, 0, 0, 0, 0.0, 0, 1, '2025-12-01 12:04:10', '2025-12-01 12:04:10'),
(24, 5, 'Mutton Mandhi', 'Tender mutton slow-cooked over pit fire, served atop spiced rice with roasted nuts', 699.00, '/uploads/images/mutton-mandhi.jpg', 5, 90, 0, 0, 0, 4.9, 10, 1, '2025-12-02 12:00:00', '2025-12-02 12:00:00'),
(25, 5, 'Smoked Chicken Mandhi', 'Yemeni-style mandi rice with charcoal-smoked chicken and roasted nuts', 639.00, '/uploads/images/chicken-mandhi.jpg', 5, 75, 0, 0, 0, 4.8, 18, 1, '2025-12-02 12:00:00', '2025-12-02 12:00:00'),
(26, 5, 'Coastal Fish Mandhi', 'Coastal marinated fish on aromatic mandi rice with lemon zest', 619.00, '/uploads/images/fish-mandhi.jpg', 5, 65, 0, 0, 0, 4.6, 7, 1, '2025-12-02 12:00:00', '2025-12-02 12:00:00'),
(27, 5, 'Hyderabadi Dum Biryani', 'Layered basmati rice, saffron, and slow-cooked chicken sealed in dum', 499.00, '/uploads/images/hyderabadi-biryani.jpg', 4, 60, 0, 0, 0, 4.9, 45, 1, '2025-12-02 12:00:00', '2025-12-02 12:00:00'),
(28, 5, 'Ambur Mutton Biryani', 'Short-grain seeraga samba rice with tender mutton and spice-laced broth', 549.00, '/uploads/images/ambur-biryani.jpg', 4, 70, 0, 0, 0, 4.8, 22, 1, '2025-12-02 12:00:00', '2025-12-02 12:00:00'),
(29, 5, 'Royal Veg Biryani', 'Seasonal vegetables tossed with caramelized onions and cashews', 459.00, '/uploads/images/veg-biryani.jpg', 4, 55, 1, 1, 0, 4.7, 14, 1, '2025-12-02 12:00:00', '2025-12-02 12:00:00'),
(30, 5, 'Mixed Mandhi', 'Flavoured rice with all type of meet with the mixture of masalas', 2199.00, '/uploads/images/mixed-mandhi.jpg', 5, 65, 0, 0, 0, 4.6, 7, 1, '2025-12-02 12:00:00', '2025-12-02 12:00:00'),
(31, 5, 'panner tikka Biryani', 'Panner with Seasonal vegetables tossed with caramelized onions and cashews', 799.00, '/uploads/images/paneer-biryani.jpg', 4, 55, 1, 1, 0, 4.7, 14, 1, '2025-12-02 12:00:00', '2025-12-02 12:00:00');

-- Verify the insert
SELECT COUNT(*) as total_items FROM menu_items;
