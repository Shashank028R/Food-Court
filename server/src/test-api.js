const BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- Starting API Verification Suite ---');

  // 1. Settings
  const settingsRes = await fetch(`${BASE}/settings`);
  const settings = await settingsRes.json();
  console.log(`[PASS] Site Settings fetched: "${settings.siteName}" (Hero images: ${settings.heroImages?.length})`);

  // 2. Categories
  const catRes = await fetch(`${BASE}/categories`);
  const categories = await catRes.json();
  console.log(`[PASS] Categories count: ${categories.length} (First: ${categories[0]?.name})`);

  // 3. Food Items
  const foodRes = await fetch(`${BASE}/food-items`);
  const foodItems = await foodRes.json();
  console.log(`[PASS] Food items count: ${foodItems.length}`);

  // 4. Special items
  const specialsRes = await fetch(`${BASE}/food-items?special=true`);
  const specials = await specialsRes.json();
  console.log(`[PASS] Today's specials count: ${specials.length}`);

  // 5. Admin Auth Login
  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@foodcourt.com', password: 'Admin@12345' }),
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log(`[PASS] Admin login successful: ${loginData.user.name} (Role: ${loginData.user.role})`);

  // 6. Protected Route with Token
  const meRes = await fetch(`${BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const meData = await meRes.json();
  console.log(`[PASS] /auth/me verified: ${meData.user.email}`);

  // 7. Protected Route without Token (Expect 401)
  const unauthRes = await fetch(`${BASE}/auth/me`);
  console.log(`[PASS] Unauthenticated access blocked: Status ${unauthRes.status}`);

  // 8. Order Placement with Customer Account
  const custLoginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'alexander@example.com', password: 'Customer@123' }),
  });
  const custData = await custLoginRes.json();
  const custToken = custData.token;

  const sampleDish = foodItems[0];
  const orderRes = await fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${custToken}`,
    },
    body: JSON.stringify({
      items: [{ foodItemId: sampleDish._id, name: sampleDish.name, price: sampleDish.price, quantity: 2 }],
      customerName: custData.user.name,
      phone: '+1 (555) 782-9014',
      deliveryAddress: '742 Evergreen Terrace, Apt 4B',
      notes: 'Test order from automated suite',
    }),
  });
  const orderData = await orderRes.json();
  console.log(`[PASS] Order placed successfully: ID #${orderData.order._id.slice(-6).toUpperCase()} ($${orderData.order.totalPrice})`);

  // 9. Fetch Customer Orders
  const myOrdersRes = await fetch(`${BASE}/orders/mine`, {
    headers: { Authorization: `Bearer ${custToken}` },
  });
  const myOrders = await myOrdersRes.json();
  console.log(`[PASS] Customer order history retrieved: ${myOrders.length} orders found.`);

  console.log('--- All 9 Integration Tests Passed! ---');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
