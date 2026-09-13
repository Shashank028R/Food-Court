# Food Court — Artisanal Restaurant & Epicurean Dining (MERN)

A full-stack, editorial restaurant menu, ordering, and management web application built with **Vite + React + JavaScript** on the frontend, and **Node.js + Express + MongoDB** on the backend.

---

## 🌟 Features Implemented

### 1. Grand Opening Animation & Aesthetics
- **Cinematic Entrance**: Ambient culinary crest and typography ("FOOD COURT — Culinary Excellence Since 2026"), animated quote, and an **"Enter Experience"** button (with session caching and replay capability from the footer).
- **Editorial Brand Palette**:
  - Warm White base: `#FBF9F6`
  - Deep Terracotta: `#B3492B`
  - Antique Gold: `#C9A227`
  - Charcoal: `#1C1917`
  - Muted Olive: `#5B6E3A`
- **Typography**: Google Fonts `Fraunces` (warm editorial display serif) and `Inter` (UI sans-serif).

### 2. Public Landing Page (`/`)
- **Header Navigation**: Sticky blur bar with dynamic site wordmark/logo, nav links, live cart badge, mobile drawer, and quick admin portal link.
- **Hero Slider**: Full-bleed rotating carousel (~5s auto-advance) displaying curated food photography, manual prev/next arrow controls, dot indicators, touch swipe support, and "Explore Full Menu" CTA.
- **Today's Special**: Highlighted showcase with antique gold badges and dish profiles for head chef daily selections.
- **Most Popular**: Grid of chef-curated dishes with dietary tags (veg / non-veg) and spice level indicators.
- **Browse by Category**: Visual cards deep-linking to pre-filtered categories in the menu.
- **Our Story & Wood-Fired Philosophy**: Editorial culinary spread detailing the kitchen's heritage and pantry standards.
- **Tasting Catalog Preview & Footer**: Complete contact information, dining hours, location, and copyright.

### 3. Full Interactive Menu (`/menu`)
- **Sticky Filter Toolbar**: "All Courses" plus dynamic categories (`/api/categories`).
- **Debounced Live Search**: Real-time search by dish name and ingredients calling the backend API.
- **Dietary & Spice Filters**: Toggle Vegetarian Only, Non-Veg, and Spice Level (Mild, Medium, Hot).
- **Dish Detail Modal**: High-res image, full ingredient description, calories, preparation time, quantity stepper, and instant add-to-order.
- **Empty State**: Custom on-brand empty filter message with a one-click reset.

### 4. Shopping Cart & Ordering Flow
- **Slide-out Cart Drawer**: Itemized order list, thumbnail, unit price, quantity steppers (+/-), item removal, and subtotal calculation.
- **Persistent Storage**: Cart persists across page reloads in `localStorage`.
- **Checkout Modal**: Pre-fills customer name, contact phone, and delivery address from verified user accounts.
- **Order Placement**: Creates real MongoDB `Order` documents and fires celebratory confetti on confirmation.

### 5. Customer Accounts (`/account`, `/login`, `/signup`)
- **JWT Authentication**: Secured with httpOnly cookie sessions and bcrypt password hashing.
- **User Profile**: Edit name, phone number, and default delivery address.
- **Dining Order History**: View previous orders, timestamps, order reference IDs, item summaries, and preparation status.

### 6. Protected Admin Dashboard (`/admin`)
- **Role-Based Security**: Secured by backend `protect` and `isAdmin` middleware.
- **Overview Metrics**: Total dishes, categories, specials count, and order revenue.
- **Food Items CRUD**: Add and edit dishes, delete with confirmation modal, and quick one-click toggle switches for `Today's Special`, `Most Popular`, and `In Stock`.
- **Category Manager**: Create, rename, reorder, and delete categories with associated dish warnings.
- **Site Brand & Settings**: Update restaurant name, tagline, opening hours, contact details, manage hero carousel slides, and upload logos directly to **Cloudinary**.
- **Live Order Management**: Track incoming customer orders and update preparation status (`CONFIRMED`, `PREPARING`, `OUT_FOR_DELIVERY`, `DELIVERED`).

---

## 🚀 Quick Start & Development

### 1. Install Dependencies
Run from the project root:
```bash
npm run install:all
```
*(Or `npm install` inside `/server` and `/client`)*

### 2. Configure Environment Variables
The server is already configured with your MongoDB Atlas database and Cloudinary keys in `/server/.env`:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://...
JWT_SECRET=food_court_super_secret_jwt_key_2026_restaurant
CLOUDINARY_CLOUD_NAME=dojrorkrb
CLOUDINARY_API_KEY=824473823911251
CLOUDINARY_API_SECRET=F8g24Vs1kXO74JVCKE8Yl6_N8Y8
```

### 3. Seed the Database
To populate or refresh sample dishes, categories, settings, and users:
```bash
npm run seed
```

### 4. Run Locally
To run both the Express backend and the Vite frontend concurrently:
```bash
npm run dev
```
- **Client**: `http://localhost:5173`
- **Server API**: `http://localhost:5000/api`

---

## 🔑 Default Login Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| **Administrator** | `admin@foodcourt.com` | `Admin@12345` | Full access to `/admin` dashboard, food CRUD, settings & orders |
| **Customer Demo** | `alexander@example.com` | `Customer@123` | Customer account, cart checkout, profile, order history |

*Note: The login page also features quick one-click test buttons to fill these credentials automatically.*

---

## 📁 Project Structure

```
Food Court (Monorepo Root)
├── client/                     # Frontend (Vite + React + JavaScript + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── site/           # Header, Footer, HeroSlider, FoodCard, CategoryTile, CartDrawer, DishModal, CheckoutModal
│   │   │   └── ui/             # OpeningIntro, Badge
│   │   ├── context/            # AuthContext, CartContext, ToastContext
│   │   ├── lib/                # api.js (central fetch client)
│   │   ├── pages/              # LandingPage, MenuPage, LoginPage, SignupPage, AccountPage, AdminDashboard, NotFoundPage
│   │   ├── App.jsx             # Main Router & layouts
│   │   ├── index.css           # Custom scrollbar, animations & Tailwind directives
│   │   └── main.jsx
│   ├── index.html              # Typography & Favicon setup
│   ├── tailwind.config.js      # Palette and styling tokens
│   └── package.json
├── server/                     # Backend (Node.js + Express + Mongoose)
│   ├── src/
│   │   ├── config/             # db.js (MongoDB Atlas), cloudinary.js
│   │   ├── controllers/        # auth, food, category, order, settings controllers
│   │   ├── middleware/         # auth (protect, isAdmin), upload (multer + Cloudinary stream)
│   │   ├── models/             # Category, FoodItem, User, Order, SiteSettings
│   │   ├── routes/             # REST endpoints
│   │   ├── seed.js             # 17 dishes seed data
│   │   └── server.js           # Express setup, helmet, CORS, rate limiting
│   ├── .env                    # Cloudinary & Atlas credentials
│   └── package.json
├── package.json                # Concurrently dev runner
└── README.md
```

---

## 🛠 Production Build & Deployment

To build the client bundle:
```bash
npm run build
```
The optimized bundle is generated in `client/dist`. When `NODE_ENV=production`, the Express server automatically serves the static assets and routes all non-API paths to `index.html`.
