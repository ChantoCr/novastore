-- NOTE:
-- The password hashes below are placeholders.
-- Replace them with real bcrypt hashes before testing full authentication flows.

INSERT INTO roles (name, description)
VALUES
  ('admin', 'Administrator with access to dashboard and management features'),
  ('user', 'Regular shopper account');

INSERT INTO users (name, email, password_hash, is_active)
VALUES
  ('NOVA Admin', 'admin@novastore.dev', 'TEMP_BCRYPT_HASH_REPLACE_ME_ADMIN', 1),
  ('NOVA User', 'user@novastore.dev', 'TEMP_BCRYPT_HASH_REPLACE_ME_USER', 1);

INSERT INTO user_roles (user_id, role_id)
VALUES
  (1, 1),
  (2, 2);

INSERT INTO categories (name, slug, description)
VALUES
  ('Electronics', 'electronics', 'Devices, accessories, and desk setups'),
  ('Fashion', 'fashion', 'Modern essentials and stylish everyday wear'),
  ('Home', 'home', 'Decor, productivity, and smart-living accessories'),
  ('Gaming', 'gaming', 'Gear for immersive gaming experiences');

INSERT INTO products (
  category_id,
  name,
  slug,
  sku,
  description,
  price,
  compare_at_price,
  stock,
  low_stock_threshold,
  is_active
)
VALUES
  (1, 'Aurora Wireless Headphones', 'aurora-wireless-headphones', 'NOVA-EL-001', 'Premium over-ear headphones with active noise cancellation.', 129.99, 159.99, 24, 5, 1),
  (1, 'Nebula Mechanical Keyboard', 'nebula-mechanical-keyboard', 'NOVA-EL-002', 'Hot-swappable mechanical keyboard designed for work and gaming.', 94.50, 119.00, 14, 4, 1),
  (4, 'Pulse RGB Gaming Mouse', 'pulse-rgb-gaming-mouse', 'NOVA-GM-001', 'Lightweight gaming mouse with programmable buttons and RGB lighting.', 49.90, 65.00, 35, 8, 1),
  (3, 'Orbit Smart Desk Lamp', 'orbit-smart-desk-lamp', 'NOVA-HM-001', 'Minimal smart desk lamp with adjustable warmth and brightness.', 58.00, NULL, 10, 3, 1),
  (2, 'Nova Essential Hoodie', 'nova-essential-hoodie', 'NOVA-FS-001', 'Soft premium hoodie with a clean modern fit.', 72.00, 89.00, 18, 5, 1);

INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order)
VALUES
  (1, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', 'Aurora Wireless Headphones', 1, 1),
  (2, 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae', 'Nebula Mechanical Keyboard', 1, 1),
  (3, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7', 'Pulse RGB Gaming Mouse', 1, 1),
  (4, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c', 'Orbit Smart Desk Lamp', 1, 1),
  (5, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 'Nova Essential Hoodie', 1, 1);

INSERT INTO coupons (
  code,
  discount_type,
  discount_value,
  min_purchase_amount,
  usage_limit,
  used_count,
  starts_at,
  expires_at,
  is_active
)
VALUES
  ('WELCOME10', 'percentage', 10.00, 50.00, 500, 1, NOW(), DATE_ADD(NOW(), INTERVAL 90 DAY), 1),
  ('SAVE25', 'fixed', 25.00, 150.00, 100, 0, NOW(), DATE_ADD(NOW(), INTERVAL 45 DAY), 1);

INSERT INTO orders (
  user_id,
  coupon_id,
  status,
  subtotal,
  discount_total,
  tax_total,
  total,
  payment_status,
  shipping_address,
  billing_address,
  notes
)
VALUES
  (
    2,
    1,
    'paid',
    179.89,
    17.99,
    12.95,
    174.85,
    'approved',
    JSON_OBJECT('full_name', 'NOVA User', 'country', 'Demo Country', 'city', 'Demo City', 'line1', '123 Portfolio Street'),
    JSON_OBJECT('full_name', 'NOVA User', 'country', 'Demo Country', 'city', 'Demo City', 'line1', '123 Portfolio Street'),
    'Sample seeded order for local development.'
  );

INSERT INTO order_items (
  order_id,
  product_id,
  product_name_snapshot,
  product_sku_snapshot,
  unit_price,
  quantity,
  line_total
)
VALUES
  (1, 1, 'Aurora Wireless Headphones', 'NOVA-EL-001', 129.99, 1, 129.99),
  (1, 3, 'Pulse RGB Gaming Mouse', 'NOVA-GM-001', 49.90, 1, 49.90);

INSERT INTO payments_simulated (
  order_id,
  provider_reference,
  status,
  amount,
  currency,
  simulated_card_last4,
  response_payload,
  processed_at
)
VALUES
  (
    1,
    'SIM-PAY-0001',
    'approved',
    174.85,
    'USD',
    '4242',
    JSON_OBJECT('gateway', 'simulated', 'result', 'approved', 'message', 'Demo payment approved'),
    NOW()
  );

INSERT INTO coupon_usages (coupon_id, user_id, order_id, discount_amount)
VALUES
  (1, 2, 1, 17.99);

INSERT INTO wishlist_items (user_id, product_id)
VALUES
  (2, 2),
  (2, 4);

INSERT INTO reviews (user_id, product_id, rating, title, comment, is_visible)
VALUES
  (2, 1, 5, 'Excellent audio and comfort', 'Great quality for a portfolio demo product. Clean design and strong sound.', 1);

INSERT INTO notifications (user_id, type, title, message, metadata)
VALUES
  (
    2,
    'order',
    'Order approved',
    'Your sample order #1 was approved successfully.',
    JSON_OBJECT('order_id', 1, 'status', 'approved')
  ),
  (
    1,
    'stock',
    'Low stock warning',
    'Orbit Smart Desk Lamp is approaching its low stock threshold.',
    JSON_OBJECT('product_id', 4, 'stock', 10, 'threshold', 3)
  );

INSERT INTO audit_logs (admin_user_id, action, entity_type, entity_id, old_value, new_value, ip_address, user_agent)
VALUES
  (
    1,
    'product_created',
    'product',
    1,
    NULL,
    JSON_OBJECT('name', 'Aurora Wireless Headphones', 'price', 129.99, 'stock', 24),
    '127.0.0.1',
    'seed-script'
  ),
  (
    1,
    'coupon_created',
    'coupon',
    1,
    NULL,
    JSON_OBJECT('code', 'WELCOME10', 'discount_type', 'percentage', 'discount_value', 10),
    '127.0.0.1',
    'seed-script'
  );

INSERT INTO stock_movements (
  product_id,
  admin_user_id,
  movement_type,
  quantity_change,
  previous_stock,
  new_stock,
  reason
)
VALUES
  (1, 1, 'restock', 24, 0, 24, 'Initial catalog stock load'),
  (3, 1, 'sale', -1, 36, 35, 'Seeded order #1 sale adjustment'),
  (4, 1, 'restock', 10, 0, 10, 'Initial catalog stock load');
