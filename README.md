# SACAR Mart

A modern, responsive e-commerce web application for **SACAR Mart**, powered by **Google Sheets** as a dynamic backend database via **Google Apps Script**. No traditional server or database is required — everything runs on static HTML/CSS/JS in the browser and a free Google Apps Script Web App as the API layer.

---

## ✨ Features

### Shopping Experience
- **Home Dashboard → All Categories → Category Page navigation** (see dedicated section below)
- Dynamic product catalog loaded live from a Google Sheet
- Category and sub-category browsing with sticky filter chips
- Sort by price (Low → High / High → Low) via a bottom sheet
- "Offer" filter to show only discounted products
- Live search across product name and SKU
- Product details modal with description, delivery policy tab, and related products
- Discount badges and strike-through original pricing
- Stock and buffer-aware availability (prevents overselling)
- Persistent shopping cart (stored in `localStorage`) with quantity +/- controls
- Slide-out cart drawer and full checkout flow with delivery zone & COD payment
- Reward points earned per order and tracked per customer

### Accounts
- Customer registration & login (phone + password based)
- Editable profile (name, email, address) with password change
- Session persistence via `localStorage`

### UI / UX
- **Light, Dark, and System (auto) themes** — professionally designed color palettes for both modes with consistent contrast, shadows, and hover states across buttons, cards, inputs, modals, and badges
- **Full English/Bangla language system** — every label, button, placeholder, toast message, and success/error message is translated; switching language updates the entire UI instantly with **no page reload**
- **English is the default language** on first visit; the last selected language is remembered for returning visitors
- Distinct **blue "+" / red "−" quantity buttons** with hover, active, and smooth transition effects, fully responsive on mobile and desktop
- Responsive **sticky footer** that always stays at the bottom of the page, even on pages with little content
- Product prices and the sort/offer controls only appear **after** products and categories have fully finished loading, avoiding a flash of incomplete UI
- Toast notification system for success/warning/error feedback
- Fully responsive layout for mobile, tablet, and desktop

---

## 📁 Folder Structure

```
sacarmart-main/
├── index.html   # Main application markup (all views, modals, drawers)
├── style.css    # All styling — theme variables, layout, components
├── script.js    # Application logic — data, cart, auth, language, rendering
├── Code.gs      # Google Apps Script backend (Web App API)
├── cursor.css   # Custom cursor styling
├── cursor.js    # Custom cursor behaviour
├── sw.js        # Service worker — caches static assets & images for fast repeat visits
└── README.md    # This file
```

There are no build steps or external frameworks — the project is plain HTML/CSS/JavaScript plus Font Awesome (via CDN).

---

## 🚀 Installation Guide

### 1. Frontend (the website itself)
1. Download/clone this folder.
2. Open `index.html` directly in a browser, **or** host the three files (`index.html`, `style.css`, `script.js`) on any static host (GitHub Pages, Netlify, Vercel, cPanel, etc.).
3. That's it — no `npm install`, no build step.

### 2. Backend (Google Sheets + Apps Script)
See the **Google Sheets / Apps Script Setup** section below to connect your own spreadsheet, or reuse the existing `WEB_APP_URL` already configured in `script.js` if you were given access to the existing backend.

---

## ⚙️ Configuration Guide

All frontend configuration lives at the top of `script.js`:

```js
const WEB_APP_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";
```

Replace this with your own deployed Apps Script Web App URL (see setup below) if you are connecting a new spreadsheet.

Other configurable values in `script.js`:
- `langData` — all English/Bangla text strings used across the site. Add new keys here (in **both** `bn` and `en`) whenever new UI text is introduced.
- Delivery charges (`60` inside zone / `150` outside zone) inside `updateCheckoutSummary()` and `submitCustomerOrder()`.

Theme colors are defined as CSS variables at the top of `style.css` inside `:root` (light theme) and `[data-theme="dark"]` (dark theme) — edit these to re-brand the site.

---

## 📊 Google Sheets / Apps Script Setup

The backend is a single **`Code.gs`** file deployed as a Google Apps Script Web App, talking to a Google Sheet with three tabs:

### Sheet: `products`
Header row (first row) defines the field names used as-is in the frontend, e.g.:
`sku | name | category | sub_category | price | discount_price | offer | points | Stock | Sales | Buffer | image_url | description`

**Optional column — `category_image`**: add this column to the `products` header row to show a proper thumbnail for each category (used on the Featured Categories cards and the All Categories page — see below). Put an image URL in this column for at least one product per category; if a category has no `category_image` set, a default placeholder icon is shown automatically instead of a broken image.

**Optional column — `buying_price`** *(v1.11)*: add this exact column name (lowercase, underscore — matches every other column) to the `products` header row to enable the Admin Product Editing system (see the dedicated section below). It holds the product's cost price and is **never shown to normal customers** — only to a logged-in Admin with Admin Editing Mode turned on.

**Optional column — `active`** *(Admin Dashboard System)*: add this column to soft-delete products without ever losing data. `TRUE` (or blank/missing) = shown on the site; `FALSE` = hidden everywhere, but the row and its SKU stay in the Sheet untouched — flip it back to `TRUE` (via the Sheet directly, or the Admin Edit popup's Advanced section) to restore it instantly. `getProducts` filters this server-side for performance, so hidden products never even reach the browser.

**Header naming rule**: every `products` sheet column name should be lowercase with underscores instead of spaces (`sku`, `name`, `category`, `sub_category`, `buying_price`, `price`, `discount_price`, `points`, `Stock`, `Buffer`, `image_url`, `description`, `category_image`, `best_selling`, `best_selling_priority`, `new_arrival`, `new_arrival_priority`, `category_priority`, ...). The app reads columns by header **name**, not position — so columns can be reordered freely, and new columns can be added anytime without touching any code (see the Admin Editing section below for how new columns show up automatically in Advanced Edit).

### Sheet: `Edit History` (auto-created)
Created automatically the first time an Admin saves a product edit, with columns:
`Date & Time | Admin ID | Product SKU | Product Name | Edited Field | Old Value | New Value`

One row is added per **changed field** per save (e.g. editing both Stock and Selling Price in one save creates two rows), so you always have a clear audit trail of who changed what, when, and from/to what value. Nothing needs to be created manually — just leave the sheet name available.

### Sheet: `users`
Column order (no header lookup — fixed by index):
`A: userId | B: name | C: phone | D: email | E: address | F: password | G: points | H: date_of_birth | I: gender | J: religion | K: wallet_balance | L: from_referral | M: to_referral | N: referral_income`

Columns H–N are optional — if a customer hasn't set them yet, the Profile page shows "Not Set" (or ৳0 for wallet/referral amounts). Add these columns to any existing sheet that predates this feature (nothing needs to be filled in; blank cells are handled gracefully). Column order must not change — new columns are always added at the end.

- **wallet_balance**: the customer's advance balance. This is **not** updated automatically by a recharge request — see `wallet_requests` below.
- **from_referral**: the `userId` of whoever referred this customer (set automatically at registration if they signed up via a referral link).
- **to_referral**: a comma-separated list of `userId`s this customer has referred (updated automatically when someone registers using their referral link).
- **referral_income**: intended to hold a formula (to be supplied later) calculating referral earnings. Read-only from the frontend's perspective — it's added into the customer's displayed Total Reward Points and Tier calculation everywhere they appear.

### Sheet: `wallet_requests` (auto-created)
When a customer submits a Recharge Balance request, this sheet is created automatically (if it doesn't already exist) with columns:
`Timestamp | Phone | Name | Method | Amount | TransactionID | Status`

Requests start as `Pending` and are **not** auto-approved on submission. An Admin reviews them from Profile → Admin Dashboard → **Wallet Request**; changing a request's status to **Approved** there automatically credits the amount to that customer's `wallet_balance` in the `users` sheet (only once — re-saving an already-Approved request does not double-credit). Setting it to `Rejected` or back to `Pending` does not touch the balance.

### Sheet: `orders`
Column order (16 columns):
`A: Order ID | B: Order Date (YYYY-MM-DD) | C: Order Time (24h HH:MM:SS) | D: Customer Name | E: Customer Phone | F: Order Source | G: Delivery Type | H: Payment Method | I: Delivery Address | J: Delivery Note | K: Transaction ID | L: Advance Amount | M: Delivery Charge | N: Grand Total | O: Status | P: Items Details`

- **Order Source** is currently always `Website`; reserved for future channels (Facebook, Messenger, WhatsApp, Admin Panel).
- **Delivery Type** is one of `Inside Subarnachar`, `Outside Subarnachar`, or `Pickup Order`.
- **Payment Method** is one of `Cash on Delivery`, `Online Payment`, or `Pickup Order`.
- Each field is written to its own column — the Delivery Address column contains only the address, with note/transaction/amount kept separate.
- Order Date/Time (and Date of Birth) are written with a leading `'` so Google Sheets stores them as plain text, not an auto-converted Date value — this avoids ISO timestamps (e.g. `2026-07-22T18:00:00.000Z`) leaking into the UI. Existing rows saved before this fix are read back safely too (auto-formatted defensively).
- If you already have an existing `orders` sheet from an older version, update its header row to match this new column order before new orders come in, so old and new rows stay aligned.

### Deploying the Apps Script
1. Open your Google Sheet → **Extensions → Apps Script**.
2. Paste the contents of `Code.gs` into the script editor.
3. Update `SPREADSHEET_ID` at the top of `Code.gs` with your spreadsheet's ID (from its URL).
4. Click **Deploy → New deployment → Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the deployment's Web App URL and paste it into `WEB_APP_URL` in `script.js`.

### API Actions
| Action | Method | Purpose |
|---|---|---|
| `getProducts` | GET | Fetch the full product catalog |
| `register` | POST | Create a new customer account (optionally records a referral via `referralCode`) |
| `login` | POST | Authenticate a customer |
| `placeOrder` | POST | Submit an order and update reward points (does **not** modify the customer's saved profile address) |
| `updateProfile` | POST | Update customer name/email/DOB/gender/religion and/or saved addresses |
| `changePassword` | POST | Change a customer's password |
| `getMyOrders` | POST | Fetch a customer's own order history (by phone) for the Profile dashboard |
| `getUserData` | POST | Re-fetch a customer's current profile fields (by phone) — the Sheet is the single source of truth for reward points, refreshed automatically on page load and after every order |
| `getWalletBalance` | POST | Fetch only the customer's current wallet balance (kept separate from `getUserData` so it's only called when the customer taps "View Balance") |
| `rechargeWallet` | POST | Log a customer's recharge request (payment method, amount, transaction ID) to `wallet_requests` for manual verification |
| `verifyPassword` | POST | Re-verify a logged-in customer's current password without changing it (used to unlock Admin Editing Mode) |
| `updateProduct` | POST | Admin-only: update one or more editable fields on a product by SKU, and log each change to `Edit History` |
| `addProduct` | POST | Admin-only: append a brand-new product row (any Sheet columns, matched by header name) and log it to `Edit History` |
| `setProductActive` | POST | Admin-only: soft-delete/restore a product by flipping its `active` column, logged to `Edit History` |
| `getPendingOrders` | POST | Admin-only: list `Pending` orders (optionally filtered by `search` against Order ID/name/phone) plus the total pending count |
| `updateOrderStatus` | POST | Admin-only: change an order's status by Order ID |
| `getPendingWalletRequests` | POST | Admin-only: list `Pending` wallet recharge requests (optionally filtered by `search`) plus the total pending count |
| `updateWalletRequestStatus` | POST | Admin-only: change a wallet request's status; setting it to `Approved` credits the customer's wallet balance once |

All `POST` requests may include an optional `"lang": "en"` or `"lang": "bn"` field so that server-side success/error messages are returned in the matching language.

**Saved addresses**: the `users` sheet's address column (column E) now stores up to 3 labeled addresses (`Home`/`Office`/`Other`) as a JSON string, written only from the Profile page's "Save Addresses" action. Older accounts with a plain-text address are read transparently as a single "Home" address — no migration needed.

---

## 🧭 Home Navigation & Category Browsing

- **Home** is always the first nav button and returns to the **Home Dashboard** (Featured Categories, Today's Offers, New Arrival, and a "Your Previous Orders" placeholder for a future order-history feature).
- **All Categories** is the second nav button and shows a full grid of every category; tapping a category card goes straight to that category's product page.
- Any category button (top nav, sidebar, or a Featured Category card) jumps **directly** to that category's product page — no need to open All Categories first.
- A clickable breadcrumb (`Home › All Categories › Category › Sub-category`) is shown on every page except the Home Dashboard.
- Category thumbnails on Featured Categories / All Categories come from the optional `category_image` column described above.

---

## 🛠️ Admin Dashboard System

- **Who is an Admin**: detected purely from the logged-in customer's `userId` in the `users` sheet. Any `userId` starting with `SACAR-ADMIN` (e.g. `SACAR-ADMIN-0001`) is treated as an Admin; everyone else (e.g. `SACAR-USR-0001`) is a normal customer. No separate role column — just change the `userId` cell for that account in the `users` sheet.
- **Where it lives**: Profile page → **Admin Dashboard** card (normal customers never see this card at all; it replaced the old Settings toggle from earlier versions). The card is **collapsed by default** — only the Admin Mode switch shows; the rest (timer + 5-menu grid) expands only once it's turned on, and collapses again when it's off.
- **Turning it on**: only the small switch itself is clickable (not the row/label around it) — the switch asks for the account's current login password (verified via `verifyPassword`, never stored anywhere) before activating.
- **Session length & control**: defaults to **30 minutes**, shown as a live countdown on one line: `-10m` `-30m` `-1h` on the left, the countdown in the middle, `+10m` `+30m` `+1h` on the right (dropping to zero or below turns Admin Mode off immediately). It also turns off automatically on logout, or manually anytime via the same switch.
- **What changes on product cards**: only while Admin Mode is on, every product card additionally shows a **Buying Price** (hover to reveal on desktop, tap to reveal for ~2.5s on mobile) and a small **pencil/Edit** icon. Normal customers never see either, at any time.
- **The 5 dashboard menu items**:
  1. **Add Item** — one full form (no Main/Advanced split) for a brand-new product. Category and Sub Category are searchable-dropdown-with-manual-entry fields — pick an existing one or type a new one freely. Product Name, Category, Sub Category, Selling Price, and Stock are **required** — an empty one is highlighted, focused, and shown a message instead of saving; SKU is optional and auto-generated when left blank.
  2. **Edit Item** — jumps straight to the All Categories page so the Admin can drill Category → Product → Edit using the same popup described below.
  3. **Delete Item** — search by name/SKU and delete from a result list. This is a **soft delete** (flips `active` to `FALSE`); nothing is ever destroyed, and it can be restored via the Sheet or the Edit popup's Advanced section.
  4. **Order Status** — a live "Pending: N" badge with its own refresh icon (refreshes only that badge, no page reload). Opening it shows a search box plus the pending order list; each order has a status dropdown (`Pending`/`Confirmed`/`Processing`/`Shipped`/`Completed`/`Cancelled`) + Save.
  5. **Wallet Request** — same pattern as Order Status, for recharge requests. Approving a request credits the customer's wallet balance automatically (see the `wallet_requests` section above).
- **Editing a product**: the Edit icon opens a popup with a fixed title/close header, a fixed Save + "More / Advanced Edit" footer, and a scrollable form in between.
  - **Main section** (always visible): Product Name, Buying Price, Selling Price, Discount Price, Stock, Buffer Stock.
  - **Advanced Edit section** (collapsed by default, opened via "More / Advanced Edit"): every other field — Points, Image URL, Description, Category Image URL, Best Selling + priority, New Arrival + priority, Category Priority, Active (restore a deleted product by flipping this back to `TRUE`), plus **any other column** your `products` sheet has that isn't in this list — those appear automatically as plain text fields, so a brand-new Sheet column shows up in the Edit popup with no code changes needed.
  - Category, Sub Category, and SKU are shown for reference but are **never editable**, anywhere.
  - Saving updates the `products` sheet directly; if the request fails, the card's data is rolled back to what it was before.
- **Best Selling / New Arrival sections are Sheet-driven**: set a product's `best_selling` (or `new_arrival`) column to `TRUE` to feature it in that Home section, `FALSE`/blank to leave it out. Use `best_selling_priority` (or `new_arrival_priority`) — a plain number — to control order; **lower number shows first**. If no product has the flag set to `TRUE`, the section automatically falls back to its existing behavior (Best Selling → actual Sales, then view history; New Arrival → most recently added products).
- **Built to extend**: the flag+priority logic (`getFlaggedProducts()` in `script.js`) is generic — a future section like `featured` / `featured_priority` or `flash_sale` / `flash_sale_priority` just needs those two columns added to the Sheet and one line calling the same helper; no per-section rewrite needed.
- **Audit trail**: every saved change (edits, new products, deletes/restores) is logged to the `Edit History` sheet (see above).

### Product card & details popup updates
- **Default image**: if `image_url` is empty, a clean local placeholder icon is shown (no external network call, no "No Image" text placeholder).
- **Multiple images**: put more than one image URL in the same `image_url` cell separated by commas (`image1,image2,image3`). Every card (Home, search, category, offers) still shows only the **first** image for a fast, consistent grid. The product details popup shows all of them as a swipeable carousel (left/right arrows + dot indicators, touch swipe on mobile) — images load **on demand** as the shopper navigates, and a broken image is skipped automatically in favor of the next one instead of breaking the popup. With only one image, no arrows/dots are shown.
- **Reward points**: shown as a small coin icon + number right next to the price (no "Points" label); hidden completely when a product's points value is `0`.
- **Manual quantity entry**: tapping the quantity number (not just the +/- buttons) lets a shopper type a quantity directly. Works identically on product cards, the cart drawer, and the checkout review step — all three share the same quantity control component.

---

## ⚡ Home Page Performance & Caching

- **Section order**: Hero Banner → Your Previous Orders → All Categories (single-row horizontal scroll) → Best Selling → Today's Offers → New Arrival → Recently Viewed → Recommended For You → Footer.
- **Your Previous Orders**: for logged-in customers only, built from their real order history (`getMyOrders`, which now also returns each order's item list). Products are ranked by total quantity ever ordered — most-reordered first — and shown in the same slider component as every other section, so add-to-cart / quick re-order works exactly the same way. Hidden entirely for guests or if nothing could be matched.
- **All Categories row**: the Home page's category section is now always a single horizontal scrolling row (never wraps to multiple rows, even with 100+ categories) — separate from the dedicated **All Categories** page, which still shows the full wrapping grid.
- **Never a blank Home Page**: Categories, Best Selling, and New Arrival show animated skeleton placeholders immediately on load instead of empty space, and are replaced by real content the moment data is ready.
- **Instant repeat visits (stale-while-revalidate)**: product data is cached in `localStorage`. On every load after the first, the Home Page renders immediately from that cache — no blank/loading screen — while a fresh copy is fetched quietly in the background and swapps in once ready, without resetting whatever page the customer is currently on.
- **Service Worker caching** (`sw.js`): static files (HTML/CSS/JS) and every image (product, category, banner) are cached so they're only downloaded once; repeat visits reuse them instead of re-fetching. API calls to the Apps Script backend are never cached — product data, stock, prices, and orders always stay live.
- **Refresh vs. fresh launch**: the current category/page is remembered in `sessionStorage` — refreshing the page while browsing a category keeps you there, but fully closing and reopening the site (a new browser session) always starts from the Home Page.

---

## 🌗 Dark Mode, Light Mode & Language Support

- **Theme**: choose **Light**, **Dark**, or **System** (follows the OS/browser preference automatically) from the header dropdown. The choice is saved in `localStorage` and re-applied on the next visit.
- **Language**: choose **English** or **বাংলা** from the header dropdown. **English is the default** for first-time visitors; once a language is chosen it is remembered for future visits. Switching language updates every piece of text on the page instantly, without reloading.

---

## 🧩 Tech Stack

- HTML5, CSS3 (custom properties / CSS variables for theming), vanilla JavaScript (no frameworks)
- [Font Awesome 6](https://fontawesome.com/) for icons (via CDN)
- Google Sheets + Google Apps Script as a free, serverless backend
- `localStorage` for cart, session, theme, and language persistence

---

## 📄 License & Contact

© 2026 SACAR Mart — Haji Idris Miah Bazar, Subarnachar, Noakhali.
Hotline: 01610-622995 · Email: saiful.987.yu@gmail.com
