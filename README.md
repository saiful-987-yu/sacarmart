# SACAR Mart

A modern, responsive e-commerce web application for **SACAR Mart**, powered by **Google Sheets** as a dynamic backend database via **Google Apps Script**. No traditional server or database is required — everything runs on static HTML/CSS/JS in the browser and a free Google Apps Script Web App as the API layer.

---

## ✨ Features

### Shopping Experience
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

### Sheet: `users`
Column order (no header lookup — fixed by index):
`A: userId | B: name | C: phone | D: email | E: address | F: password | G: points`

### Sheet: `orders`
Column order (16 columns):
`A: Order ID | B: Order Date (YYYY-MM-DD) | C: Order Time (24h HH:MM:SS) | D: Customer Name | E: Customer Phone | F: Order Source | G: Delivery Type | H: Payment Method | I: Delivery Address | J: Delivery Note | K: Transaction ID | L: Advance Amount | M: Delivery Charge | N: Grand Total | O: Status | P: Items Details`

- **Order Source** is currently always `Website`; reserved for future channels (Facebook, Messenger, WhatsApp, Admin Panel).
- **Delivery Type** is one of `Inside Subarnachar`, `Outside Subarnachar`, or `Pickup Order`.
- **Payment Method** is one of `Cash on Delivery`, `Online Payment`, or `Pickup Order`.
- Each field is written to its own column — the Delivery Address column contains only the address, with note/transaction/amount kept separate.
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
| `register` | POST | Create a new customer account |
| `login` | POST | Authenticate a customer |
| `placeOrder` | POST | Submit an order and update reward points (does **not** modify the customer's saved profile address) |
| `updateProfile` | POST | Update customer name/email and/or saved addresses |
| `changePassword` | POST | Change a customer's password |
| `getMyOrders` | POST | Fetch a customer's own order history (by phone) for the Profile dashboard |
| `getUserData` | POST | Re-fetch a customer's current name/email/address/points (by phone) — the Sheet is the single source of truth for reward points, refreshed automatically on page load and after every order |

All `POST` requests may include an optional `"lang": "en"` or `"lang": "bn"` field so that server-side success/error messages are returned in the matching language.

**Saved addresses**: the `users` sheet's address column (column E) now stores up to 3 labeled addresses (`Home`/`Office`/`Other`) as a JSON string, written only from the Profile page's "Save Addresses" action. Older accounts with a plain-text address are read transparently as a single "Home" address — no migration needed.

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
