INSERT INTO products (
	name, description, category, price, image_url, stock_quantity, unit, is_available, specifications, created_at, updated_at
)
SELECT
	'Premium Cocopeat 5kg Block',
	'High-compression cocopeat block for hydroponics and nurseries.',
	'COCOPEAT',
	4.80,
	'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1400&q=80',
	1200,
	'block',
	b'1',
	'Low EC, washed, pH balanced, ideal water retention.',
	NOW(6),
	NOW(6)
FROM DUAL
WHERE NOT EXISTS (
	SELECT 1 FROM products WHERE name = 'Premium Cocopeat 5kg Block'
);

INSERT INTO products (
	name, description, category, price, image_url, stock_quantity, unit, is_available, specifications, created_at, updated_at
)
SELECT
	'Coir Grow Bag 100x18x15cm',
	'Buffered coir grow bag ready for greenhouse cultivation.',
	'GROW_BAGS',
	2.90,
	'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1400&q=80',
	2500,
	'bag',
	b'1',
	'Pre-cut holes, UV stable sleeve, export quality.',
	NOW(6),
	NOW(6)
FROM DUAL
WHERE NOT EXISTS (
	SELECT 1 FROM products WHERE name = 'Coir Grow Bag 100x18x15cm'
);

INSERT INTO products (
	name, description, category, price, image_url, stock_quantity, unit, is_available, specifications, created_at, updated_at
)
SELECT
	'Bristle Coir Fiber Bale',
	'Long-fiber coir for brushes, ropes, and erosion-control applications.',
	'FIBER',
	185.00,
	'https://images.unsplash.com/photo-1616628182509-6f08d0f9f4ef?auto=format&fit=crop&w=1400&q=80',
	300,
	'bale',
	b'1',
	'Moisture below 18 percent, high tensile strength.',
	NOW(6),
	NOW(6)
FROM DUAL
WHERE NOT EXISTS (
	SELECT 1 FROM products WHERE name = 'Bristle Coir Fiber Bale'
);

INSERT INTO products (
	name, description, category, price, image_url, stock_quantity, unit, is_available, specifications, created_at, updated_at
)
SELECT
	'Coir Geotextile 700gsm Roll',
	'Biodegradable erosion-control netting for slopes and embankments.',
	'GEOTEXTILES',
	92.00,
	'https://images.unsplash.com/photo-1599707254554-027aeb4deacd?auto=format&fit=crop&w=1400&q=80',
	180,
	'roll',
	b'1',
	'Open weave, UV resistant, easy anchoring.',
	NOW(6),
	NOW(6)
FROM DUAL
WHERE NOT EXISTS (
	SELECT 1 FROM products WHERE name = 'Coir Geotextile 700gsm Roll'
);

INSERT INTO products (
	name, description, category, price, image_url, stock_quantity, unit, is_available, specifications, created_at, updated_at
)
SELECT
	'Twisted Coir Rope 12mm',
	'Natural twisted coir rope for marine, landscaping, and decorative use.',
	'ROPE',
	1.35,
	'https://images.unsplash.com/photo-1563396983906-b3795482a59a?auto=format&fit=crop&w=1400&q=80',
	8000,
	'meter',
	b'1',
	'High durability, natural look, eco-friendly.',
	NOW(6),
	NOW(6)
FROM DUAL
WHERE NOT EXISTS (
	SELECT 1 FROM products WHERE name = 'Twisted Coir Rope 12mm'
);

INSERT INTO custom_catalog_products (
	name, short_description, image_url, is_active, display_order, created_at, updated_at
)
SELECT
	'Coir Mats',
	'Braided entry and welcome mats for retail and export.',
	'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1400&q=80',
	b'1',
	1,
	NOW(6),
	NOW(6)
FROM DUAL
WHERE NOT EXISTS (
	SELECT 1 FROM custom_catalog_products WHERE name = 'Coir Mats'
);

INSERT INTO custom_catalog_products (
	name, short_description, image_url, is_active, display_order, created_at, updated_at
)
SELECT
	'Coir Bags',
	'Handwoven utility and fashion bags with brand customization.',
	'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1400&q=80',
	b'1',
	2,
	NOW(6),
	NOW(6)
FROM DUAL
WHERE NOT EXISTS (
	SELECT 1 FROM custom_catalog_products WHERE name = 'Coir Bags'
);

INSERT INTO custom_catalog_products (
	name, short_description, image_url, is_active, display_order, created_at, updated_at
)
SELECT
	'Coir Baskets',
	'Custom storage and gift baskets for bulk orders.',
	'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1400&q=80',
	b'1',
	3,
	NOW(6),
	NOW(6)
FROM DUAL
WHERE NOT EXISTS (
	SELECT 1 FROM custom_catalog_products WHERE name = 'Coir Baskets'
);

INSERT INTO custom_catalog_products (
	name, short_description, image_url, is_active, display_order, created_at, updated_at
)
SELECT
	'Coir Wall Art',
	'Bespoke decorative wall panels and craft pieces made with coir.',
	'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1400&q=80',
	b'1',
	4,
	NOW(6),
	NOW(6)
FROM DUAL
WHERE NOT EXISTS (
	SELECT 1 FROM custom_catalog_products WHERE name = 'Coir Wall Art'
);

INSERT INTO custom_inquiries (
    order_number, customer_name, email, phone, country, product_type, color, size, design_name, quantity, special_notes, calculated_price, budget_range, target_delivery_date, reference_images, status, created_at, updated_at
)
SELECT
    'CUST-1001', 'Alice Smith', 'alice@example.com', '+1234567890', 'USA', 'Coir Mats', 'Natural', 'Large', 'Welcome Sign Design', 100, 'Please include logo on the top right.', 1500.00, '$1,000 - $5,000', '2026-06-01', NULL, 'NEW', NOW(6), NOW(6)
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM custom_inquiries WHERE order_number = 'CUST-1001'
);

INSERT INTO custom_inquiries (
    order_number, customer_name, email, phone, country, product_type, color, size, design_name, quantity, special_notes, calculated_price, budget_range, target_delivery_date, reference_images, status, created_at, updated_at
)
SELECT
    'CUST-1002', 'Bob Johnson', 'bob@example.com', '+0987654321', 'UK', 'Coir Bags', 'Brown', 'Medium', 'Eco Tote', 500, 'Double stitching needed.', 2500.00, '$1,000 - $5,000', '2026-07-15', NULL, 'IN_PRODUCTION', NOW(6), NOW(6)
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM custom_inquiries WHERE order_number = 'CUST-1002'
);

INSERT INTO custom_inquiries (
    order_number, customer_name, email, phone, country, product_type, color, size, design_name, quantity, special_notes, calculated_price, budget_range, target_delivery_date, reference_images, status, created_at, updated_at
)
SELECT
    'CUST-1003', 'Charlie Davis', 'charlie@example.com', '+1122334455', 'Australia', 'Coir Wall Art', 'Custom', 'Extra Large', 'Sunrise Pattern', 50, 'Using vibrant custom colored fibers.', 500.00, 'Under $1,000', '2026-08-10', NULL, 'QUOTED', NOW(6), NOW(6)
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM custom_inquiries WHERE order_number = 'CUST-1003'
);

