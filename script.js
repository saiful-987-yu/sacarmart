const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwTk1lU-qzD_4dvefbSOBj6ZDDTuYUCmhJs4uBhKufI8REHBlMtb9fuLu59sV1R_1bg/exec";
let localProductDB = [];
//let cart = [];
let cart = JSON.parse(localStorage.getItem("sacar_cart")) || [];
let currentUser = null;
let selectedProductDesc = "";
let currentLang = localStorage.getItem("sacar_lang") || "bn";
let currentTheme = localStorage.getItem("sacar_theme") || "system";
let pendingWaURL = ""; // হোয়াটসঅ্যাপ রিডাইরেক্ট অপশনের জন্য
// ফিল্টারিং ও সর্টিং স্টেট ট্র্যাকিং
let activeMainCategory = "ALL";
let activeSubCategory = "ALL";
let isOfferActive = false;
let activeSort = "default"; // "default", "low-high", "high-low"


const langData = {
  bn: {
    promo: "সাকার মার্টে আপনাকে স্বাগত! কেনাকাটা করুন আর জিতে নিন আকর্ষণীয় রিওয়ার্ড পয়েন্ট! 🛍️",
    search: "পছন্দের প্রোডাক্টটি খুঁজুন...",
    loginNav: "লগইন",
    sidebarTitle: "ক্যাটাগরি সমূহ",
    allProducts: "সকল প্রোডাক্টস",
    popularCat: "জনপ্রিয় ক্যাটাগরি",
    heroTitle: "সেরা মানের পণ্য, সাশ্রয়ী মূল্য!",
    heroDesc: "সুবর্ণচরের নির্ভরযোগ্য অনলাইন শপ সাকার মার্ট থেকে ঘরে বসেই অর্ডার করুন আপনার নিত্যপ্রয়োজনীয় পণ্য।",
    loading: "প্রোডাক্ট লোড হচ্ছে, দয়া করে অপেক্ষা করুন...",
    chkTitle: "অর্ডার কনফার্ম করুন",
    chkName: "আপনার নাম *",
    chkPhone: "মোবাইল নাম্বার *",
    chkAddr: "পূর্ণাঙ্গ ডেলিভারি ঠিকানা *",
    chkZone: "ডেলিভারি এরিয়া নির্বাচন করুন",
    chkIn: "সুবর্ণচরের ভিতরে (৳৬০)",
    chkOut: "সুবর্ণচরের বাইরে (৳১৫০)",
    chkPay: "পেমেন্ট পদ্ধতি",
    chkCod: "ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে টাকা পরিশোধ)",
    chkBtn: "অর্ডার নিশ্চিত করুন ",
    sumTitle: "অর্ডার সামারি",
    sumSub: "সাবটোটাল:",
    sumDel: "ডেলিভারি চার্জ:",
    sumTotal: "সর্বমোট বিল:",
    sumPts: "অর্জিত রিওয়ার্ড পয়েন্ট:",
    sumPtsUnit: "পয়েন্ট",
    cartTitle: "শপিং কার্ট",
    cartTotal: "মোট হিসাব:",
    cartChk: "চেকআউট করতে এগিয়ে যান ",
    relatedTitle: "সম্পর্কিত পণ্যসমূহ (Related Products)",
    fAddr: "হাজী ইদ্রিস মিয়া বাজার, সুবর্ণচর, নোয়াখালী।",
    fHot: "হটলাইন: 01610-622995",
    fLinks: "জরুরী লিংক",
    fHome: "হোমপেজ",
    fDel: "ডেলিভারি পলিসি",
    fTerms: "শর্তাবলী ও নিয়মসমূহ",
    fSoc: "আমাদের সোশ্যাল মিডিয়া",
    fCopy: "© 2026 SACAR Mart. সাকার মার্ট সুবর্ণচরের একটি নির্ভরযোগ্য প্রতিষ্ঠান। সর্বস্বত্ব সংরক্ষিত।",
    allBtn: "সব পণ্য",
    orderBtn: "অর্ডার করুন",
    addCartBtn: "কার্টে যুক্ত করুন",
    pointsUnit: "পয়েন্ট",
    tabInfo: "পণ্য বিবরণ",
    tabPolicy: "ডেলিভারি পলিসি",
    policyText: "সুবর্ণচরের ভিতরে সর্বোচ্চ ২৪-৪৮ ঘণ্টার মধ্যে হোম ডেলিভারি নিশ্চিত করা হয়। ডেলিভারি ম্যানের সামনে প্রোডাক্ট চেক করে রিসিভ করবেন।",
    emptyCart: "আপনার কার্টটি খালি!",
    orderSuccess: "🎉 আপনার অর্ডারটি সফলভাবে গৃহীত হয়েছে! অর্ডার আইডি: ",
    waTitle: "🛒 *নতুন অর্ডার - সাকার মার্ট*\n",
    profTitle: "আপনার প্রোফাইল",
    profId: "ইউজার আইডি (ইউনিক):",
    profPts: "মোট রিওয়ার্ড পয়েন্ট:",
    profName: "আপনার নাম *",
    profPhone: "মোবাইল নাম্বার (পরিবর্তনযোগ্য নয়)",
    profEmail: "ইমেইল এড্রেস",
    profAddr: "স্থায়ী ডেলিভারি ঠিকানা",
    profSave: "প্রোফাইল আপডেট করুন",
    profUpdateSuccess: "প্রোফাইল সফলভাবে আপডেট করা হয়েছে!"
  },
  en: {
    promo: "Welcome to SACAR Mart! Shop & win exciting reward points! 🛍️",
    search: "Search for your favorite product...",
    loginNav: "Login",
    sidebarTitle: "All Categories",
    allProducts: "All Products",
    popularCat: "Popular Categories",
    heroTitle: "Best Quality Products, Affordable Price!",
    heroDesc: "Order your daily essentials online from Subarnachar's trusted shop SACAR Mart.",
    loading: "Loading products, please wait...",
    chkTitle: "Confirm Order",
    chkName: "Your Name *",
    chkPhone: "Mobile Number *",
    chkAddr: "Full Delivery Address *",
    chkZone: "Select Delivery Area",
    chkIn: "Inside Subarnachar (৳60)",
    chkOut: "Outside Subarnachar (৳150)",
    chkPay: "Payment Method",
    chkCod: "Cash on Delivery (Pay after receiving product)",
    chkBtn: "Confirm Order ",
    sumTitle: "Order Summary",
    sumSub: "Subtotal:",
    sumDel: "Delivery Charge:",
    sumTotal: "Grand Total:",
    sumPts: "Earned Reward Points:",
    sumPtsUnit: "Points",
    cartTitle: "Shopping Cart",
    cartTotal: "Total Amount:",
    cartChk: "Proceed to Checkout ",
    relatedTitle: "Related Products",
    fAddr: "Haji Idris Miah Bazar, Subarnachar, Noakhali.",
    fHot: "Hotline: 01610-622995",
    fLinks: "Important Links",
    fHome: "Homepage",
    fDel: "Delivery Policy",
    fTerms: "Terms & Conditions",
    fSoc: "Our Social Media",
    fCopy: "© 2026 SACAR Mart. A trusted institution in Subarnachar. All rights reserved.",
    allBtn: "All Products",
    orderBtn: "Order Now",
    addCartBtn: "Add to Cart",
    pointsUnit: "Points",
    tabInfo: "Product Details",
    tabPolicy: "Delivery Policy",
    policyText: "Home delivery within 24-48 hours inside Subarnachar. Please check the product before receiving.",
    emptyCart: "Your cart is empty!",
    orderSuccess: "🎉 Your order has been placed successfully! Order ID: ",
    waTitle: "🛒 *New Order - SACAR Mart*\n",
    profTitle: "Your Profile",
    profId: "User ID (Unique):",
    profPts: "Total Reward Points:",
    profName: "Your Name *",
    profPhone: "Mobile Number (Non-editable)",
    profEmail: "Email Address",
    profAddr: "Permanent Delivery Address",
    profSave: "Update Profile",
    profUpdateSuccess: "Profile updated successfully!"
  }
};

window.onload = function() {
  document.getElementById("lang-toggle").value = currentLang;
  document.getElementById("theme-toggle").value = currentTheme;
  applyTheme(currentTheme);
  applyLanguage();
  loadProductsFromSheet();
  checkActiveSession();
};

/* কাস্টম টোস্ট মেসেজিং সিস্টেম */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if(!container) return;
  const toast = document.createElement('div');
  toast.className = `toast-item ${type}`;
  
  let icon = '<i class="fas fa-info-circle"></i>';
  if(type === 'success') icon = '<i class="fas fa-check-circle" style="color: var(--success-color);"></i>';
  if(type === 'error') icon = '<i class="fas fa-exclamation-circle" style="color: #e53e3e;"></i>';
  if(type === 'warning') icon = '<i class="fas fa-exclamation-triangle" style="color: var(--warning-color);"></i>';
  
  toast.innerHTML = `${icon} <span style="flex: 1;">${message}</span>`;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = "fadeOut 0.3s forwards";
    setTimeout(() => { toast.remove(); }, 300);
  }, 3500);
}

/* পাসওয়ার্ড শো/হাইড করার লজিক */
function togglePasswordVisibility(inputId, icon) {
  const input = document.getElementById(inputId);
  if(!input) return;
  if(input.type === 'password') {
    input.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}

async function loadProductsFromSheet() {
  try {
    const response = await fetch(`${WEB_APP_URL}?action=getProducts`);
    localProductDB = await response.json();
    buildCategoryFilters();
    applyFiltersAndSort(); // handleFilterAndSort-এর পরিবর্তে নতুন ফিল্টার রান করবে
    refreshCartUI();
  } catch (e) {
    console.error(e);
    document.getElementById('main-products-grid').innerHTML = "<p>Error loading products.</p>";
  }
}



function buildCategoryFilters() {
  const categories = [...new Set(localProductDB.map(p => p.category).filter(Boolean))];
  const chipsContainer = document.getElementById('category-chips');
  const sidebarContainer = document.getElementById('sidebar-categories');
  const allTxt = langData[currentLang].allBtn;
  chipsContainer.innerHTML = `<button class="chip active" onclick="filterCategory('all', this)">${allTxt}</button>`;
  sidebarContainer.innerHTML = `<li onclick="filterCategory('all')"><i class="fas fa-th"></i> ${allTxt}</li>`;
  categories.forEach(cat => {
    chipsContainer.innerHTML += `<button class="chip" onclick="filterCategory('${cat}', this)">${cat}</button>`;
    sidebarContainer.innerHTML += `<li onclick="filterCategory('${cat}')"><i class="fas fa-chevron-right"></i> ${cat}</li>`;
  });
}

// মেইন ক্যাটাগরি ক্লিক হ্যান্ডলার
// মেইন ক্যাটাগরি ক্লিক হ্যান্ডলার (সংশোধিত)
function filterCategory(catName, element) {
  // ক্যাটাগরি চিপস ও সাইডবার আইটেমগুলোর অ্যাক্টিভ স্টেট রিসেট করা
  document.querySelectorAll(".chip").forEach(el => el.classList.remove("active"));
  document.querySelectorAll("#sidebar-categories li").forEach(el => el.classList.remove("active"));
  
  if (element) {
    element.classList.add("active");
  } else {
    // সাইডবার থেকে ক্লিক করলে সঠিক মেইন চিপকে অ্যাক্টিভ করা
    const targetText = catName.toLowerCase() === 'all' ? (langData[currentLang].allBtn || "All") : catName;
    document.querySelectorAll(".chip").forEach(c => {
      const text = c.querySelector('span') ? c.querySelector('span').innerText.trim() : c.innerText.trim();
      if(text === targetText) {
        c.classList.add("active");
      }
    });
  }

  // গ্লোবাল স্টেট আপডেট
  activeMainCategory = catName.toLowerCase() === 'all' ? 'ALL' : catName;
  activeSubCategory = "ALL"; // মেইন ক্যাটাগরি চেঞ্জ হলে সাব-ক্যাটাগরি ডিফল্ট "ALL" হবে

  const subSection = document.getElementById("sub-category-section");
  const subChipsContainer = document.getElementById("sub-category-chips");

  // যদি "ALL" (সব পণ্য) সিলেক্ট করা হয়, সাব-ক্যাটাগরি বার হাইড হবে
  if (activeMainCategory === "ALL") {
    if (subSection) subSection.style.display = "none";
    applyFiltersAndSort();
    return;
  }

  // সাব-ক্যাটাগরি ফিল্টার করা (ক্যাপিটাল/স্মল লেটার সেফটি সহ)
  const subCategories = [...new Set(
    localProductDB
      .filter(p => {
        const pCat = (p.category || p.Category || "").trim();
        const pSub = (p.sub_category || p.Sub_Category || p.subCategory || "").trim();
        return pCat === activeMainCategory && pSub !== "";
      })
      .map(p => (p.sub_category || p.Sub_Category || p.subCategory || "").trim())
  )].filter(Boolean);

  if (subCategories.length > 0) {
    if (subSection) subSection.style.display = "block";
    
    // ডাইনামিক সাব-ক্যাটাগরি চিপস
    let chipsHTML = `<button class="sub-chip active" onclick="filterSubCategory('ALL', this)">সব (${subCategories.length})</button>`;
    subCategories.forEach(sub => {
      chipsHTML += `<button class="sub-chip" onclick="filterSubCategory('${sub}', this)">${sub}</button>`;
    });
    if (subChipsContainer) subChipsContainer.innerHTML = chipsHTML;
  } else {
    if (subSection) subSection.style.display = "none";
  }

  applyFiltersAndSort();
}


// সাব-ক্যাটাগরি ক্লিক হ্যান্ডলার
function filterSubCategory(subName, element) {
  document.querySelectorAll(".sub-chip").forEach(el => el.classList.remove("active"));
  if (element) element.classList.add("active");

  activeSubCategory = subName;
  applyFiltersAndSort();
}


function displayProducts(products) {
  const grid = document.getElementById('main-products-grid');
  grid.innerHTML = '';
  if(!products || products.length === 0) {
    grid.innerHTML = '<div style="text-align:center; padding:20px; width:100%; color:var(--text-color);">কোনো প্রোডাক্ট পাওয়া যায়নি!</div>';
    return;
  }

  // চেক করা যে কাস্টমার কি "সকল প্রোডাক্টস" (All) বা ডিফল্ট মোডে আছে নাকি নির্দিষ্ট ক্যাটাগরি ফিল্টার করেছে
  const activeChip = document.querySelector('.chip.active');
  const isAllMode = activeChip ? (activeChip.innerText.includes(langData[currentLang].allProducts) || (activeChip.querySelector('span') && activeChip.querySelector('span').innerText.includes(langData[currentLang].allProducts))) : true;

  // যদি কাস্টমার কোনো ক্যাটাগরি ফিল্টার করে বা সার্চ করে বা সর্টিং করে, তবে নরমাল গ্রিড ভিউ দেখাবে
  if (!isAllMode || products.length < localProductDB.length) {
    grid.style.display = "grid"; // গ্রিড ভিউ চালু
    
    // ২ নম্বর কাজের স্টক ও বাফার অনুযায়ী সাজানোর লজিক ঠিক রাখা
    const inStock = [];
    const outStock = [];
    products.forEach(p => {
      const currentAvailable = (parseInt(p.Stock) || 0) - (parseInt(p.Sales) || 0);
      if (currentAvailable <= (parseInt(p.Buffer) || 0)) outStock.push(p);
      else inStock.push(p);
    });
    
    // প্রাইস সর্টিং ড্রপডাউন চেক করে সাজানো
    let finalProducts = [...inStock, ...outStock];
    const sortVal = document.getElementById('price-sort-select') ? document.getElementById('price-sort-select').value : 'default';
    if(sortVal === 'low-high') {
      finalProducts.sort((a,b) => (parseFloat(a.discount_price) || parseFloat(a.price)) - (parseFloat(b.discount_price) || parseFloat(b.price)));
    } else if(sortVal === 'high-low') {
      finalProducts.sort((a,b) => (parseFloat(b.discount_price) || parseFloat(b.price)) - (parseFloat(a.discount_price) || parseFloat(a.price)));
    }

    finalProducts.forEach(p => {
      const card = createProductCardHTML(p);
      grid.appendChild(card);
    });
    return;
  }

  // --- ৩ নম্বর কাজ: ক্যাটাগরি অনুযায়ী হরিজন্টাল স্লাইডার লেআউট (ছবি ছাড়া) ---
  grid.style.display = "block"; // স্লাইডার ব্লকের জন্য লেআউট পরিবর্তন
  
  // ইউনিক ক্যাটাগরিগুলোর লিস্ট নেওয়া
  const categories = [];
  products.forEach(p => {
    if(p.Category && !categories.includes(p.Category)) categories.push(p.Category);
  });

  categories.forEach(cat => {
    const catProducts = products.filter(p => p.Category === cat);
    if(catProducts.length === 0) return;

    // স্লাইডারের ভেতরেও ২ নম্বর কাজের স্টক ও বাফার সিকিউরিটি ঠিক রাখা
    const inStock = [];
    const outStock = [];
    catProducts.forEach(p => {
      const currentAvailable = (parseInt(p.Stock) || 0) - (parseInt(p.Sales) || 0);
      if (currentAvailable <= (parseInt(p.Buffer) || 0)) outStock.push(p);
      else inStock.push(p);
    });
    const sortedCatProducts = [...inStock, ...outStock];

    // সেকশন কন্টেইনার
    const section = document.createElement('div');
    section.className = 'category-slider-section';

    // স্লাইডার হেডার (ক্যাটাগরির নাম এবং "সব দেখুন" বাটন)
    const header = document.createElement('div');
    header.className = 'slider-section-header';
    header.innerHTML = `
      <h3>${cat}</h3>
      <button class="view-all-btn" onclick="filterByCategoryName('${cat}')">সব দেখুন <i class="fas fa-chevron-right"></i></button>
    `;
    section.appendChild(header);

    // ডানে-বামে স্ক্রোল করার জন্য রো
    const sliderRow = document.createElement('div');
    sliderRow.className = 'category-slider-row';

    sortedCatProducts.forEach(p => {
      const card = createProductCardHTML(p);
      sliderRow.appendChild(card);
    });

    section.appendChild(sliderRow);
    grid.appendChild(section);
  });
}

// "সব দেখুন" বাটনে ক্লিক করলে সেই চিপকে ডাইনামিকালি ক্লিক করানোর ফাংশন
function filterByCategoryName(catName) {
  document.querySelectorAll('.chip').forEach(c => {
    const text = c.querySelector('span') ? c.querySelector('span').innerText.trim() : c.innerText.trim();
    if(text === catName) {
      c.click();
      c.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  });
}

// ফিল্টার বা সর্টিং চেঞ্জ করার জন্য হেল্পার ফাংশন
// এই ফাংশনটি ফিল্টারিং এবং সর্টিং দুটোই একসাথে করবে
function handleFilterAndSort() {
  const activeChip = document.querySelector('.chip.active');
  const chipText = activeChip ? (activeChip.querySelector('span') ? activeChip.querySelector('span').innerText.trim() : activeChip.innerText.trim()) : (langData[currentLang].allBtn || "All");
  const isAllMode = chipText === (langData[currentLang].allBtn || "All") || chipText === langData[currentLang].allProducts;
  
  // ১. প্রোডাক্ট ফিল্টার লজিক
  let filteredProducts = [...localProductDB];
  if (!isAllMode) {
    filteredProducts = filteredProducts.filter(p => (p.category || p.Category) === chipText);
  }
  
  // সাব-ক্যাটাগরি ফিল্টার (যদি থাকে)
  const subSelect = document.getElementById('sub-category-select');
  if (subSelect && subSelect.style.display !== 'none' && subSelect.value !== 'all') {
    filteredProducts = filteredProducts.filter(p => (p.sub_category || p.Sub_Category) === subSelect.value);
  }
  
  // সার্চ ফিল্টার
  const searchInput = document.getElementById('store-search');
  if (searchInput && searchInput.value.trim() !== "") {
    const q = searchInput.value.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      (p.name && p.name.toLowerCase().includes(q)) || 
      (p.sku && p.sku.toLowerCase().includes(q))
    );
  }
  
  // ২. স্টক অনুযায়ী সাজানো (ইন-স্টক আগে, আউট-অফ-স্টক পরে)
  const inStock = [];
  const outStock = [];
  filteredProducts.forEach(p => {
    const currentAvailable = (parseInt(p.Stock) || 0) - (parseInt(p.Sales) || 0);
    const buffer = parseInt(p.Buffer) || 0;
    if (currentAvailable <= buffer) outStock.push(p);
    else inStock.push(p);
  });
  
  // ৩. প্রাইস সর্টিং
  const sortVal = document.getElementById('price-sort-select') ? document.getElementById('price-sort-select').value : 'default';
  if(sortVal === 'low-high') {
    inStock.sort((a,b) => (parseFloat(a.discount_price || a.price)) - (parseFloat(b.discount_price || b.price)));
    outStock.sort((a,b) => (parseFloat(a.discount_price || a.price)) - (parseFloat(b.discount_price || b.price)));
  } else if(sortVal === 'high-low') {
    inStock.sort((a,b) => (parseFloat(b.discount_price || b.price)) - (parseFloat(a.discount_price || a.price)));
    outStock.sort((a,b) => (parseFloat(b.discount_price || b.price)) - (parseFloat(a.discount_price || a.price)));
  }
  
  // সবশেষে রেন্ডার করা
  displayProducts([...inStock, ...outStock]);
}


// প্রোডাক্ট কার্ডের HTML জেনারেট করার কমন হেল্পার ফাংশন (২ নম্বর কাজের বাফার বিয়োগ সহ লক)
function createProductCardHTML(p) {
  const stock = parseInt(p.Stock) || 0;
  const sales = parseInt(p.Sales) || 0;
  const buffer = parseInt(p.Buffer) || 0;
  const currentAvailableStock = stock - sales;
  const sellableStock = currentAvailableStock - buffer; // বাফার বাদে আসল বিক্রয়যোগ্য স্টক
  const isOutOfStock = currentAvailableStock <= buffer;

  const img = p.image_url || 'https://via.placeholder.com/200?text=No+Image';
  const price = parseFloat(p.price) || 0;
  const discPrice = parseFloat(p.discount_price) || 0;
  const points = parseInt(p.points) || 0;
  
  let discountBadge = '';
  let priceHTML = `<span class="current-price">৳${price.toFixed(2)}</span>`;
  if(discPrice > 0 && discPrice < price) {
    priceHTML = `<span class="original-price">৳${price.toFixed(2)}</span><span class="current-price">৳${discPrice.toFixed(2)}</span>`;
    const discPercentage = Math.round(((price - discPrice) / price) * 100);
    discountBadge = `<div class="discount-badge">${discPercentage}% ছাড়</div>`;
  }
  
  const cartItem = cart.find(item => item.sku === p.sku);
  const itemQty = cartItem ? cartItem.qty : 0;
  
  let buttonHTML = '';
  if (isOutOfStock) {
    buttonHTML = `
      <button class="order-btn" style="background-color: #a0aec0; cursor: not-allowed;" disabled>
        <i class="fas fa-exclamation-triangle"></i> স্টক শেষ
      </button>
    `;
  } else if(itemQty > 0) {
    buttonHTML = `
      <div class="quantity-counter-container">
        <button class="qty-round-btn minus" onclick="changeCardQty('${p.sku}', -1)"><i class="fas fa-minus"></i></button>
        <input type="number" class="qty-pill-input" value="${itemQty}" min="1" max="${sellableStock}" onchange="directCardQty('${p.sku}', this.value)">
        <button class="qty-round-btn plus" onclick="changeCardQty('${p.sku}', 1)"><i class="fas fa-plus"></i></button>
      </div>
    `;
  } else {
    buttonHTML = `
      <button class="order-btn" onclick="addItemToCart('${p.sku}')">
        <i class="fas fa-shopping-basket"></i> ${langData[currentLang].orderBtn}
      </button>
    `;
  }

  const card = document.createElement('div');
  card.className = 'product-card';
  if (isOutOfStock) card.style.opacity = '0.5';

  card.innerHTML = `
    ${discountBadge}
    <img src="${img}" alt="${p.name}" onclick="viewProductDetails('${p.sku}')">
    <h4 onclick="viewProductDetails('${p.sku}')">${p.name}</h4>
    <div class="price-box">${priceHTML}</div>
    <div class="product-points"><i class="fas fa-coins"></i> +${points} ${langData[currentLang].pointsUnit}</div>
    <div class="card-action-area">${buttonHTML}</div>
  `;
  return card;
}

function handleSearch() {
  const query = document.getElementById('store-search').value.toLowerCase().trim();
  if(!query) {
    displayProducts(localProductDB);
    return;
  }
  const filtered = localProductDB.filter(p => p.name.toLowerCase().includes(query) || (p.category && p.category.toLowerCase().includes(query)));
  displayProducts(filtered);
}

function addItemToCart(sku) {
  // ডাটাবেজ ব্যাকআপ চেক
  const db = typeof localProductDB !== 'undefined' ? localProductDB : productDB;
  const product = db.find(p => p.sku === sku);
  if(!product) return;
  
  // স্টক হিসাব
  const stock = parseInt(product.Stock) || 0;
  const sales = parseInt(product.Sales) || 0;
  const maxAvailable = stock - sales;

  const existing = cart.find(item => item.sku === sku);
  if(existing) {
    if(existing.qty >= maxAvailable) {
      showToast(`দুঃখিত, এই পণ্যের সর্বোচ্চ ${maxAvailable} পিস স্টকে আছে।`, "warning");
      return;
    }
    existing.qty++;
  } else {
    if(maxAvailable <= 0) {
      showToast(`দুঃখিত, এই প্রোডাক্টটি আউট অফ স্টক!`, "danger");
      return;
    }
    cart.push({ sku: product.sku, name: product.name, price: parseFloat(product.price)||0, qty: 1, points: parseInt(product.points)||0 });
  }
  refreshCartUI();
  const activeChip = document.querySelector('.chip.active');
  if(activeChip) { activeChip.click(); } else { displayProducts(db); }
}


// প্রোডাক্ট কার্ডের প্লাস-মাইনাস বাটন হ্যান্ডেল করার ফাংশন (স্টক ও বাফার লক সহ)
function changeCardQty(sku, change) {
  const item = cart.find(i => i.sku === sku);
  
  if (item) {
    // যদি প্লাস বাটনে চাপ দেওয়া হয়, তবে স্টক ও বাফার সিকিউরিটি চেক করবে
    if (change > 0) {
      const db = typeof localProductDB !== 'undefined' ? localProductDB : productDB;
      const prod = db.find(p => p.sku === sku);
      if (prod) {
        const stock = parseInt(prod.Stock) || 0;
        const sales = parseInt(prod.Sales) || 0;
        const buffer = parseInt(prod.Buffer) || 0;
        const sellableStock = stock - sales - buffer; // বাফার বাদ দিয়ে আসল স্টক

        if (item.qty >= sellableStock) {
          showToast(`দুঃখিত, বাফার সিকিউরিটির কারণে এই পণ্যের সর্বোচ্চ ${sellableStock} পিস অর্ডার করা সম্ভব।`, "warning");
          return;
        }
      }
    }

    const newQty = item.qty + change;
    if (newQty <= 0) {
      removeCartItem(sku);
    } else {
      item.qty = newQty;
      refreshCartUI();
    }
  } else if (change > 0) {
    addItemToCart(sku);
  }
  
  // হোমপেজ বা গ্রিডের প্রোডাক্ট বাটনগুলো ইনস্ট্যান্ট আপডেট করার জন্য রি-রেন্ডার করা
  const activeChip = document.querySelector('.chip.active');
  if (activeChip) {
    activeChip.click();
  } else {
    displayProducts(typeof localProductDB !== 'undefined' ? localProductDB : productDB);
  }
}

// সরাসরি ইনপুট বক্সে সংখ্যা টাইপ করে কার্ট আপডেট করার ফাংশন (স্টক ও বাফার লক সহ)
function directCardQty(sku, val) {
  let newQty = parseInt(val) || 1;
  if (newQty < 1) newQty = 1;
  
  // গুগল শিটের আসল প্রোডাক্ট খুঁজে বের করে বিক্রয়যোগ্য (আসল) স্টক হিসাব করা
  const db = typeof localProductDB !== 'undefined' ? localProductDB : productDB;
  const prod = db.find(p => p.sku === sku);
  
  if (prod) {
    const stock = parseInt(prod.Stock) || 0;
    const sales = parseInt(prod.Sales) || 0;
    const buffer = parseInt(prod.Buffer) || 0;
    const sellableStock = stock - sales - buffer; // বাফার বাদ দিয়ে আসল বিক্রয়যোগ্য স্টক

    // যদি টাইপ করা সংখ্যা বিক্রয়যোগ্য স্টকের চেয়ে বেশি হয়, তবে আটকে দিয়ে লিমিট সেট করবে
    if (newQty > sellableStock) {
      showToast(`দুঃখিত, বাফার সিকিউরিটির কারণে পরিমাণ কমিয়ে সর্বোচ্চ ${sellableStock} পিস করা হলো।`, "warning");
      newQty = sellableStock;
    }
  }
  
  const item = cart.find(i => i.sku === sku);
  if (item) {
    item.qty = newQty;
    refreshCartUI();
  }
  
  const activeChip = document.querySelector('.chip.active');
  if (activeChip) { 
    activeChip.click(); 
  } else { 
    displayProducts(typeof localProductDB !== 'undefined' ? localProductDB : productDB); 
  }
}

// সাইড কার্ট ড্রয়ার বা ঝুড়ির প্লাস-মাইনাস এবং ইনপুট চেঞ্জ করার ফাংশন (স্টক ও বাফার লক সহ)
function updateCartQty(sku, newQty) {
  let qty = parseInt(newQty) || 1;
  if(qty < 1) qty = 1;

  // গুগল শিটের আসল প্রোডাক্ট খুঁজে বের করে বিক্রয়যোগ্য (আসল) স্টক হিসাব করা
  const db = typeof localProductDB !== 'undefined' ? localProductDB : productDB;
  const prod = db.find(p => p.sku === sku);
  
  if(prod) {
    const stock = parseInt(prod.Stock) || 0;
    const sales = parseInt(prod.Sales) || 0;
    const buffer = parseInt(prod.Buffer) || 0;
    const sellableStock = stock - sales - buffer; // বাফার বাদ দিয়ে আসল বিক্রয়যোগ্য স্টক
    
    // যদি কার্ট ড্রয়ারের ভেতর বাড়ানো সংখ্যা বিক্রয়যোগ্য স্টকের চেয়ে বেশি হয়, তবে আটকে দেবে
    if(qty > sellableStock) {
      showToast(`দুঃখিত, বাফার সিকিউরিটির কারণে পরিমাণ কমিয়ে সর্বোচ্চ ${sellableStock} পিস করা হলো।`, "warning");
      qty = sellableStock;
    }
  }

  const item = cart.find(i => i.sku === sku);
  if(item) {
    item.qty = qty;
    refreshCartUI();
    
    const activeChip = document.querySelector('.chip.active');
    if(activeChip) { 
      activeChip.click(); 
    } else { 
      displayProducts(typeof localProductDB !== 'undefined' ? localProductDB : productDB); 
    }
  }
}


function removeCartItem(sku) {
  cart = cart.filter(i => i.sku !== sku);
  refreshCartUI();
  showToast("পণ্যটি কার্ট থেকে সরানো হয়েছে।", "warning");
  
  // কার্ডের বাটন স্টেট সাথে সাথে আপডেট করার জন্য
  const activeChip = document.querySelector('.chip.active');
  if(activeChip) { activeChip.click(); } else { displayProducts(typeof localProductDB !== 'undefined' ? localProductDB : productDB); }
}


function refreshCartUI() {
    // কার্টের ডেটা ব্রাউজার মেমরিতে সেভ রাখার জন্য
  localStorage.setItem("sacar_cart", JSON.stringify(cart));
  const body = document.getElementById('cart-drawer-items');
  const counter = document.getElementById('cart-counter');
  const totalLabel = document.getElementById('cart-subtotal-val');
  body.innerHTML = '';
  let subtotal = 0;
  let itemsCount = 0;
  cart.forEach(item => {
    subtotal += item.price * item.qty;
    itemsCount += item.qty;
    body.innerHTML += `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid var(--border-color); padding-bottom:10px;">
        <div style="max-width:200px;">
          <span style="font-weight:600; font-size:14px; display:block;">${item.name}</span>
          <small style="color:var(--accent-color);">৳${item.price.toFixed(2)}</small>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <input type="number" min="1" value="${item.qty}" style="width:45px; text-align:center; padding:3px; background:var(--light-bg); color:var(--text-color); border:1px solid var(--border-color);" onchange="updateCartQty('${item.sku}', this.value)">
          <button onclick="removeCartItem('${item.sku}')" style="background:none; border:none; color:#e53e3e; cursor:pointer;"><i class="fas fa-trash-alt"></i></button>
        </div>
      </div>
    `;
  });
  counter.innerText = itemsCount;
  totalLabel.innerText = subtotal.toFixed(2);
}

function viewProductDetails(sku) {
  const p = localProductDB.find(prod => prod.sku === sku);
  if(!p) return;
  selectedProductDesc = p.description || "No description available.";
  const img = p.image_url || 'https://via.placeholder.com/250?text=No+Image';
  const price = parseFloat(p.price) || 0;
  const discPrice = parseFloat(p.discount_price) || 0;
  const activePrice = (discPrice > 0) ? discPrice : price;
  const grid = document.getElementById('modal-details-grid');
  grid.innerHTML = `
    <div style="text-align:center;">
      <img src="${img}" style="max-width:100%; height:240px; object-fit:contain; border-radius:6px;">
    </div>
    <div>
      <h2>${p.name}</h2>
      <p style="color:var(--accent-color); font-size:22px; font-weight:bold; margin:10px 0;">৳${activePrice.toFixed(2)}</p>
      <div class="tab-headers">
        <button class="tab-btn active" onclick="switchProductTab('info', this)">${langData[currentLang].tabInfo}</button>
        <button class="tab-btn" onclick="switchProductTab('policy', this)">${langData[currentLang].tabPolicy}</button>
      </div>
      <div id="modal-tab-body" style="font-size:14px; line-height:1.6; min-height:80px;">
        ${selectedProductDesc}
      </div>
      <button class="order-btn" style="margin-top:20px;" onclick="addItemToCart('${p.sku}'); closeDetailsModal();"><i class="fas fa-shopping-basket"></i> ${langData[currentLang].addCartBtn}</button>
    </div>
  `;
  displayRelatedProducts(p.category, p.sku);
  document.getElementById('details-modal').style.display = 'flex';
}

function displayRelatedProducts(category, currentSku) {
  const relatedGrid = document.getElementById('related-products-grid');
  relatedGrid.innerHTML = '';
  const related = localProductDB.filter(p => p.category === category && p.sku !== currentSku);
  if(related.length === 0) {
    relatedGrid.innerHTML = '<p style="font-size:13px; color:#a0aec0;">No related products found.</p>';
    return;
  }
  related.forEach(p => {
    const img = p.image_url || 'https://via.placeholder.com/200?text=No+Image';
    const price = parseFloat(p.price) || 0;
    const discPrice = parseFloat(p.discount_price) || 0;
    const activePrice = (discPrice > 0) ? discPrice : price;
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${img}" alt="${p.name}" onclick="viewProductDetails('${p.sku}')" style="height:110px;">
      <h5 onclick="viewProductDetails('${p.sku}')" style="font-size:13px; height:34px; overflow:hidden; margin-bottom:5px; cursor:pointer;">${p.name}</h5>
      <p style="color:var(--accent-color); font-weight:bold; font-size:14px; margin-bottom:8px;">৳${activePrice.toFixed(2)}</p>
      <button class="order-btn" style="padding:5px; font-size:12px;" onclick="addItemToCart('${p.sku}')">${langData[currentLang].orderBtn}</button>
    `;
    relatedGrid.appendChild(card);
  });
}

function switchProductTab(tab, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const body = document.getElementById('modal-tab-body');
  if(tab === 'info') {
    body.innerHTML = selectedProductDesc;
  } else {
    body.innerHTML = langData[currentLang].policyText;
  }
}

function closeDetailsModal() { document.getElementById('details-modal').style.display = 'none'; }

function showView(viewId) {
  document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
  document.getElementById(`${viewId}-view`).classList.add('active');
  window.scrollTo(0,0);
  if(viewId === 'checkout') buildCheckoutPage();
  if(viewId === 'profile') buildProfilePage();
}

function proceedToCheckout() {
  if(cart.length === 0) { showToast(langData[currentLang].emptyCart, "warning"); return; }
  toggleCartDrawer(false);
  showView('checkout');
}

function buildCheckoutPage() {
  if(currentUser) {
    document.getElementById('chk-name').value = currentUser.name || '';
    document.getElementById('chk-phone').value = currentUser.phone || '';
    document.getElementById('chk-address').value = currentUser.address || '';
  }
  updateCheckoutSummary();
}

function updateCheckoutSummary() {
  const list = document.getElementById('chk-items-list');
  let subtotal = 0;
  let earnedPoints = 0;
  list.innerHTML = '';
  cart.forEach(item => {
    subtotal += item.price * item.qty;
    earnedPoints += item.points * item.qty;
    list.innerHTML += `<div class="summary-line"><span>${item.name} (x${item.qty})</span><span>৳ ${(item.price * item.qty).toFixed(2)}</span></div>`;
  });
  const zone = document.querySelector('input[name="shipping-zone"]:checked').value;
  const shipping = zone === 'inside' ? 60 : 150;
  const total = subtotal + shipping;
  document.getElementById('chk-subtotal').innerText = subtotal.toFixed(2);
  document.getElementById('chk-delivery').innerText = shipping.toFixed(2);
  document.getElementById('chk-grandtotal').innerText = total.toFixed(2);
  document.getElementById('chk-points').innerText = earnedPoints;
}

/* হোয়াটসঅ্যাপ রিডাইরেক্ট ক্যানসেলেশন ও অর্ডার সাবমিশন */
async function submitCustomerOrder(e) {
  e.preventDefault();
  if(cart.length === 0) return;
  const name = document.getElementById('chk-name').value;
  const phone = document.getElementById('chk-phone').value;
  const address = document.getElementById('chk-address').value;
  const zone = document.querySelector('input[name="shipping-zone"]:checked').value;
  const shipping = zone === 'inside' ? 60 : 150;
  let subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
  let totalPoints = cart.reduce((s, i) => s + (i.points * i.qty), 0);
  let grandTotal = subtotal + shipping;
  const d = new Date();
  const orderId = `SACAR-${String(d.getFullYear()).slice(-2)}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${Math.floor(1000 + Math.random()*9000)}`;
  const itemsText = cart.map(i => `${i.name} (x${i.qty})`).join(', ');
  const payload = {
    action: "placeOrder",
    orderId: orderId,
    dateTime: d.toLocaleString('bn-BD'),
    customerName: name,
    customerPhone: phone,
    address: address,
    itemsDetails: itemsText,
    deliveryCharge: shipping,
    grandTotal: grandTotal.toFixed(2),
    earnedPoints: totalPoints
  };
  try {
    const response = await fetch(WEB_APP_URL, { method: "POST", body: JSON.stringify(payload) });
    const result = await response.json();
    if(result.success) {
      if(currentUser && phone === currentUser.phone) {
        currentUser.address = address;
        currentUser.points = parseInt(currentUser.points) + parseInt(totalPoints);
        localStorage.setItem('sacar_customer', JSON.stringify(currentUser));
        syncAuthUI();
      }
      cart = [];
      refreshCartUI();
      
      // হোয়াটসঅ্যাপ ইউআরএল জেনারেট করে বাটনে বাইন্ড করা
      let waMessage = `${langData[currentLang].waTitle}---------------------------\n*Order ID:* ${orderId}\n*Customer:* ${name}\n*Phone:* ${phone}\n*Address:* ${address}\n\n*Items:* ${itemsText}\n\n*Total Bill:* ৳${grandTotal.toFixed(2)}\n\nThank you!`;
      pendingWaURL = `https://wa.me/8801610622995?text=${encodeURIComponent(waMessage)}`;
      
      // / কাস্টম মডাল দেখানো (কোন ফোর্স রিডাইরেক্ট নয়)
      const modalMsg = `${langData[currentLang].orderSuccess}${orderId}. আপনি অর্ডার কনফার্ম করতে হোয়াটসঅ্যাপে এগিয়ে যেতে পারেন অথবা সরাসরি এখানে উইন্ডোটি বন্ধ করতে পারেন।`;
      document.getElementById('success-modal-msg').innerText = modalMsg;
      
      const waBtn = document.getElementById('success-wa-btn');
      waBtn.onclick = function() {
        window.open(pendingWaURL, '_blank');
        closeSuccessModal();
      };
      
      document.getElementById('order-success-modal').style.display = 'flex';
    } else {
      showToast("অর্ডার প্রসেস করতে ত্রুটি হয়েছে। দয়া করে আবার চেষ্টা করুন।", "error");
    }
  } catch(err) {
    showToast("নেটওয়ার্ক সমস্যা! অর্ডার সম্পন্ন হয়নি।", "error");
  }
}

function closeSuccessModal() {
  document.getElementById('order-success-modal').style.display = 'none';
  showView('home');
}

function buildProfilePage() {
  if(!currentUser) { showView('home'); return; }
  document.getElementById('prof-id').innerText = currentUser.userId || 'N/A';
  document.getElementById('prof-points').innerText = currentUser.points || '0';
  document.getElementById('prof-name').value = currentUser.name || '';
  document.getElementById('prof-phone').value = currentUser.phone || '';
  document.getElementById('prof-email').value = currentUser.email || '';
  document.getElementById('prof-address').value = currentUser.address || '';
}

async function updateCustomerProfile() {
  if(!currentUser) return;
  const name = document.getElementById('prof-name').value;
  const email = document.getElementById('prof-email').value;
  const address = document.getElementById('prof-address').value;
  
  const payload = {
    action: "updateProfile",
    phone: currentUser.phone,
    name: name,
    email: email,
    address: address
  };
  
  try {
    const res = await fetch(WEB_APP_URL, { method: "POST", body: JSON.stringify(payload) });
    const result = await res.json();
    if(result.success) {
      currentUser.name = name;
      currentUser.email = email;
      currentUser.address = address;
      localStorage.setItem('sacar_customer', JSON.stringify(currentUser));
      showToast(langData[currentLang].profUpdateSuccess, "success");
      syncAuthUI();
      showView('home');
    } else {
      showToast(result.message, "error");
    }
  } catch {
    showToast("প্রোফাইল আপডেট ব্যর্থ হয়েছে!", "error");
  }
}

/* পাসওয়ার্ড পরিবর্তন করার লজিক (Profile integration) */
async function changeUserPassword() {
  if(!currentUser) return;
  const oldPass = document.getElementById('prof-old-pass').value.trim();
  const newPass = document.getElementById('prof-new-pass').value.trim();
  
  if(!oldPass || !newPass) {
    showToast("দয়া করে উভয় পাসওয়ার্ডের ঘর পূরণ করুন।", "warning");
    return;
  }
  if(newPass.length < 6) {
    showToast("নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।", "warning");
    return;
  }
  
  const payload = {
    action: "changePassword",
    phone: currentUser.phone,
    oldPassword: oldPass,
    newPassword: newPass
  };
  
  try {
    const res = await fetch(WEB_APP_URL, { method: "POST", body: JSON.stringify(payload) });
    const result = await res.json();
    if(result.success) {
      showToast("পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!", "success");
      document.getElementById('prof-old-pass').value = '';
      document.getElementById('prof-new-pass').value = '';
    } else {
      showToast(result.message, "error");
    }
  } catch {
    showToast("পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে। নেটওয়ার্ক চেক করুন।", "error");
  }
}

function toggleSidebar(open) { document.getElementById('app-sidebar').classList.toggle('active', open); }
function toggleCartDrawer(open) {
  document.getElementById('cart-drawer').classList.toggle('active', open);
  document.getElementById('cart-overlay').style.display = open ? 'block' : 'none';
}

function openAuthModal() { document.getElementById('auth-modal').style.display = 'flex'; }
function closeAuthModal() { document.getElementById('auth-modal').style.display = 'none'; }
function switchAuthTab(type) {
  document.getElementById('tab-login-btn').classList.toggle('active', type === 'login');
  document.getElementById('tab-signup-btn').classList.toggle('active', type === 'signup');
  document.getElementById('login-form-container').style.display = type === 'login' ? 'block' : 'none';
  document.getElementById('signup-form-container').style.display = type === 'signup' ? 'block' : 'none';
}

async function handleUserLogin(e) {
  e.preventDefault();
  const phone = document.getElementById('login-phone').value;
  const pass = document.getElementById('login-pass').value;
  try {
    const res = await fetch(WEB_APP_URL, { method: "POST", body: JSON.stringify({ action:"login", phone:phone, password:pass }) });
    const result = await res.json();
    if(result.success) {
      currentUser = result.user;
      if(!currentUser.userId) {
        currentUser.userId = "SACAR-USR-" + Math.floor(1000 + Math.random() * 9000);
      }
      localStorage.setItem('sacar_customer', JSON.stringify(currentUser));
      syncAuthUI();
      closeAuthModal();
      showToast(`স্বাগতম, ${currentUser.name}! আপনি লগইন করেছেন।`, "success");
    } else {
      showToast(result.message, "error");
    }
  } catch { showToast("লগইন ব্যর্থ হয়েছে। নেটওয়ার্ক চেক করুন।", "error"); }
}

async function handleUserSignup(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value;
  const phone = document.getElementById('reg-phone').value;
  const email = document.getElementById('reg-email').value;
  const pass = document.getElementById('reg-pass').value;
  
  if(pass.length < 6) {
    showToast("পাসওয়ার্ড অবশ্যই কমপক্ষে ৬ অক্ষরের হতে হবে!", "warning");
    return;
  }
  
  try {
    const res = await fetch(WEB_APP_URL, { method: "POST", body: JSON.stringify({ action:"register", name:name, phone:phone, email:email, password:pass }) });
    const result = await res.json();
    if(result.success) {
      showToast("রেজিস্ট্রেশন সফল হয়েছে! এখন লগইন করুন।", "success");
      switchAuthTab('login');
    } else {
      showToast(result.message, "error");
    }
  } catch { showToast("রেজিস্ট্রেশন ব্যর্থ হয়েছে।", "error"); }
}

function checkActiveSession() {
  const session = localStorage.getItem('sacar_customer');
  if(session) {
    currentUser = JSON.parse(session);
    syncAuthUI();
  }
}

function syncAuthUI() {
  const area = document.getElementById('auth-status-area');
  if(currentUser) {
    area.innerHTML = `
      <div style="font-size:14px; font-weight:600; color:var(--primary-color); display:flex; align-items:center; gap:5px;">
        <i class="fas fa-user" style="cursor:pointer;" onclick="showView('profile')"></i> 
        <span style="cursor:pointer;" onclick="showView('profile')">${currentUser.name}</span>
        <span style="color:#dd6b20; background:#feebc8; padding:2px 6px; border-radius:10px; font-size:11px;">${currentUser.points} Pts</span>
        <button onclick="logoutCustomer()" style="background:none; border:none; color:#e53e3e; cursor:pointer; font-size:16px; margin-left:5px;"><i class="fas fa-sign-out-alt"></i></button>
      </div>
    `;
  } else {
    area.innerHTML = `<button class="nav-icon-btn" onclick="openAuthModal()"><i class="fas fa-user-circle"></i> <span class="btn-text">${langData[currentLang].loginNav}</span></button>`;
  }
}

function logoutCustomer() {
  localStorage.removeItem('sacar_customer');
  currentUser = null;
  syncAuthUI();
  showView('home');
  showToast("সফলভাবে লগআউট করা হয়েছে।", "info");
}

function toggleLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("sacar_lang", lang);
  applyLanguage();
  buildCategoryFilters();
  if(localProductDB.length > 0) displayProducts(localProductDB);
}

function applyLanguage() {
  const l = langData[currentLang];
  document.getElementById("promo-text").innerText = l.promo;
  document.getElementById("store-search").placeholder = l.search;
  document.getElementById("cat-sidebar-title").innerText = l.sidebarTitle;
  document.getElementById("hero-title").innerText = l.heroTitle;
  document.getElementById("hero-desc").innerText = l.heroDesc;
  document.getElementById("popular-cat-title").innerText = l.popularCat;
  if(document.getElementById("loading-txt")) document.getElementById("loading-txt").innerText = l.loading;
  document.getElementById("prof-view-title").innerText = l.profTitle;
  document.getElementById("prof-id-lbl").innerText = l.profId;
  document.getElementById("prof-pts-lbl").innerText = l.profPts;
  document.getElementById("prof-name-lbl").innerText = l.profName;
  document.getElementById("prof-phone-lbl").innerText = l.profPhone;
  document.getElementById("prof-email-lbl").innerText = l.profEmail;
  document.getElementById("prof-addr-lbl").innerText = l.profAddr;
  document.getElementById("prof-save-btn").innerText = l.profSave;
  document.getElementById("chk-title").innerText = l.chkTitle;
  document.getElementById("chk-name-lbl").innerText = l.chkName;
  document.getElementById("chk-phone-lbl").innerText = l.chkPhone;
  document.getElementById("chk-addr-lbl").innerText = l.chkAddr;
  document.getElementById("chk-zone-lbl").innerText = l.chkZone;
  document.getElementById("chk-zone-in").innerText = l.chkIn;
  document.getElementById("chk-zone-out").innerText = l.chkOut;
  document.getElementById("chk-pay-lbl").innerText = l.chkPay;
  document.getElementById("chk-cod-txt").innerText = l.chkCod;
  document.getElementById("chk-confirm-btn").innerHTML = l.chkBtn + '<i class="fas fa-check-circle"></i>';
  document.getElementById("sum-title").innerText = l.sumTitle;
  document.getElementById("sum-sub").innerText = l.sumSub;
  document.getElementById("sum-del").innerText = l.sumDel;
  document.getElementById("sum-total").innerText = l.sumTotal;
  document.getElementById("sum-pts").innerText = l.sumPts;
  document.getElementById("sum-pts-unit").innerText = l.sumPtsUnit;
  document.getElementById("cart-title").innerText = l.cartTitle;
  document.getElementById("cart-total-lbl").innerText = l.cartTotal;
  document.getElementById("cart-chk-btn").innerHTML = l.cartChk + '<i class="fas fa-arrow-right"></i>';
  document.getElementById("related-box-title").innerText = l.relatedTitle;
  document.getElementById("f-addr").innerText = l.fAddr;
  document.getElementById("f-hot").innerText = l.fHot;
  document.getElementById("f-links-title").innerText = l.fLinks;
  document.getElementById("f-link-home").innerText = l.fHome;
  document.getElementById("f-link-del").innerText = l.fDel;
  document.getElementById("f-link-terms").innerText = l.fTerms;
  document.getElementById("f-soc-title").innerText = l.fSoc;
  document.getElementById("f-copy").innerText = l.fCopy;
  syncAuthUI();
}

function toggleTheme(theme) {
  currentTheme = theme;
  localStorage.setItem("sacar_theme", theme);
  applyTheme(theme);
}

function applyTheme(theme) {
  document.body.removeAttribute("data-theme");
  if (theme === "dark") {
    document.body.setAttribute("data-theme", "dark");
  } else if (theme === "system") {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.setAttribute("data-theme", "dark");
    }
  }
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if(currentTheme === "system") applyTheme("system");
});

// সর্টিং বটম শিট ওপেন এবং ক্লোজ করার ফাংশন
function toggleSortBottomSheet(show) {
  const sheet = document.getElementById("sort-bottom-sheet");
  if (!sheet) return;
  if (show) {
    sheet.classList.add("active");
  } else {
    sheet.classList.remove("active");
  }
}

// পেজ লোড হওয়ার পর বাটনগুলোর জন্য ইভেন্ট লিসেনার সেটআপ করা
document.addEventListener("DOMContentLoaded", () => {
  // অফার বাটন ক্লিক হ্যান্ডলার
  const offerBtn = document.getElementById("offer-filter-btn");
  if (offerBtn) {
    offerBtn.addEventListener("click", () => {
      isOfferActive = !isOfferActive; // অন থাকলে অফ করবে, অফ থাকলে অন করবে
      if (isOfferActive) {
        offerBtn.classList.add("active");
      } else {
        offerBtn.classList.remove("active");
      }
      applyFiltersAndSort(); // ফিল্টার রান করবে
    });
  }

  // সর্ট অপশন বাটন ক্লিক হ্যান্ডলার (বটম শিটের ভেতরের ৩টি বাটন)
  const sortOptions = document.querySelectorAll(".sort-option-btn");
  sortOptions.forEach(btn => {
    btn.addEventListener("click", (e) => {
      // আগের একটিভ ক্লাস রিমুভ করে নতুনটায় অ্যাড করা
      sortOptions.forEach(opt => opt.classList.remove("active"));
      const clickedBtn = e.currentTarget;
      clickedBtn.classList.add("active");

      // সর্টের মান আপডেট করা
      activeSort = clickedBtn.getAttribute("data-value");
      
      // সর্ট বাটনটির টেক্সট ও স্টাইল পরিবর্তন করা (↑↓ Sort)
      const sortTriggerBtn = document.getElementById("sort-trigger-btn");
      if (activeSort !== "default") {
        sortTriggerBtn.classList.add("active");
        if (activeSort === "low-high") {
          sortTriggerBtn.innerHTML = `<i class="fas fa-arrow-up"></i> কম-বেশি`;
        } else {
          sortTriggerBtn.innerHTML = `<i class="fas fa-arrow-down"></i> বেশি-কম`;
        }
      } else {
        sortTriggerBtn.classList.remove("active");
        sortTriggerBtn.innerHTML = `<i class="fas fa-sort"></i> সর্ট`;
      }

      toggleSortBottomSheet(false); // বটম শিট বন্ধ করা
      applyFiltersAndSort(); // ফিল্টার ও সর্ট রান করা
    });
  });
});
// ৩টি কন্ডিশন একসাথে মেলাবার কেন্দ্রীয় ফিল্টার ফাংশন
// সংশোধিত কেন্দ্রীয় ফিল্টার ও সর্ট ফাংশন
// ৩টি কন্ডিশন একসাথে মেলাবার কেন্দ্রীয় ফিল্টার ফাংশন (চূড়ান্ত সংশোধিত - অফার প্রায়োরিটি সহ)
// ৩টি কন্ডিশন একসাথে মেলাবার কেন্দ্রীয় ফিল্টার ফাংশন (চূড়ান্ত সংশোধিত - অফার প্রায়োরিটি সহ)
function applyFiltersAndSort() {
  let filteredProducts = [...localProductDB];

  // অফার চেক করার হেল্পার ফাংশন (সবার উপরে নিয়ে আসা হয়েছে যেন ফিল্টারে ইরর না আসে)
  const checkHasOffer = (p) => {
    const offerVal = String(p.offer || p.discount || "").trim();
    const price = parseFloat(p.price) || 0;
    const discPrice = parseFloat(p.discount_price) || 0;
    
    const hasDiscountPrice = (discPrice > 0 && discPrice < price);
    const hasOfferText = (offerVal !== "" && offerVal !== "0" && offerVal.toLowerCase() !== "no" && offerVal.toLowerCase() !== "false");
    
    return hasDiscountPrice || hasOfferText;
  };

  // ১. মেইন ক্যাটাগরি ফিল্টার
  if (activeMainCategory !== "ALL") {
    filteredProducts = filteredProducts.filter(p => (p.category || p.Category) === activeMainCategory);
  }

  // ২. সাব-ক্যাটাগরি ফিল্টার
  if (activeSubCategory !== "ALL") {
    filteredProducts = filteredProducts.filter(p => (p.sub_category || p.Sub_Category || p.subCategory) === activeSubCategory);
  }

  // ৩. একটিভ অফার ফিল্টার (অফার বাটন অন থাকলে অফার ছাড়া সব প্রোডাক্ট বাদ যাবে)
  if (isOfferActive) {
    filteredProducts = filteredProducts.filter(p => checkHasOffer(p));
  }

  // ৪. সার্চ ফিল্টার
  const searchInput = document.getElementById('store-search');
  if (searchInput && searchInput.value.trim() !== "") {
    const q = searchInput.value.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      (p.name && p.name.toLowerCase().includes(q)) || 
      (p.sku && p.sku.toLowerCase().includes(q))
    );
  }

  // ৫. স্টক বাফার লক (ইন-স্টক ও আউট-অফ-স্টক আলাদা করা)
  const inStock = [];
  const outStock = [];
  filteredProducts.forEach(p => {
    const currentAvailable = (parseInt(p.Stock) || 0) - (parseInt(p.Sales) || 0);
    const buffer = parseInt(p.Buffer) || 0;
    if (currentAvailable <= buffer) outStock.push(p);
    else inStock.push(p);
  });

  // ৬. সর্টিং হ্যান্ডেলার (দাম অনুযায়ী ছোট থেকে বড় বা বড় থেকে ছোট সাজানো)
  const sortGroup = (array) => {
    return array.sort((a, b) => {
      const priceA = parseFloat(a.discount_price) > 0 ? parseFloat(a.discount_price) : (parseFloat(a.price) || 0);
      const priceB = parseFloat(b.discount_price) > 0 ? parseFloat(b.discount_price) : (parseFloat(b.price) || 0);

      if (activeSort === "low-high") {
        return priceA - priceB;
      } else if (activeSort === "high-low") {
        return priceB - priceA;
      }
      return 0; 
    });
  };

  // ইন-স্টক এবং আউট-অফ-স্টক গ্রুপকে আলাদাভাবে সর্ট করা
  const sortedInStock = sortGroup(inStock);
  const sortedOutStock = sortGroup(outStock);

  // ইন-স্টক আগে এবং আউট-অফ-স্টক পরে রেখে ফাইনাল লিস্ট তৈরি
  const finalProductsList = [...sortedInStock, ...sortedOutStock];

  // ৭. স্লাইডার অথবা গ্রিড ভিউতে রেন্ডার করা
  const grid = document.getElementById('main-products-grid');
  if (!grid) return;

  const isAllMode = activeMainCategory === "ALL";

  // হোমপেজে "সব পণ্য" একটিভ থাকলে এবং কোনো ফিল্টার চালু না থাকলে ডিফল্ট স্লাইডার দেখাবে
  if (isAllMode && !isOfferActive && activeSort === "default" && (!searchInput || searchInput.value.trim() === "")) {
    displayProducts(localProductDB); 
  } else {
    // যেকোনো ফিল্টার বা ক্যাটাগরি সিলেক্টেড থাকলে সরাসরি গ্রিড ভিউ দেখাবে
    grid.style.display = "grid";
    grid.innerHTML = '';
    
    if (finalProductsList.length === 0) {
      grid.innerHTML = '<div style="text-align:center; padding:20px; width:100%; color:var(--text-color);">কোনো প্রোডাক্ট পাওয়া যায়নি!</div>';
      return;
    }

    finalProductsList.forEach(p => {
      const card = createProductCardHTML(p);
      grid.appendChild(card);
    });
  }
}
