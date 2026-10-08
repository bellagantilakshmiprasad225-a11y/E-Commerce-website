-- Seed Data for Aura Store (30 Products in INR: Price Range ₹999 to ₹4999)
USE ecommerce_db;

-- 1. Insert Categories
INSERT INTO Categories (category_id, name) VALUES
(1, 'Electronic Devices'),
(2, 'Apparel & Clothing'),
(3, 'Footwear & Shoes'),
(4, 'Wearables & Accessories'),
(5, 'Smart Home & Lighting');

-- 2. Insert 30 Products (All prices strictly between ₹999.00 and ₹4999.00)
INSERT INTO Products (product_id, category_id, name, description, price, stock, image_url) VALUES
-- Category 1: Electronic Devices (1-8)
(1, 1, 'Aether Pro Wireless Headphones', 'Active noise cancellation, 40-hour battery life, spatial audio with memory foam earcups.', 4999.00, 15, '/images/wireless_headphones.jpg'),
(2, 1, 'Nebula RGB Mechanical Keyboard', 'Custom tactile mechanical switches, hot-swappable PCB, aircraft-grade aluminum frame.', 3999.00, 30, '/images/mechanical_keyboard.jpg'),
(3, 1, 'Pulse Pods Pro Wireless Earbuds', 'True wireless earbuds with transparency mode, IPX7 water resistance, and wireless charging case.', 2999.00, 45, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80'),
(4, 1, 'Precision Ergonomic Wireless Mouse', 'High precision 16,000 DPI sensor, silent click switches, programmable thumb buttons, dual 2.4G/Bluetooth.', 1999.00, 28, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80'),
(5, 1, 'UltraView Full HD Desk Monitor', 'IPS panel with 99% sRGB coverage, HDMI/VGA dual inputs, flicker-free eye care technology.', 4899.00, 12, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80'),
(6, 1, 'SonicBoom Portable Bluetooth Speaker', 'High-fidelity 360-degree room-filling sound, IP67 waterproof rating, 24-hour battery life.', 2499.00, 35, 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80'),
(7, 1, 'OmniStream HD Webcam & Mic', 'Full HD 1080p video resolution, dual noise-canceling stereo microphones, auto-light balance.', 1799.00, 20, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80'),
(8, 1, 'AeroDrive 512GB Portable SSD', 'Fast 1050MB/s transfer speed, shock-resistant compact aluminum casing, USB 3.2 support.', 3499.00, 40, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80'),

-- Category 2: Apparel & Clothing (9-18)
(9, 2, 'Tailored Italian Wool Oxford Shirt', '100% long-staple Egyptian cotton shirt with soft button-down collar and regular fit.', 1899.00, 25, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80'),
(10, 2, 'Heritage Raw Denim Trucker Jacket', 'Classic heavy-duty indigo denim jacket with reinforced brass hardware and tailored silhouette.', 3999.00, 18, 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80'),
(11, 2, 'Cashmere Touch Crewneck Sweater', 'Ultra-soft fine gauge knit sweater crafted from sustainable merino wool blend.', 2799.00, 22, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80'),
(12, 2, 'Minimalist Linen Everyday Casual Shirt', 'Breathable relaxed-fit linen shirt perfect for summer and casual formal gatherings.', 1499.00, 30, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80'),
(13, 2, 'Faux Leather Casual Biker Jacket', 'Handcrafted synthetic leather jacket with asymmetrical zip closure and soft lining.', 4499.00, 8, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80'),
(14, 2, 'Urban Heavyweight Fleece Hoodie', '400 GSM premium cotton fleece hoodie with double-lined hood and kangaroo pouch.', 1999.00, 40, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80'),
(15, 2, 'Slim Fit Stretch Chino Trousers', 'Modern stretch twill chinos with stain-resistant treatment and ergonomic tapered leg.', 1699.00, 35, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop&q=80'),
(16, 2, 'Classic Single-Breasted Blazer', 'Structured navy blazer with peak lapels, tortoise buttons, and breathable lining.', 4299.00, 14, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80'),
(17, 2, 'All-Weather Lightweight Puffer Jacket', 'Waterproof windproof insulated puffer jacket with detachable hood.', 3799.00, 16, 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=600&auto=format&fit=crop&q=80'),
(18, 2, 'Luxury Floral Print Summer Dress', 'Elegant flowy midi dress made with lightweight breathable rayon blend fabric.', 2299.00, 20, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80'),

-- Category 3: Footwear & Shoes (19-26)
(19, 3, 'Classic Genuine Leather Oxfords', 'Handcrafted dress shoes made with vegetable-tanned full grain calfskin leather.', 3999.00, 12, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop&q=80'),
(20, 3, 'Retro Leather Streetwear Sneakers', 'Classic low-top leather sneakers with cushioned orthotic insoles and rubber cupsole.', 2499.00, 32, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80'),
(21, 3, 'Trail Runner Pro Performance Shoes', 'Responsive foam cushioning, breathable mesh upper, and high-traction rubber outsole.', 3299.00, 24, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'),
(22, 3, 'Classic Handcrafted Suede Chelsea Boots', 'Genuine suede ankle boots with elastic side gores and stacked leather heel.', 4699.00, 15, 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&auto=format&fit=crop&q=80'),
(23, 3, 'Modern Knit Slip-On Running Shoes', 'Ultra-lightweight sock-like stretch upper with responsive energy-returning midsole.', 1799.00, 40, 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80'),
(24, 3, 'Penny Leather Loafers with Tassel', 'Timeless leather slip-on loafers featuring moccasin toe stitch and rubber sole.', 3599.00, 18, 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80'),
(25, 3, 'Waterproof Trail Outdoor Boots', 'Ankle-high waterproof suede hiking boots with deep lug tread and memory foam footbed.', 3899.00, 20, 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=80'),
(26, 3, 'High-Top Canvas Casual Sneakers', 'Classic canvas sneakers with reinforced rubber toe cap and vulcanized rubber sole.', 1299.00, 50, 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&auto=format&fit=crop&q=80'),

-- Category 4: Wearables & Accessories (27-28)
(27, 4, 'Chronos Titan Fitness Smartwatch', 'Metal casing, AMOLED color display, heart rate & SpO2 tracking, 7-day battery life.', 3999.00, 22, '/images/smart_watch.jpg'),
(28, 4, 'Aura Minimalist Leather Wallet', 'RFID-blocking slim bi-fold wallet made with genuine top-grain leather.', 999.00, 60, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80'),

-- Category 5: Smart Home & Lighting (29-30)
(29, 5, 'Aura Smart Ambient Light Bar', 'RGBIC ambient lighting with music sync, app control, Alexa & Google Home compatibility.', 1999.00, 40, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80'),
(30, 5, 'EchoSphere Smart Speaker', 'High-fidelity 360-degree room-filling sound, built-in voice assistant, smart home hub.', 2999.00, 25, 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&auto=format&fit=crop&q=80');

-- 3. Insert Initial Orders
INSERT INTO Orders (order_id, customer_name, customer_email, order_date, total_amount) VALUES
(1001, 'Sophia Martinez', 'sophia.m@example.com', DATE_SUB(NOW(), INTERVAL 2 DAY), 9447.90),
(1002, 'David Chen', 'david.c@example.com', DATE_SUB(NOW(), INTERVAL 1 DAY), 4198.95),
(1003, 'Emma Watson', 'emma.w@example.com', NOW(), 11546.85);

-- 4. Insert Order Items
INSERT INTO Order_Items (order_item_id, order_id, product_id, quantity, unit_price) VALUES
(1, 1001, 1, 1, 4999.00),
(2, 1001, 2, 1, 3999.00),
(3, 1002, 27, 1, 3999.00),
(4, 1003, 3, 1, 2999.00),
(5, 1003, 4, 1, 1999.00),
(6, 1003, 29, 3, 1999.00);
