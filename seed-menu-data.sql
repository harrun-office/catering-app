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
(6, 'Chickpea Curry', 'Aromatic curry with chickpeas', 10.99, 'https://via.placeholder.com/300x200?text=Chickpea+Curry', 1, 1, 1);
