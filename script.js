const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwTk1lU-qzD_4dvefbSOBj6ZDDTuYUCmhJs4uBhKufI8REHBlMtb9fuLu59sV1R_1bg/exec";
let localProductDB = [];
let cart = JSON.parse(localStorage.getItem("sacar_cart")) || [];
let currentUser = null;
let selectedProductDesc = "";
let currentLang = localStorage.getItem("sacar_lang") || "en";
let currentTheme = localStorage.getItem("sacar_theme") || "system";
let activeMainCategory = "ALL";
let activeSubCategory = "ALL";
let isOfferActive = false;
let activeSort = "default";

const langData = {
  bn: {
    pageTitle: "SACAR Mart - প্রিমিয়াম অনলাইন স্টোর",
    promo: "সাকার মার্টে আপনাকে স্বাগতম! কেনাকাটা করুন আর জিতে নিন আকর্ষণীয় রিওয়ার্ড পয়েন্ট! 🛍️",
    search: "পছন্দের প্রোডাক্টটি খুঁজুন...",
    loginNav: "লগইন",
    sidebarTitle: "ক্যাটাগরি সমূহ",
    allProducts: "সকল প্রোডাক্টস",
    popularCat: "জনপ্রিয় ক্যাটাগরি",
    heroTitle: "সেরা মানের পণ্য, সাশ্রয়ী মূল্য!",
    heroDesc: "সুবর্ণচরের নির্ভরযোগ্য অনলাইন শপ সাকার মার্ট থেকে ঘরে বসেই অর্ডার করুন আপনার নিত্যপ্রয়োজনীয় পণ্য।",
    loading: "প্রোডাক্ট লোড হচ্ছে, দয়া করে অপেক্ষা করুন...",
    sortBtn: "সর্ট",
    offerBtn: "অফার",
    sortLowHigh: "কম-বেশি",
    sortHighLow: "বেশি-কম",
    sortSheetTitle: "প্রোডাক্ট সাজান (Sort By)",
    sortDefault: "ডিফল্ট",
    sortLowHighFull: "দাম: কম থেকে বেশি",
    sortHighLowFull: "দাম: বেশি থেকে কম",
    noProductsFound: "কোনো প্রোডাক্ট পাওয়া যায়নি!",
    outOfStock: "স্টক শেষ",
    viewAllBtn: "সব দেখুন",
    subAllLabel: (n) => `সব (${n})`,
    discountOff: "ছাড়",
    chkTitle: "অর্ডার কনফার্ম করুন",
    chkName: "আপনার নাম *",
    chkPhone: "মোবাইল নাম্বার *",
    chkAddr: "পূর্ণাঙ্গ ডেলিভারি ঠিকানা *",
    chkAddrPh: "গ্রাম/রোড, ইউনিয়ন, উপজেলা এবং জেলা পরিষ্কার করে লিখুন",
    chkNamePh: "আপনার পুরো নাম লিখুন",
    chkPhonePh: "চলতি একটি মোবাইল নাম্বার দিন",
    chkZone: "ডেলিভারি এরিয়া নির্বাচন করুন",
    chkIn: "সুবর্ণচরের ভিতরে (৳৬০)",
    chkOut: "সুবর্ণচরের বাইরে (৳১৫০)",
    chkPay: "পেমেন্ট পদ্ধতি",
    chkCod: "ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে টাকা পরিশোধ)",
    chkBtn: "অর্ডার নিশ্চিত করুন ",
    sumTitle: "অর্ডার সামারি",
    sumSub: "সাবটোটাল:",
    sumDel: "ডেলিভারি চার্জ:",
    sumTotal: "সর্বমোট বিল:",
    sumPts: "অর্জিত রিওয়ার্ড পয়েন্ট:",
    sumPtsUnit: "পয়েন্ট",
    cartTitle: "শপিং কার্ট",
    cartTotal: "মোট হিসাব:",
    cartChk: "চেকআউট করতে এগিয়ে যান ",
    relatedTitle: "সম্পর্কিত পণ্যসমূহ (Related Products)",
    noRelatedProducts: "কোনো সম্পর্কিত পণ্য পাওয়া যায়নি।",
    fAddr: "হাজী ইদ্রিস মিয়া বাজার, সুবর্ণচর, নোয়াখালী।",
    fHot: "হটলাইন: 01610-622995",
    fEmailLbl: "ইমেইল:",
    fLinks: "জরুরী লিংক",
    fHome: "হোমপেজ",
    fDel: "ডেলিভারি পলিসি",
    fTerms: "শর্তাবলী ও নিয়মসমূহ",
    fSoc: "আমাদের সোশ্যাল মিডিয়া",
    fCopy: "© 2026 SACAR Mart. সাকার মার্ট সুবর্ণচরের একটি নির্ভরযোগ্য প্রতিষ্ঠান। সর্বস্বত্ব সংরক্ষিত।",
    allBtn: "সব পণ্য",
    orderBtn: "অর্ডার করুন",
    addCartBtn: "কার্টে যুক্ত করুন",
    pointsUnit: "পয়েন্ট",
    tabInfo: "পণ্য বিবরণ",
    tabPolicy: "ডেলিভারি পলিসি",
    policyText: "সুবর্ণচরের ভিতরে সর্বোচ্চ ২৪-৪৮ ঘণ্টার মধ্যে হোম ডেলিভারি নিশ্চিত করা হয়। ডেলিভারি ম্যানের সামনে প্রোডাক্ট চেক করে রিসিভ করবেন।",
    emptyCart: "আপনার কার্টটি খালি!",
    orderSuccess: "🎉 আপনার অর্ডারটি সফলভাবে গৃহীত হয়েছে! অর্ডার আইডি: ",
    successTitle: "অর্ডার সফল হয়েছে!",
    successOkBtn: "ঠিক আছে",
    profTitle: "আপনার প্রোফাইল",
    profId: "ইউজার আইডি (ইউনিক):",
    profPts: "মোট রিওয়ার্ড পয়েন্ট:",
    profName: "আপনার নাম *",
    profPhone: "মোবাইল নাম্বার (পরিবর্তনযোগ্য নয়)",
    profEmail: "ইমেইল এড্রেস",
    profAddr: "স্থায়ী ডেলিভারি ঠিকানা",
    profAddrPh: "আপনার পুর্নাঙ্গ ঠিকানা লিখুন",
    profSave: "প্রোফাইল আপডেট করুন",
    profUpdateSuccess: "প্রোফাইল সফলভাবে আপডেট করা হয়েছে!",
    profPassTitle: "পাসওয়ার্ড পরিবর্তন করুন",
    profOldPassLbl: "বর্তমান পাসওয়ার্ড *",
    profOldPassPh: "বর্তমান পাসওয়ার্ড দিন",
    profNewPassLbl: "নতুন পাসওয়ার্ড *",
    profNewPassPh: "নূন্যতম ৬ অক্ষরের পাসওয়ার্ড দিন",
    profPassBtn: "পাসওয়ার্ড আপডেট করুন",
    tabLogin: "লগইন",
    tabSignup: "রেজিস্ট্রেশন",
    loginPhonePh: "মোবাইল নাম্বার",
    loginPassPh: "পাসওয়ার্ড",
    loginBtn: "লগইন করুন",
    regNamePh: "আপনার পুরো নাম",
    regPhonePh: "মোবাইল নাম্বার",
    regEmailPh: "ইমেইল এড্রেস (ঐচ্ছিক)",
    regPassPh: "পাসওয়ার্ড তৈরি করুন (নূন্যতম ৬ অক্ষর)",
    regBtn: "নতুন অ্যাকাউন্ট খুলুন",
    maxStockToast: (n) => `দুঃখিত, এই পণ্যের সর্বোচ্চ ${n} পিস স্টকে আছে।`,
    outOfStockToast: "দুঃখিত, এই প্রোডাক্টটি আউট অফ স্টক!",
    bufferMaxToast: (n) => `দুঃখিত, বাফার সিকিউরিটির কারণে এই পণ্যের সর্বোচ্চ ${n} পিস অর্ডার করা সম্ভব।`,
    bufferReduceToast: (n) => `দুঃখিত, বাফার সিকিউরিটির কারণে পরিমাণ কমিয়ে সর্বোচ্চ ${n} পিস করা হলো।`,
    removedFromCart: "পণ্যটি কার্ট থেকে সরানো হয়েছে।",
    orderProcessError: "অর্ডার প্রসেস করতে ত্রুটি হয়েছে। দয়া করে আবার চেষ্টা করুন।",
    networkErrorOrder: "নেটওয়ার্ক সমস্যা! অর্ডার সম্পন্ন হয়নি।",
    profileUpdateFail: "প্রোফাইল আপডেট ব্যর্থ হয়েছে!",
    fillBothPasswords: "দয়া করে উভয় পাসওয়ার্ডের ঘর পূরণ করুন।",
    passwordMinLength: "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।",
    passwordChanged: "পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!",
    passwordChangeFail: "পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে। নেটওয়ার্ক চেক করুন।",
    welcomeBack: (name) => `স্বাগতম, ${name}! আপনি লগইন করেছেন।`,
    loginFailNetwork: "লগইন ব্যর্থ হয়েছে। নেটওয়ার্ক চেক করুন।",
    signupPassMinLength: "পাসওয়ার্ড অবশ্যই কমপক্ষে ৬ অক্ষরের হতে হবে!",
    registerSuccess: "রেজিস্ট্রেশন সফল হয়েছে! এখন লগইন করুন।",
    registerFail: "রেজিস্ট্রেশন ব্যর্থ হয়েছে।",
    logoutSuccess: "সফলভাবে লগআউট করা হয়েছে।",
    loadError: "প্রোডাক্ট লোড করতে ত্রুটি হয়েছে।"
  },
  en: {
    pageTitle: "SACAR Mart - Premium Online Store",
    promo: "Welcome to SACAR Mart! Shop & win exciting reward points! 🛍️",
    search: "Search for your favorite product...",
    loginNav: "Login",
    sidebarTitle: "All Categories",
    allProducts: "All Products",
    popularCat: "Popular Categories",
    heroTitle: "Best Quality Products, Affordable Price!",
    heroDesc: "Order your daily essentials online from Subarnachar's trusted shop SACAR Mart.",
    loading: "Loading products, please wait...",
    sortBtn: "Sort",
    offerBtn: "Offer",
    sortLowHigh: "Low-High",
    sortHighLow: "High-Low",
    sortSheetTitle: "Sort Products",
    sortDefault: "Default",
    sortLowHighFull: "Price: Low to High",
    sortHighLowFull: "Price: High to Low",
    noProductsFound: "No products found!",
    outOfStock: "Out of Stock",
    viewAllBtn: "View All",
    subAllLabel: (n) => `All (${n})`,
    discountOff: "OFF",
    chkTitle: "Confirm Order",
    chkName: "Your Name *",
    chkPhone: "Mobile Number *",
    chkAddr: "Full Delivery Address *",
    chkAddrPh: "Clearly write Village/Road, Union, Upazila and District",
    chkNamePh: "Enter your full name",
    chkPhonePh: "Enter an active mobile number",
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
    noRelatedProducts: "No related products found.",
    fAddr: "Haji Idris Miah Bazar, Subarnachar, Noakhali.",
    fHot: "Hotline: 01610-622995",
    fEmailLbl: "Email:",
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
    successTitle: "Order Successful!",
    successOkBtn: "OK",
    profTitle: "Your Profile",
    profId: "User ID (Unique):",
    profPts: "Total Reward Points:",
    profName: "Your Name *",
    profPhone: "Mobile Number (Non-editable)",
    profEmail: "Email Address",
    profAddr: "Permanent Delivery Address",
    profAddrPh: "Enter your full address",
    profSave: "Update Profile",
    profUpdateSuccess: "Profile updated successfully!",
    profPassTitle: "Change Password",
    profOldPassLbl: "Current Password *",
    profOldPassPh: "Enter your current password",
    profNewPassLbl: "New Password *",
    profNewPassPh: "Enter a password of at least 6 characters",
    profPassBtn: "Update Password",
    tabLogin: "Login",
    tabSignup: "Register",
    loginPhonePh: "Mobile Number",
    loginPassPh: "Password",
    loginBtn: "Login",
    regNamePh: "Your Full Name",
    regPhonePh: "Mobile Number",
    regEmailPh: "Email Address (Optional)",
    regPassPh: "Create a password (min 6 characters)",
    regBtn: "Create New Account",
    maxStockToast: (n) => `Sorry, a maximum of ${n} pcs of this product are in stock.`,
    outOfStockToast: "Sorry, this product is out of stock!",
    bufferMaxToast: (n) => `Sorry, due to buffer security, a maximum of ${n} pcs of this product can be ordered.`,
    bufferReduceToast: (n) => `Sorry, due to buffer security, the quantity has been reduced to a maximum of ${n} pcs.`,
    removedFromCart: "The item has been removed from the cart.",
    orderProcessError: "Error processing the order. Please try again.",
    networkErrorOrder: "Network issue! The order was not placed.",
    profileUpdateFail: "Failed to update profile!",
    fillBothPasswords: "Please fill in both password fields.",
    passwordMinLength: "The new password must be at least 6 characters.",
    passwordChanged: "Password changed successfully!",
    passwordChangeFail: "Failed to change password. Please check your network.",
    welcomeBack: (name) => `Welcome, ${name}! You have logged in.`,
    loginFailNetwork: "Login failed. Please check your network.",
    signupPassMinLength: "Password must be at least 6 characters!",
    registerSuccess: "Registration successful! Please login now.",
    registerFail: "Registration failed.",
    logoutSuccess: "Logged out successfully.",
    loadError: "Error loading products."
  }
};

window.onload = function() {
  document.getElementById("lang-toggle").value = currentLang;
  document.getElementById("theme-toggle").value = currentTheme;
  document.documentElement.lang = currentLang;
  applyTheme(currentTheme);
  applyLanguage();
  loadProductsFromSheet();
  checkActiveSession();
};

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
    hideStoreControls();
    const response = await fetch(`${WEB_APP_URL}?action=getProducts`);
    localProductDB = await response.json();
    buildCategoryFilters();
    applyFiltersAndSort();
    refreshCartUI();
    showStoreControls();
  } catch (e) {
    console.error(e);
    document.getElementById('main-products-grid').innerHTML = `<p>${langData[currentLang].loadError}</p>`;
  }
}

function hideStoreControls() {
  const subSection = document.getElementById("sub-category-section");
  if (subSection) subSection.classList.add("controls-hidden");
}

function showStoreControls() {
  const subSection = document.getElementById("sub-category-section");
  if (subSection) subSection.classList.remove("controls-hidden");
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

function resetSortAndOfferFilters() {
  isOfferActive = false;
  const offerBtn = document.getElementById("offer-filter-btn");
  if (offerBtn) offerBtn.classList.remove("active");

  activeSort = "default";
  const sortTriggerBtn = document.getElementById("sort-trigger-btn");
  if (sortTriggerBtn) sortTriggerBtn.classList.remove("active");
  updateSortTriggerLabel();

  document.querySelectorAll(".sort-option-btn").forEach(opt => opt.classList.remove("active"));
  const defaultSortOpt = document.getElementById("sort-opt-default");
  if (defaultSortOpt) defaultSortOpt.classList.add("active");
}

function updateSortTriggerLabel() {
  const sortTriggerBtn = document.getElementById("sort-trigger-btn");
  if (!sortTriggerBtn) return;
  const icon = sortTriggerBtn.querySelector("i");
  const label = sortTriggerBtn.querySelector("span");
  const l = langData[currentLang];
  if (activeSort === "low-high") {
    if (icon) icon.className = "fas fa-arrow-up";
    if (label) label.innerText = l.sortLowHigh;
  } else if (activeSort === "high-low") {
    if (icon) icon.className = "fas fa-arrow-down";
    if (label) label.innerText = l.sortHighLow;
  } else {
    if (icon) icon.className = "fas fa-sort";
    if (label) label.innerText = l.sortBtn;
  }
}

function filterCategory(catName, element) {
  document.querySelectorAll(".chip").forEach(el => el.classList.remove("active"));
  document.querySelectorAll("#sidebar-categories li").forEach(el => el.classList.remove("active"));

  if (element) {
    element.classList.add("active");
  } else {
    const targetText = catName.toLowerCase() === 'all' ? (langData[currentLang].allBtn || "All") : catName;
    document.querySelectorAll(".chip").forEach(c => {
      const text = c.querySelector('span') ? c.querySelector('span').innerText.trim() : c.innerText.trim();
      if(text === targetText) {
        c.classList.add("active");
      }
    });
  }

  activeMainCategory = catName.toLowerCase() === 'all' ? 'ALL' : catName;
  activeSubCategory = "ALL";
  resetSortAndOfferFilters();

  const subChipsContainer = document.getElementById("sub-category-chips");

  if (activeMainCategory === "ALL") {
    if (subChipsContainer) subChipsContainer.innerHTML = "";
    applyFiltersAndSort();
    return;
  }

  buildSubCategoryChips();
  applyFiltersAndSort();
}

function buildSubCategoryChips() {
  const subChipsContainer = document.getElementById("sub-category-chips");
  if (!subChipsContainer) return;
  if (activeMainCategory === "ALL") { subChipsContainer.innerHTML = ""; return; }

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
    let chipsHTML = `<button class="sub-chip active" onclick="filterSubCategory('ALL', this)">${langData[currentLang].subAllLabel(subCategories.length)}</button>`;
    subCategories.forEach(sub => {
      chipsHTML += `<button class="sub-chip" onclick="filterSubCategory('${sub}', this)">${sub}</button>`;
    });
    subChipsContainer.innerHTML = chipsHTML;
  } else {
    subChipsContainer.innerHTML = "";
  }
}

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
    grid.innerHTML = `<div style="text-align:center; padding:20px; width:100%; color:var(--text-color);">${langData[currentLang].noProductsFound}</div>`;
    return;
  }

  const activeChip = document.querySelector('.chip.active');
  const isAllMode = activeChip ? (activeChip.innerText.includes(langData[currentLang].allProducts) || activeChip.innerText.includes(langData[currentLang].allBtn)) : true;

  if (!isAllMode || products.length < localProductDB.length) {
    grid.style.display = "grid";

    const inStock = [];
    const outStock = [];
    products.forEach(p => {
      const currentAvailable = (parseInt(p.Stock) || 0) - (parseInt(p.Sales) || 0);
      if (currentAvailable <= (parseInt(p.Buffer) || 0)) outStock.push(p);
      else inStock.push(p);
    });

    let finalProducts = [...inStock, ...outStock];
    if(activeSort === 'low-high') {
      finalProducts.sort((a,b) => (parseFloat(a.discount_price) > 0 ? parseFloat(a.discount_price) : parseFloat(a.price) || 0) - (parseFloat(b.discount_price) > 0 ? parseFloat(b.discount_price) : parseFloat(b.price) || 0));
    } else if(activeSort === 'high-low') {
      finalProducts.sort((a,b) => (parseFloat(b.discount_price) > 0 ? parseFloat(b.discount_price) : parseFloat(b.price) || 0) - (parseFloat(a.discount_price) > 0 ? parseFloat(a.discount_price) : parseFloat(a.price) || 0));
    }

    finalProducts.forEach(p => {
      const card = createProductCardHTML(p);
      grid.appendChild(card);
    });
    return;
  }

  grid.style.display = "block";

  const categories = [];
  products.forEach(p => {
    if(p.Category && !categories.includes(p.Category)) categories.push(p.Category);
  });

  categories.forEach(cat => {
    const catProducts = products.filter(p => p.Category === cat);
    if(catProducts.length === 0) return;

    const inStock = [];
    const outStock = [];
    catProducts.forEach(p => {
      const currentAvailable = (parseInt(p.Stock) || 0) - (parseInt(p.Sales) || 0);
      if (currentAvailable <= (parseInt(p.Buffer) || 0)) outStock.push(p);
      else inStock.push(p);
    });
    const sortedCatProducts = [...inStock, ...outStock];

    const section = document.createElement('div');
    section.className = 'category-slider-section';

    const header = document.createElement('div');
    header.className = 'slider-section-header';
    header.innerHTML = `
      <h3>${cat}</h3>
      <button class="view-all-btn" onclick="filterByCategoryName('${cat}')">${langData[currentLang].viewAllBtn} <i class="fas fa-chevron-right"></i></button>
    `;
    section.appendChild(header);

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

function filterByCategoryName(catName) {
  document.querySelectorAll('.chip').forEach(c => {
    const text = c.querySelector('span') ? c.querySelector('span').innerText.trim() : c.innerText.trim();
    if(text === catName) {
      c.click();
      c.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  });
}

function createProductCardHTML(p) {
  const stock = parseInt(p.Stock) || 0;
  const sales = parseInt(p.Sales) || 0;
  const buffer = parseInt(p.Buffer) || 0;
  const currentAvailableStock = stock - sales;
  const sellableStock = currentAvailableStock - buffer;
  const isOutOfStock = currentAvailableStock <= buffer;

  const img = p.image_url || 'https://via.placeholder.com/200?text=No+Image';
  const price = parseFloat(p.price) || 0;
  const discPrice = parseFloat(p.discount_price) || 0;
  const points = parseInt(p.points) || 0;
  const l = langData[currentLang];

  let discountBadge = '';
  let priceHTML = `<span class="current-price">৳${price.toFixed(2)}</span>`;
  if(discPrice > 0 && discPrice < price) {
    priceHTML = `<span class="original-price">৳${price.toFixed(2)}</span><span class="current-price">৳${discPrice.toFixed(2)}</span>`;
    const discPercentage = Math.round(((price - discPrice) / price) * 100);
    discountBadge = `<div class="discount-badge">${discPercentage}% ${l.discountOff}</div>`;
  }

  const cartItem = cart.find(item => item.sku === p.sku);
  const itemQty = cartItem ? cartItem.qty : 0;

  let buttonHTML = '';
  if (isOutOfStock) {
    buttonHTML = `
      <button class="order-btn" style="background-color: #a0aec0; cursor: not-allowed;" disabled>
        <i class="fas fa-exclamation-triangle"></i> ${l.outOfStock}
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
        <i class="fas fa-shopping-basket"></i> ${l.orderBtn}
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
    <div class="product-points"><i class="fas fa-coins"></i> +${points} ${l.pointsUnit}</div>
    <div class="card-action-area">${buttonHTML}</div>
  `;
  return card;
}

function handleSearch() {
  activeMainCategory = "ALL";
  activeSubCategory = "ALL";
  document.querySelectorAll(".chip").forEach(el => el.classList.remove("active"));
  applyFiltersAndSort();
}

function addItemToCart(sku) {
  const product = localProductDB.find(p => p.sku === sku);
  if(!product) return;
  const l = langData[currentLang];

  const stock = parseInt(product.Stock) || 0;
  const sales = parseInt(product.Sales) || 0;
  const maxAvailable = stock - sales;

  const existing = cart.find(item => item.sku === sku);
  if(existing) {
    if(existing.qty >= maxAvailable) {
      showToast(l.maxStockToast(maxAvailable), "warning");
      return;
    }
    existing.qty++;
  } else {
    if(maxAvailable <= 0) {
      showToast(l.outOfStockToast, "warning");
      return;
    }
    cart.push({ sku: product.sku, name: product.name, price: parseFloat(product.price)||0, qty: 1, points: parseInt(product.points)||0 });
  }
  refreshCartUI();
  applyFiltersAndSort();
}

function changeCardQty(sku, change) {
  const item = cart.find(i => i.sku === sku);
  const l = langData[currentLang];

  if (item) {
    if (change > 0) {
      const prod = localProductDB.find(p => p.sku === sku);
      if (prod) {
        const stock = parseInt(prod.Stock) || 0;
        const sales = parseInt(prod.Sales) || 0;
        const buffer = parseInt(prod.Buffer) || 0;
        const sellableStock = stock - sales - buffer;

        if (item.qty >= sellableStock) {
          showToast(l.bufferMaxToast(sellableStock), "warning");
          return;
        }
      }
    }

    const newQty = item.qty + change;
    if (newQty <= 0) {
      removeCartItem(sku);
      return;
    } else {
      item.qty = newQty;
      refreshCartUI();
    }
  } else if (change > 0) {
    addItemToCart(sku);
    return;
  }

  applyFiltersAndSort();
}

function directCardQty(sku, val) {
  let newQty = parseInt(val) || 1;
  if (newQty < 1) newQty = 1;
  const l = langData[currentLang];

  const prod = localProductDB.find(p => p.sku === sku);

  if (prod) {
    const stock = parseInt(prod.Stock) || 0;
    const sales = parseInt(prod.Sales) || 0;
    const buffer = parseInt(prod.Buffer) || 0;
    const sellableStock = stock - sales - buffer;

    if (newQty > sellableStock) {
      showToast(l.bufferReduceToast(sellableStock), "warning");
      newQty = sellableStock;
    }
  }

  const item = cart.find(i => i.sku === sku);
  if (item) {
    item.qty = newQty;
    refreshCartUI();
  }

  applyFiltersAndSort();
}

function updateCartQty(sku, newQty) {
  let qty = parseInt(newQty) || 1;
  if(qty < 1) qty = 1;
  const l = langData[currentLang];

  const prod = localProductDB.find(p => p.sku === sku);

  if(prod) {
    const stock = parseInt(prod.Stock) || 0;
    const sales = parseInt(prod.Sales) || 0;
    const buffer = parseInt(prod.Buffer) || 0;
    const sellableStock = stock - sales - buffer;

    if(qty > sellableStock) {
      showToast(l.bufferReduceToast(sellableStock), "warning");
      qty = sellableStock;
    }
  }

  const item = cart.find(i => i.sku === sku);
  if(item) {
    item.qty = qty;
    refreshCartUI();
    applyFiltersAndSort();
  }
}

function removeCartItem(sku) {
  cart = cart.filter(i => i.sku !== sku);
  refreshCartUI();
  showToast(langData[currentLang].removedFromCart, "warning");
  applyFiltersAndSort();
}

function refreshCartUI() {
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
      <div class="cart-item-row">
        <div class="cart-item-info">
          <span class="cart-item-name">${item.name}</span>
          <small class="cart-item-price">৳${item.price.toFixed(2)}</small>
        </div>
        <div class="cart-item-controls">
          <input type="number" min="1" value="${item.qty}" class="cart-item-qty-input" onchange="updateCartQty('${item.sku}', this.value)">
          <button onclick="removeCartItem('${item.sku}')" class="cart-item-remove-btn"><i class="fas fa-trash-alt"></i></button>
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
  const l = langData[currentLang];
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
        <button class="tab-btn active" onclick="switchProductTab('info', this)">${l.tabInfo}</button>
        <button class="tab-btn" onclick="switchProductTab('policy', this)">${l.tabPolicy}</button>
      </div>
      <div id="modal-tab-body" style="font-size:14px; line-height:1.6; min-height:80px;">
        ${selectedProductDesc}
      </div>
      <button class="order-btn" style="margin-top:20px;" onclick="addItemToCart('${p.sku}'); closeDetailsModal();"><i class="fas fa-shopping-basket"></i> ${l.addCartBtn}</button>
    </div>
  `;
  displayRelatedProducts(p.category, p.sku);
  document.getElementById('details-modal').style.display = 'flex';
}

function displayRelatedProducts(category, currentSku) {
  const relatedGrid = document.getElementById('related-products-grid');
  const l = langData[currentLang];
  relatedGrid.innerHTML = '';
  const related = localProductDB.filter(p => p.category === category && p.sku !== currentSku);
  if(related.length === 0) {
    relatedGrid.innerHTML = `<p style="font-size:13px; color:#a0aec0;">${l.noRelatedProducts}</p>`;
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
      <button class="order-btn" style="padding:5px; font-size:12px;" onclick="addItemToCart('${p.sku}')">${l.orderBtn}</button>
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

async function submitCustomerOrder(e) {
  e.preventDefault();
  if(cart.length === 0) return;
  const l = langData[currentLang];
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

      const modalMsg = `${l.orderSuccess}${orderId}`;
      document.getElementById('success-modal-msg').innerText = modalMsg;

      document.getElementById('order-success-modal').style.display = 'flex';
    } else {
      showToast(l.orderProcessError, "error");
    }
  } catch(err) {
    showToast(l.networkErrorOrder, "error");
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
  const l = langData[currentLang];
  const name = document.getElementById('prof-name').value;
  const email = document.getElementById('prof-email').value;
  const address = document.getElementById('prof-address').value;

  const payload = {
    action: "updateProfile",
    lang: currentLang,
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
      showToast(l.profUpdateSuccess, "success");
      syncAuthUI();
      showView('home');
    } else {
      showToast(result.message || l.profileUpdateFail, "error");
    }
  } catch {
    showToast(l.profileUpdateFail, "error");
  }
}

async function changeUserPassword() {
  if(!currentUser) return;
  const l = langData[currentLang];
  const oldPass = document.getElementById('prof-old-pass').value.trim();
  const newPass = document.getElementById('prof-new-pass').value.trim();

  if(!oldPass || !newPass) {
    showToast(l.fillBothPasswords, "warning");
    return;
  }
  if(newPass.length < 6) {
    showToast(l.passwordMinLength, "warning");
    return;
  }

  const payload = {
    action: "changePassword",
    lang: currentLang,
    phone: currentUser.phone,
    oldPassword: oldPass,
    newPassword: newPass
  };

  try {
    const res = await fetch(WEB_APP_URL, { method: "POST", body: JSON.stringify(payload) });
    const result = await res.json();
    if(result.success) {
      showToast(l.passwordChanged, "success");
      document.getElementById('prof-old-pass').value = '';
      document.getElementById('prof-new-pass').value = '';
    } else {
      showToast(result.message || l.passwordChangeFail, "error");
    }
  } catch {
    showToast(l.passwordChangeFail, "error");
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
  const l = langData[currentLang];
  const phone = document.getElementById('login-phone').value;
  const pass = document.getElementById('login-pass').value;
  try {
    const res = await fetch(WEB_APP_URL, { method: "POST", body: JSON.stringify({ action:"login", lang: currentLang, phone:phone, password:pass }) });
    const result = await res.json();
    if(result.success) {
      currentUser = result.user;
      if(!currentUser.userId) {
        currentUser.userId = "SACAR-USR-" + Math.floor(1000 + Math.random() * 9000);
      }
      localStorage.setItem('sacar_customer', JSON.stringify(currentUser));
      syncAuthUI();
      closeAuthModal();
      showToast(l.welcomeBack(currentUser.name), "success");
    } else {
      showToast(result.message || l.loginFailNetwork, "error");
    }
  } catch { showToast(l.loginFailNetwork, "error"); }
}

async function handleUserSignup(e) {
  e.preventDefault();
  const l = langData[currentLang];
  const name = document.getElementById('reg-name').value;
  const phone = document.getElementById('reg-phone').value;
  const email = document.getElementById('reg-email').value;
  const pass = document.getElementById('reg-pass').value;

  if(pass.length < 6) {
    showToast(l.signupPassMinLength, "warning");
    return;
  }

  try {
    const res = await fetch(WEB_APP_URL, { method: "POST", body: JSON.stringify({ action:"register", lang: currentLang, name:name, phone:phone, email:email, password:pass }) });
    const result = await res.json();
    if(result.success) {
      showToast(l.registerSuccess, "success");
      switchAuthTab('login');
    } else {
      showToast(result.message || l.registerFail, "error");
    }
  } catch { showToast(l.registerFail, "error"); }
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
  const l = langData[currentLang];
  if(currentUser) {
    area.innerHTML = `
      <div class="user-status-box">
        <i class="fas fa-user" style="cursor:pointer;" onclick="showView('profile')"></i>
        <span style="cursor:pointer;" onclick="showView('profile')">${currentUser.name}</span>
        <span class="user-points-badge">${currentUser.points} ${l.pointsUnit}</span>
        <button onclick="logoutCustomer()" class="user-logout-btn"><i class="fas fa-sign-out-alt"></i></button>
      </div>
    `;
  } else {
    area.innerHTML = `<button class="nav-icon-btn" onclick="openAuthModal()"><i class="fas fa-user-circle"></i> <span class="btn-text">${l.loginNav}</span></button>`;
  }
}

function logoutCustomer() {
  localStorage.removeItem('sacar_customer');
  currentUser = null;
  syncAuthUI();
  showView('home');
  showToast(langData[currentLang].logoutSuccess, "info");
}

function toggleLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("sacar_lang", lang);
  document.documentElement.lang = lang;
  applyLanguage();
  buildCategoryFilters();
  buildSubCategoryChips();
  updateSortTriggerLabel();
  if(localProductDB.length > 0) applyFiltersAndSort();
}

function applyLanguage() {
  const l = langData[currentLang];
  document.title = l.pageTitle;
  document.getElementById("promo-text").innerText = l.promo;
  document.getElementById("store-search").placeholder = l.search;
  document.getElementById("cat-sidebar-title").innerText = l.sidebarTitle;
  document.getElementById("hero-title").innerText = l.heroTitle;
  document.getElementById("hero-desc").innerText = l.heroDesc;
  document.getElementById("popular-cat-title").innerText = l.popularCat;
  document.getElementById("grid-title").innerText = l.allProducts;
  if(document.getElementById("loading-txt")) document.getElementById("loading-txt").innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${l.loading}`;

  document.getElementById("sort-trigger-label").innerText = l.sortBtn;
  document.getElementById("offer-btn-label").innerText = l.offerBtn;
  document.getElementById("sort-sheet-title").innerText = l.sortSheetTitle;
  document.getElementById("sort-default-label").innerText = l.sortDefault;
  document.getElementById("sort-lowhigh-label").innerText = l.sortLowHighFull;
  document.getElementById("sort-highlow-label").innerText = l.sortHighLowFull;

  document.getElementById("prof-view-title").innerText = l.profTitle;
  document.getElementById("prof-id-lbl").innerText = l.profId;
  document.getElementById("prof-pts-lbl").innerText = l.profPts;
  document.getElementById("prof-name-lbl").innerText = l.profName;
  document.getElementById("prof-phone-lbl").innerText = l.profPhone;
  document.getElementById("prof-email-lbl").innerText = l.profEmail;
  document.getElementById("prof-addr-lbl").innerText = l.profAddr;
  document.getElementById("prof-address").placeholder = l.profAddrPh;
  document.getElementById("prof-save-btn").innerText = l.profSave;
  document.getElementById("prof-pass-title").innerHTML = `<i class="fas fa-key"></i> ${l.profPassTitle}`;
  document.getElementById("prof-old-pass-lbl").innerText = l.profOldPassLbl;
  document.getElementById("prof-old-pass").placeholder = l.profOldPassPh;
  document.getElementById("prof-new-pass-lbl").innerText = l.profNewPassLbl;
  document.getElementById("prof-new-pass").placeholder = l.profNewPassPh;
  document.getElementById("prof-pass-btn").innerText = l.profPassBtn;

  document.getElementById("chk-title").innerText = l.chkTitle;
  document.getElementById("chk-name-lbl").innerText = l.chkName;
  document.getElementById("chk-name").placeholder = l.chkNamePh;
  document.getElementById("chk-phone-lbl").innerText = l.chkPhone;
  document.getElementById("chk-phone").placeholder = l.chkPhonePh;
  document.getElementById("chk-addr-lbl").innerText = l.chkAddr;
  document.getElementById("chk-address").placeholder = l.chkAddrPh;
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

  document.getElementById("tab-login-btn").innerText = l.tabLogin;
  document.getElementById("tab-signup-btn").innerText = l.tabSignup;
  document.getElementById("login-phone").placeholder = l.loginPhonePh;
  document.getElementById("login-pass").placeholder = l.loginPassPh;
  document.getElementById("login-submit-btn").innerText = l.loginBtn;
  document.getElementById("reg-name").placeholder = l.regNamePh;
  document.getElementById("reg-phone").placeholder = l.regPhonePh;
  document.getElementById("reg-email").placeholder = l.regEmailPh;
  document.getElementById("reg-pass").placeholder = l.regPassPh;
  document.getElementById("signup-submit-btn").innerText = l.regBtn;

  document.getElementById("success-modal-title").innerText = l.successTitle;
  document.getElementById("success-modal-ok-btn").innerText = l.successOkBtn;

  document.getElementById("f-addr").innerText = l.fAddr;
  document.getElementById("f-hot").innerText = l.fHot;
  document.getElementById("f-email-lbl").innerText = l.fEmailLbl;
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

function toggleSortBottomSheet(show) {
  const sheet = document.getElementById("sort-bottom-sheet");
  if (!sheet) return;
  if (show) {
    sheet.classList.add("active");
  } else {
    sheet.classList.remove("active");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const offerBtn = document.getElementById("offer-filter-btn");
  if (offerBtn) {
    offerBtn.addEventListener("click", () => {
      isOfferActive = !isOfferActive;
      offerBtn.classList.toggle("active", isOfferActive);
      applyFiltersAndSort();
    });
  }

  const sortOptions = document.querySelectorAll(".sort-option-btn");
  sortOptions.forEach(btn => {
    btn.addEventListener("click", (e) => {
      sortOptions.forEach(opt => opt.classList.remove("active"));
      const clickedBtn = e.currentTarget;
      clickedBtn.classList.add("active");

      activeSort = clickedBtn.getAttribute("data-value");

      const sortTriggerBtn = document.getElementById("sort-trigger-btn");
      if (activeSort !== "default") {
        sortTriggerBtn.classList.add("active");
      } else {
        sortTriggerBtn.classList.remove("active");
      }
      updateSortTriggerLabel();

      toggleSortBottomSheet(false);
      applyFiltersAndSort();
    });
  });
});

function applyFiltersAndSort() {
  let filteredProducts = [...localProductDB];

  const checkHasOffer = (p) => {
    const offerVal = String(p.offer || p.discount || "").trim();
    const price = parseFloat(p.price) || 0;
    const discPrice = parseFloat(p.discount_price) || 0;

    const hasDiscountPrice = (discPrice > 0 && discPrice < price);
    const hasOfferText = (offerVal !== "" && offerVal !== "0" && offerVal.toLowerCase() !== "no" && offerVal.toLowerCase() !== "false");

    return hasDiscountPrice || hasOfferText;
  };

  if (activeMainCategory !== "ALL") {
    filteredProducts = filteredProducts.filter(p => (p.category || p.Category) === activeMainCategory);
  }

  if (activeSubCategory !== "ALL") {
    filteredProducts = filteredProducts.filter(p => (p.sub_category || p.Sub_Category || p.subCategory) === activeSubCategory);
  }

  if (isOfferActive) {
    filteredProducts = filteredProducts.filter(p => checkHasOffer(p));
  }

  const searchInput = document.getElementById('store-search');
  if (searchInput && searchInput.value.trim() !== "") {
    const q = searchInput.value.toLowerCase();
    filteredProducts = filteredProducts.filter(p =>
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.sku && p.sku.toLowerCase().includes(q))
    );
  }

  const inStock = [];
  const outStock = [];
  filteredProducts.forEach(p => {
    const currentAvailable = (parseInt(p.Stock) || 0) - (parseInt(p.Sales) || 0);
    const buffer = parseInt(p.Buffer) || 0;
    if (currentAvailable <= buffer) outStock.push(p);
    else inStock.push(p);
  });

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

  const sortedInStock = sortGroup(inStock);
  const sortedOutStock = sortGroup(outStock);

  const finalProductsList = [...sortedInStock, ...sortedOutStock];

  const grid = document.getElementById('main-products-grid');
  if (!grid) return;

  const isAllMode = activeMainCategory === "ALL";

  if (isAllMode && !isOfferActive && activeSort === "default" && (!searchInput || searchInput.value.trim() === "")) {
    displayProducts(localProductDB);
  } else {
    grid.style.display = "grid";
    grid.innerHTML = '';

    if (finalProductsList.length === 0) {
      grid.innerHTML = `<div style="text-align:center; padding:20px; width:100%; color:var(--text-color);">${langData[currentLang].noProductsFound}</div>`;
      return;
    }

    finalProductsList.forEach(p => {
      const card = createProductCardHTML(p);
      grid.appendChild(card);
    });
  }
}
