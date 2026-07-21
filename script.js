const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxSNDX0dhcmr2Xt2GpZ760x__PkNTu-01h915ebPrQtTkFgFEGNvwZdmgj0Qy2Pt2Q5/exec";
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
let allCategoriesList = [];
let searchDebounceTimer = null;
let checkoutStep = 1;
let selectedPaymentMethod = "cod";
let customerAddressBeforePickup = null;

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
    chkBtn: "অর্ডার করুন ",
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
    orderSuccess: "🎉 আপনার অর্ডারটি সফলভাবে গৃহীত হয়েছে!",
    orderIdLbl: "অর্ডার আইডি:",
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
    memberSinceLbl: "সদস্য হয়েছেন:",
    pointsUnitShort: "পয়েন্ট",
    welcomeBackTxt: "স্বাগতম,",
    welcomeSubTxt: "SACAR Mart-এ আপনাকে স্বাগতম",
    rewardProgressTitle: "রিওয়ার্ড পয়েন্ট",
    tierBronze: "ব্রোঞ্জ",
    tierSilver: "সিলভার",
    tierGold: "গোল্ড",
    tierPlatinum: "প্ল্যাটিনাম",
    pointsToNextTierPrefix: "আরও",
    pointsToNextTierSuffix: "পয়েন্ট হলেই",
    maxTierReached: "সর্বোচ্চ Tier অর্জিত হয়েছে!",
    statTotalOrdersLbl: "মোট অর্ডার",
    statCompletedOrdersLbl: "সম্পন্ন",
    statPendingOrdersLbl: "অপেক্ষমাণ",
    statTotalPointsLbl: "রিওয়ার্ড পয়েন্ট",
    qaOrdersLbl: "আমার অর্ডার",
    qaRewardsLbl: "আমার রিওয়ার্ড",
    qaReferLbl: "রেফার ও আয় করুন",
    qaLogoutLbl: "লগআউট",
    personalInfoTitle: "ব্যক্তিগত তথ্য",
    addrSectionTitle: "সংরক্ষিত ডেলিভারি ঠিকানা",
    addrSectionSub: "দ্রুত চেকআউটের জন্য সর্বোচ্চ ৩টি ঠিকানা সংরক্ষণ করুন",
    addrHomeLbl: "বাসা",
    addrHomePh: "আপনার বাসার ঠিকানা লিখুন",
    addrOfficeLbl: "অফিস",
    addrOfficePh: "আপনার অফিসের ঠিকানা লিখুন",
    addrOtherLbl: "অন্যান্য",
    addrOtherPh: "অন্য একটি ঠিকানা লিখুন",
    addrSaveBtn: "ঠিকানা সংরক্ষণ করুন",
    addrSaveSuccess: "ঠিকানা সফলভাবে সংরক্ষণ করা হয়েছে!",
    addrSaveFail: "ঠিকানা সংরক্ষণ ব্যর্থ হয়েছে।",
    referralTitle: "রেফার ও আয় করুন",
    referralSub: "বন্ধুদের আমন্ত্রণ জানান এবং রিওয়ার্ড পয়েন্ট অর্জন করুন",
    referralCopyLbl: "কপি",
    referralLinkLbl: "রেফারেল লিংক",
    referralCountLbl: "রেফারেল",
    referralRewardLbl: "প্রতি রেফারেলে পয়েন্ট",
    referralCopied: "রেফারেল লিংক কপি করা হয়েছে!",
    referralShareText: "SACAR Mart থেকে কেনাকাটা করুন এবং রিওয়ার্ড পয়েন্ট জিতুন!",
    acctInfoTitle: "অ্যাকাউন্ট তথ্য",
    acctUserIdLbl: "ইউজার আইডি",
    acctStatusLbl: "অ্যাকাউন্টের অবস্থা",
    acctStatusActive: "সক্রিয়",
    acctMemberSinceLbl: "সদস্য হয়েছেন",
    acctEmailVerifyLbl: "ইমেইল যাচাইকরণ",
    acctPhoneVerifyLbl: "মোবাইল যাচাইকরণ",
    notVerified: "যাচাই করা হয়নি",
    orderHistoryTitle: "অর্ডার ইতিহাস",
    noOrdersYet: "এখনো কোনো অর্ডার নেই।",
    orderHistoryLoadError: "অর্ডার তথ্য লোড করা যায়নি।",
    statusCompleted: "সম্পন্ন",
    statusPending: "অপেক্ষমাণ",
    statusCancelled: "বাতিল",
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
    loadError: "প্রোডাক্ট লোড করতে ত্রুটি হয়েছে।",
    processingOrder: "প্রসেসিং হচ্ছে...",
    stepCartTitle: "আপনার কার্ট",
    stepDeliveryTitle: "ডেলিভারি ও পেমেন্ট",
    stepReviewTitle: "পর্যালোচনা ও অর্ডার",
    progStep1: "কার্ট",
    progStep2: "ডেলিভারি ও পেমেন্ট",
    progStep3: "পর্যালোচনা",
    addMoreBtn: "আরও পণ্য যোগ করুন",
    suggestedTitle: "আপনার পছন্দ হতে পারে",
    estimatedTotal: "আনুমানিক মোট",
    discountLbl: "ছাড়",
    deliveryNoteLbl: "ডেলিভারি নোট",
    deliveryNotePh: "ডেলিভারির জন্য একটি নোট লিখুন",
    leaveAtDoorLbl: "দরজায় রেখে যান",
    continueBtn: "পরবর্তী",
    continueToReviewBtn: "পর্যালোচনায় যান",
    fillRequiredFields: "দয়া করে সব আবশ্যক ঘর পূরণ করুন।",
    custInfoTitle: "গ্রাহকের তথ্য",
    reviewAddrTitle: "ডেলিভারি ঠিকানা",
    paymentMethodTitle: "পেমেন্ট পদ্ধতি",
    orderedProductsTitle: "অর্ডারকৃত পণ্য",
    deliveryChargeLbl: "ডেলিভারি চার্জ:",
    pickupOrderLbl: "পিকআপ অর্ডার",
    pickupTxnPh: "আপনার ট্রানজেকশন আইডি লিখুন",
    pickupNoticeText: "পিকআপ অর্ডার নিশ্চিত করতে ন্যূনতম ৳১০০ অগ্রিম বিকাশ বা নগদের মাধ্যমে পরিশোধ করতে হবে। পেমেন্ট করার পর ট্রানজেকশন আইডি লিখুন।",
    pickupTxnRequired: "অনুগ্রহ করে অগ্রিম পেমেন্টের ট্রানজেকশন আইডি লিখুন।",
    paymentInfoRequired: "অনুগ্রহ করে ট্রানজেকশন আইডি এবং প্রদত্ত/অগ্রিম পরিমাণ উভয়ই লিখুন।",
    payMethodCodLbl: "ক্যাশ অন ডেলিভারি",
    payMethodOnlineLbl: "অনলাইন পেমেন্ট",
    pickupInfoLbl: "বিকাশ / নগদ অগ্রিম পেমেন্ট তথ্য",
    codInfoLbl: "বিকাশ / নগদ পেমেন্ট তথ্য",
    onlineInfoLbl: "অনলাইন পেমেন্ট তথ্য",
    paymentTxnLbl: "ট্রানজেকশন আইডি",
    advanceAmountLbl: "অগ্রিম পরিমাণ",
    advanceAmountPh: "অগ্রিম পরিমাণ (৳)",
    paidAmountLbl: "পরিশোধিত পরিমাণ",
    paidAmountPh: "পরিশোধিত পরিমাণ (৳)",
    codNoticeText: "অর্ডার নিশ্চিত করতে ন্যূনতম ৳১০০ অথবা অর্ডার অনুযায়ী নির্ধারিত অগ্রিম বিকাশ/নগদে পাঠিয়ে ট্রানজেকশন আইডি ও পরিমাণ লিখুন।",
    onlineNoticeText: "অনলাইন পেমেন্ট সম্পন্ন করার পর ট্রানজেকশন আইডি ও পরিশোধিত পরিমাণ লিখুন।",
    paymentAmountLbl: "প্রদত্ত/অগ্রিম পরিমাণ"
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
    chkBtn: "Place Order ",
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
    orderSuccess: "🎉 Your order has been placed successfully!",
    orderIdLbl: "Order ID:",
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
    memberSinceLbl: "Member Since:",
    pointsUnitShort: "Points",
    welcomeBackTxt: "Welcome Back,",
    welcomeSubTxt: "Welcome to SACAR Mart",
    rewardProgressTitle: "Reward Points",
    tierBronze: "Bronze",
    tierSilver: "Silver",
    tierGold: "Gold",
    tierPlatinum: "Platinum",
    pointsToNextTierPrefix: "",
    pointsToNextTierSuffix: "more points to",
    maxTierReached: "Maximum tier reached!",
    statTotalOrdersLbl: "Total Orders",
    statCompletedOrdersLbl: "Completed",
    statPendingOrdersLbl: "Pending",
    statTotalPointsLbl: "Reward Points",
    qaOrdersLbl: "My Orders",
    qaRewardsLbl: "My Rewards",
    qaReferLbl: "Refer & Earn",
    qaLogoutLbl: "Logout",
    personalInfoTitle: "Personal Information",
    addrSectionTitle: "Saved Delivery Addresses",
    addrSectionSub: "Save up to 3 addresses for faster checkout",
    addrHomeLbl: "Home",
    addrHomePh: "Enter your home address",
    addrOfficeLbl: "Office",
    addrOfficePh: "Enter your office address",
    addrOtherLbl: "Other",
    addrOtherPh: "Enter another address",
    addrSaveBtn: "Save Addresses",
    addrSaveSuccess: "Addresses saved successfully!",
    addrSaveFail: "Failed to save addresses.",
    referralTitle: "Refer & Earn",
    referralSub: "Invite friends and earn reward points",
    referralCopyLbl: "Copy",
    referralLinkLbl: "Referral Link",
    referralCountLbl: "Referrals",
    referralRewardLbl: "Points / Referral",
    referralCopied: "Referral link copied!",
    referralShareText: "Shop at SACAR Mart and earn reward points!",
    acctInfoTitle: "Account Information",
    acctUserIdLbl: "User ID",
    acctStatusLbl: "Account Status",
    acctStatusActive: "Active",
    acctMemberSinceLbl: "Member Since",
    acctEmailVerifyLbl: "Email Verification",
    acctPhoneVerifyLbl: "Phone Verification",
    notVerified: "Not Verified",
    orderHistoryTitle: "Order History",
    noOrdersYet: "No orders yet.",
    orderHistoryLoadError: "Could not load order history.",
    statusCompleted: "Completed",
    statusPending: "Pending",
    statusCancelled: "Cancelled",
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
    loadError: "Error loading products.",
    processingOrder: "Processing...",
    stepCartTitle: "Your Cart",
    stepDeliveryTitle: "Delivery & Payment",
    stepReviewTitle: "Review & Place Order",
    progStep1: "Cart",
    progStep2: "Delivery & Payment",
    progStep3: "Review",
    addMoreBtn: "Add More Products",
    suggestedTitle: "You Might Also Like",
    estimatedTotal: "Estimated Total",
    discountLbl: "Discount",
    deliveryNoteLbl: "Delivery Note",
    deliveryNotePh: "Write a note for delivery",
    leaveAtDoorLbl: "Leave at Door",
    continueBtn: "Continue",
    continueToReviewBtn: "Continue to Review",
    fillRequiredFields: "Please fill in all required fields.",
    custInfoTitle: "Customer Information",
    reviewAddrTitle: "Delivery Address",
    paymentMethodTitle: "Payment Method",
    orderedProductsTitle: "Ordered Products",
    deliveryChargeLbl: "Delivery Charge:",
    pickupOrderLbl: "Pickup Order",
    pickupTxnPh: "Enter your Transaction ID",
    pickupNoticeText: "Pickup Orders require a minimum advance payment of Tk 100 via bKash or Nagad. Please complete the payment and enter your Transaction ID.",
    pickupTxnRequired: "Please enter your advance payment Transaction ID.",
    paymentInfoRequired: "Please enter both your Transaction ID and Paid/Advance Amount.",
    payMethodCodLbl: "Cash on Delivery",
    payMethodOnlineLbl: "Online Payment",
    pickupInfoLbl: "bKash / Nagad Advance Payment Info",
    codInfoLbl: "bKash / Nagad Payment Info",
    onlineInfoLbl: "Online Payment Info",
    paymentTxnLbl: "Transaction ID",
    advanceAmountLbl: "Advance Amount",
    advanceAmountPh: "Advance Amount (৳)",
    paidAmountLbl: "Paid Amount",
    paidAmountPh: "Paid Amount (৳)",
    codNoticeText: "To confirm the order, please send a minimum advance of Tk 100 (or the amount specified for your order) via bKash/Nagad and enter the Transaction ID and amount.",
    onlineNoticeText: "After completing the online payment, please enter the Transaction ID and paid amount.",
    paymentAmountLbl: "Paid / Advance Amount"
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
  initFloatingCartBubble();
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
    restoreCategoryState();
    applyFiltersAndSort();
    refreshCartUI();
    showStoreControls();
  } catch (e) {
    console.error(e);
    document.getElementById('main-products-grid').innerHTML = `<p>${langData[currentLang].loadError}</p>`;
  }
}

function saveCategoryState() {
  localStorage.setItem("sacar_active_cat", activeMainCategory);
  localStorage.setItem("sacar_active_subcat", activeSubCategory);
}

function syncCategoryActiveUI() {
  document.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c.getAttribute("data-value") === activeMainCategory));
  document.querySelectorAll("#sidebar-categories li").forEach(c => c.classList.toggle("active", c.getAttribute("data-value") === activeMainCategory));
  document.querySelectorAll(".sub-chip").forEach(c => c.classList.toggle("active", c.getAttribute("data-value") === activeSubCategory));
}

function restoreCategoryState() {
  const savedCat = localStorage.getItem("sacar_active_cat");
  activeMainCategory = "ALL";
  activeSubCategory = "ALL";

  if (savedCat && savedCat !== "ALL" && allCategoriesList.includes(savedCat)) {
    activeMainCategory = savedCat;
    buildSubCategoryChips();
    const savedSub = localStorage.getItem("sacar_active_subcat");
    if (savedSub && savedSub !== "ALL") {
      const exists = Array.from(document.querySelectorAll(".sub-chip")).some(c => c.getAttribute("data-value") === savedSub);
      if (exists) activeSubCategory = savedSub;
    }
  }
  syncCategoryActiveUI();
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
  allCategoriesList = [...new Set(localProductDB.map(p => p.category).filter(Boolean))];
  const chipsContainer = document.getElementById('category-chips');
  const sidebarContainer = document.getElementById('sidebar-categories');
  const allTxt = langData[currentLang].allBtn;

  const chipsParts = [`<button class="chip active" data-value="ALL" onclick="filterCategory('all')">${allTxt}</button>`];
  const sidebarParts = [`<li data-value="ALL" class="active" onclick="filterCategory('all')"><i class="fas fa-th"></i> ${allTxt}</li>`];

  allCategoriesList.forEach(cat => {
    chipsParts.push(`<button class="chip" data-value="${cat}" onclick="filterCategory('${cat}')">${cat}</button>`);
    sidebarParts.push(`<li data-value="${cat}" onclick="filterCategory('${cat}')"><i class="fas fa-chevron-right"></i> ${cat}</li>`);
  });

  chipsContainer.innerHTML = chipsParts.join('');
  sidebarContainer.innerHTML = sidebarParts.join('');
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

function filterCategory(catName) {
  const targetValue = catName.toLowerCase() === 'all' ? 'ALL' : catName;

  document.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c.getAttribute("data-value") === targetValue));
  document.querySelectorAll("#sidebar-categories li").forEach(c => c.classList.toggle("active", c.getAttribute("data-value") === targetValue));

  activeMainCategory = targetValue;
  activeSubCategory = "ALL";
  resetSortAndOfferFilters();
  saveCategoryState();

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
    const parts = [`<button class="sub-chip active" data-value="ALL" onclick="filterSubCategory('ALL')">${langData[currentLang].subAllLabel(subCategories.length)}</button>`];
    subCategories.forEach(sub => {
      parts.push(`<button class="sub-chip" data-value="${sub}" onclick="filterSubCategory('${sub}')">${sub}</button>`);
    });
    subChipsContainer.innerHTML = parts.join('');
  } else {
    subChipsContainer.innerHTML = "";
  }
}

function filterSubCategory(subName) {
  document.querySelectorAll(".sub-chip").forEach(c => c.classList.toggle("active", c.getAttribute("data-value") === subName));

  activeSubCategory = subName;
  saveCategoryState();
  applyFiltersAndSort();
}

function renderProductGrid(products) {
  const grid = document.getElementById('main-products-grid');
  if (!grid) return;
  grid.style.display = "grid";

  if (!products || products.length === 0) {
    grid.innerHTML = `<div style="text-align:center; padding:20px; width:100%; color:var(--text-color);">${langData[currentLang].noProductsFound}</div>`;
    return;
  }

  const fragment = document.createDocumentFragment();
  products.forEach(p => fragment.appendChild(createProductCardHTML(p)));
  grid.innerHTML = '';
  grid.appendChild(fragment);
}

function getStockInfo(p) {
  const stock = parseInt(p.Stock) || 0;
  const sales = parseInt(p.Sales) || 0;
  const buffer = parseInt(p.Buffer) || 0;
  const currentAvailableStock = stock - sales;
  const sellableStock = currentAvailableStock - buffer;
  const isOutOfStock = currentAvailableStock <= buffer;
  return { sellableStock, isOutOfStock };
}

function buildQuantityControlHTML(sku, qty, variant) {
  const btnClass = variant === 'compact' ? 'cart-qty-btn' : 'qty-round-btn';
  const wrapClass = variant === 'compact' ? 'cart-line-qty-control' : 'quantity-counter-container';
  const valueClass = variant === 'compact' ? 'cart-qty-value' : 'qty-display-value';

  if (qty <= 1) {
    return `
      <div class="${wrapClass}">
        <button class="${btnClass} danger" onclick="removeCartItem('${sku}')" aria-label="Remove"><i class="fas fa-trash-alt"></i></button>
        <span class="${valueClass}">${qty}</span>
        <button class="${btnClass} plus" onclick="changeCardQty('${sku}', 1)"><i class="fas fa-plus"></i></button>
      </div>
    `;
  }
  return `
    <div class="${wrapClass}">
      <button class="${btnClass} minus" onclick="changeCardQty('${sku}', -1)"><i class="fas fa-minus"></i></button>
      <span class="${valueClass}">${qty}</span>
      <button class="${btnClass} plus" onclick="changeCardQty('${sku}', 1)"><i class="fas fa-plus"></i></button>
    </div>
  `;
}

function buildCardActionHTML(p, isOutOfStock, itemQty, sellableStock, l) {
  if (isOutOfStock) {
    return `
      <button class="order-btn" style="background-color: #a0aec0; cursor: not-allowed;" disabled>
        <i class="fas fa-exclamation-triangle"></i> ${l.outOfStock}
      </button>
    `;
  }
  if (itemQty > 0) {
    return buildQuantityControlHTML(p.sku, itemQty, 'normal');
  }
  return `
    <button class="order-btn" onclick="addItemToCart('${p.sku}')">
      <i class="fas fa-shopping-basket"></i> ${l.orderBtn}
    </button>
  `;
}

function updateCardActionArea(sku) {
  const p = localProductDB.find(prod => prod.sku === sku);
  if (!p) return;
  const areas = document.querySelectorAll(`[data-sku="${CSS.escape(sku)}"] .card-action-area`);
  if (!areas.length) return;

  const { sellableStock, isOutOfStock } = getStockInfo(p);
  const cartItem = cart.find(item => item.sku === sku);
  const itemQty = cartItem ? cartItem.qty : 0;
  const l = langData[currentLang];
  const html = buildCardActionHTML(p, isOutOfStock, itemQty, sellableStock, l);

  areas.forEach(area => { area.innerHTML = html; });
}

function createProductCardHTML(p) {
  const { sellableStock, isOutOfStock } = getStockInfo(p);

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
  const buttonHTML = buildCardActionHTML(p, isOutOfStock, itemQty, sellableStock, l);

  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.sku = p.sku;
  if (isOutOfStock) card.style.opacity = '0.5';

  card.innerHTML = `
    ${discountBadge}
    <img src="${img}" alt="${p.name}" loading="lazy" decoding="async" onclick="viewProductDetails('${p.sku}')">
    <h4 onclick="viewProductDetails('${p.sku}')">${p.name}</h4>
    <div class="price-box">${priceHTML}</div>
    <div class="product-points"><i class="fas fa-coins"></i> +${points} ${l.pointsUnit}</div>
    <div class="card-action-area">${buttonHTML}</div>
  `;
  return card;
}

function handleSearch() {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    activeMainCategory = "ALL";
    activeSubCategory = "ALL";
    document.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c.getAttribute("data-value") === "ALL"));
    document.querySelectorAll("#sidebar-categories li").forEach(c => c.classList.toggle("active", c.getAttribute("data-value") === "ALL"));
    applyFiltersAndSort();
  }, 180);
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
    const originalPrice = parseFloat(product.price) || 0;
    const discPrice = parseFloat(product.discount_price) || 0;
    const effectivePrice = (discPrice > 0 && discPrice < originalPrice) ? discPrice : originalPrice;
    cart.push({
      sku: product.sku,
      name: product.name,
      price: effectivePrice,
      originalPrice: originalPrice,
      image: product.image_url || '',
      qty: 1,
      points: parseInt(product.points)||0
    });
  }
  refreshCartUI();
  updateCardActionArea(sku);
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
      updateCardActionArea(sku);
    }
  } else if (change > 0) {
    addItemToCart(sku);
  }
}

function removeCartItem(sku) {
  cart = cart.filter(i => i.sku !== sku);
  refreshCartUI();
  showToast(langData[currentLang].removedFromCart, "warning");
  updateCardActionArea(sku);
}

function buildCartLineRowHTML(item) {
  const orig = item.originalPrice || item.price;
  const hasDiscount = orig > item.price;
  const img = item.image || 'https://via.placeholder.com/60?text=No+Image';
  return `
    <div class="cart-line-row" data-sku="${item.sku}">
      <img src="${img}" class="cart-line-img" alt="${item.name}" loading="lazy" decoding="async">
      <div class="cart-line-info">
        <span class="cart-line-name">${item.name}</span>
        <div class="cart-line-price-row">
          ${hasDiscount ? `<span class="cart-line-orig-price">৳${orig.toFixed(2)}</span>` : ''}
          <span class="cart-line-price">৳${item.price.toFixed(2)}</span>
        </div>
      </div>
      ${buildQuantityControlHTML(item.sku, item.qty, 'compact')}
    </div>
  `;
}

function refreshCartUI() {
  localStorage.setItem("sacar_cart", JSON.stringify(cart));
  const counter = document.getElementById('cart-counter');
  const totalLabel = document.getElementById('cart-subtotal-val');

  let subtotal = 0;
  let itemsCount = 0;
  const rows = [];
  cart.forEach(item => {
    subtotal += item.price * item.qty;
    itemsCount += item.qty;
    rows.push(buildCartLineRowHTML(item));
  });
  const rowsHTML = rows.length ? rows.join('') : `<p class="empty-cart-msg">${langData[currentLang].emptyCart}</p>`;

  const drawerBody = document.getElementById('cart-drawer-items');
  if (drawerBody) drawerBody.innerHTML = rowsHTML;

  const step1Body = document.getElementById('checkout-cart-items');
  if (step1Body) step1Body.innerHTML = rowsHTML;

  if (counter) counter.innerText = itemsCount;
  if (totalLabel) totalLabel.innerText = subtotal.toFixed(2);

  const bubbleBadge = document.getElementById('floating-cart-badge');
  if (bubbleBadge) bubbleBadge.innerText = itemsCount;
  updateFloatingBubbleVisibility();

  updateCheckoutStep1Summary();
  updateCartDrawerLayout();
}

function updateFloatingBubbleVisibility() {
  const bubble = document.getElementById('floating-cart-bubble');
  if (!bubble) return;
  const itemsCount = cart.reduce((s, i) => s + i.qty, 0);
  const checkoutView = document.getElementById('checkout-view');
  const isCheckoutActive = checkoutView && checkoutView.classList.contains('active');
  bubble.style.display = (itemsCount > 0 && !isCheckoutActive) ? 'flex' : 'none';
}

function updateCartDrawerLayout() {
  const drawer = document.getElementById('cart-drawer');
  const body = document.getElementById('cart-drawer-items');
  if (!drawer || !body) return;
  requestAnimationFrame(() => {
    const header = drawer.querySelector('.cart-drawer-header');
    const footer = drawer.querySelector('.cart-drawer-footer');
    const headerH = header ? header.offsetHeight : 0;
    const footerH = footer ? footer.offsetHeight : 0;
    const availableHeight = drawer.clientHeight - headerH - footerH;
    const overflowing = body.scrollHeight > availableHeight;
    drawer.classList.toggle('drawer-overflow', overflowing);
  });
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
  const { sellableStock, isOutOfStock } = getStockInfo(p);
  const cartItem = cart.find(item => item.sku === p.sku);
  const itemQty = cartItem ? cartItem.qty : 0;
  const actionHTML = buildCardActionHTML(p, isOutOfStock, itemQty, sellableStock, l);
  const grid = document.getElementById('modal-details-grid');
  grid.innerHTML = `
    <div style="text-align:center;">
      <img src="${img}" style="max-width:100%; height:240px; object-fit:contain; border-radius:6px;" decoding="async">
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
      <div class="modal-order-action" data-sku="${p.sku}">
        <div class="card-action-area">${actionHTML}</div>
      </div>
    </div>
  `;
  displayRelatedProducts(p.category, p.sku);
  document.getElementById('details-modal').style.display = 'flex';
}

function displayRelatedProducts(category, currentSku) {
  const relatedGrid = document.getElementById('related-products-grid');
  const l = langData[currentLang];
  relatedGrid.innerHTML = '';
  const related = localProductDB.filter(p => {
    if (p.category !== category || p.sku === currentSku) return false;
    return !getStockInfo(p).isOutOfStock;
  });
  if(related.length === 0) {
    relatedGrid.innerHTML = `<p style="font-size:13px; color:#a0aec0;">${l.noRelatedProducts}</p>`;
    return;
  }
  const fragment = document.createDocumentFragment();
  related.forEach(p => {
    const img = p.image_url || 'https://via.placeholder.com/200?text=No+Image';
    const price = parseFloat(p.price) || 0;
    const discPrice = parseFloat(p.discount_price) || 0;
    const activePrice = (discPrice > 0) ? discPrice : price;
    const { sellableStock, isOutOfStock } = getStockInfo(p);
    const cartItem = cart.find(item => item.sku === p.sku);
    const itemQty = cartItem ? cartItem.qty : 0;
    const actionHTML = buildCardActionHTML(p, isOutOfStock, itemQty, sellableStock, l);
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.sku = p.sku;
    card.innerHTML = `
      <img src="${img}" alt="${p.name}" loading="lazy" decoding="async" onclick="viewProductDetails('${p.sku}')" style="height:110px;">
      <h5 onclick="viewProductDetails('${p.sku}')" style="font-size:13px; height:34px; overflow:hidden; margin-bottom:5px; cursor:pointer;">${p.name}</h5>
      <p style="color:var(--accent-color); font-weight:bold; font-size:14px; margin-bottom:8px;">৳${activePrice.toFixed(2)}</p>
      <div class="card-action-area">${actionHTML}</div>
    `;
    fragment.appendChild(card);
  });
  relatedGrid.appendChild(fragment);
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
  if(viewId === 'checkout') goToCheckoutStep(1);
  if(viewId === 'profile') buildProfilePage();
  updateFloatingBubbleVisibility();
}

function proceedToCheckout() {
  if(cart.length === 0) { showToast(langData[currentLang].emptyCart, "warning"); return; }
  toggleCartDrawer(false);
  showView('checkout');
}

function handleCheckoutNavBack() {
  if (checkoutStep === 1) {
    showView('home');
  } else {
    goToCheckoutStep(checkoutStep - 1);
  }
}

function goToNextCheckoutStep() {
  if (checkoutStep === 1) {
    if (cart.length === 0) { showToast(langData[currentLang].emptyCart, "warning"); return; }
    goToCheckoutStep(2);
  } else if (checkoutStep === 2) {
    const nameOk = document.getElementById('chk-name').value.trim();
    const phoneOk = document.getElementById('chk-phone').value.trim();
    const addrOk = document.getElementById('chk-address').value.trim();
    const noteOk = document.getElementById('chk-delivery-note').value.trim();
    if (!nameOk || !phoneOk || !addrOk || !noteOk) {
      showToast(langData[currentLang].fillRequiredFields, "warning");
      return;
    }
    const { txnEl, amountEl } = getPaymentInfoFields(selectedPaymentMethod);
    const txnId = txnEl ? txnEl.value.trim() : '';
    const amountVal = amountEl ? amountEl.value.trim() : '';
    if (!txnId || !amountVal) {
      showToast(langData[currentLang].paymentInfoRequired, "warning");
      if (!txnId && txnEl) txnEl.focus();
      else if (amountEl) amountEl.focus();
      return;
    }
    goToCheckoutStep(3);
  }
}

function goToCheckoutStep(step) {
  checkoutStep = step;
  document.querySelectorAll('.checkout-step-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById(`checkout-step-${step}`);
  if (panel) panel.classList.add('active');
  updateCheckoutStepUI();
  if (step === 1) buildCheckoutStep1();
  else if (step === 2) buildCheckoutStep2();
  else if (step === 3) buildCheckoutStep3();
  window.scrollTo(0, 0);
}

function updateCheckoutStepUI() {
  const l = langData[currentLang];
  document.querySelectorAll('.checkout-progress-step').forEach(el => {
    const n = parseInt(el.getAttribute('data-step'));
    el.classList.toggle('active', n === checkoutStep);
    el.classList.toggle('completed', n < checkoutStep);
  });
  const icon = document.getElementById('checkout-nav-icon');
  const title = document.getElementById('checkout-step-title');
  if (!icon || !title) return;
  if (checkoutStep === 1) {
    icon.className = 'fas fa-times';
    title.innerText = l.stepCartTitle;
  } else if (checkoutStep === 2) {
    icon.className = 'fas fa-arrow-left';
    title.innerText = l.stepDeliveryTitle;
  } else {
    icon.className = 'fas fa-arrow-left';
    title.innerText = l.stepReviewTitle;
  }
}

function buildCheckoutStep1() {
  refreshCartUI();
  buildCheckoutSuggestions();
}

function updateCheckoutStep1Summary() {
  const subEl = document.getElementById('s1-subtotal');
  if (!subEl) return;
  let subtotal = 0;
  let discount = 0;
  cart.forEach(item => {
    const orig = item.originalPrice || item.price;
    subtotal += item.price * item.qty;
    discount += (orig - item.price) * item.qty;
  });
  subEl.innerText = subtotal.toFixed(2);
  const discRow = document.getElementById('s1-discount-row');
  if (discount > 0) {
    discRow.style.display = 'flex';
    document.getElementById('s1-discount').innerText = discount.toFixed(2);
  } else {
    discRow.style.display = 'none';
  }
  document.getElementById('s1-total').innerText = subtotal.toFixed(2);
}

function buildCheckoutSuggestions() {
  const wrap = document.getElementById('checkout-suggested-grid');
  if (!wrap) return;
  const l = langData[currentLang];
  const cartSkus = new Set(cart.map(i => i.sku));
  const cartCategories = new Set(
    cart.map(i => {
      const prod = localProductDB.find(p => p.sku === i.sku);
      return prod ? prod.category : null;
    }).filter(Boolean)
  );

  let suggestions = localProductDB.filter(p => !cartSkus.has(p.sku) && cartCategories.has(p.category) && !getStockInfo(p).isOutOfStock);
  if (suggestions.length === 0) {
    suggestions = localProductDB.filter(p => !cartSkus.has(p.sku) && !getStockInfo(p).isOutOfStock);
  }
  suggestions = suggestions.slice(0, 8);

  if (suggestions.length === 0) { wrap.innerHTML = ''; return; }

  const fragment = document.createDocumentFragment();
  suggestions.forEach(p => {
    const { sellableStock, isOutOfStock } = getStockInfo(p);
    const cartItem = cart.find(item => item.sku === p.sku);
    const itemQty = cartItem ? cartItem.qty : 0;
    const actionHTML = buildCardActionHTML(p, isOutOfStock, itemQty, sellableStock, l);
    const img = p.image_url || 'https://via.placeholder.com/200?text=No+Image';
    const price = parseFloat(p.price) || 0;
    const discPrice = parseFloat(p.discount_price) || 0;
    const activePrice = (discPrice > 0 && discPrice < price) ? discPrice : price;
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.sku = p.sku;
    card.innerHTML = `
      <img src="${img}" alt="${p.name}" loading="lazy" decoding="async" onclick="viewProductDetails('${p.sku}')" style="height:110px;">
      <h5 onclick="viewProductDetails('${p.sku}')" style="font-size:13px; height:34px; overflow:hidden; margin-bottom:5px; cursor:pointer;">${p.name}</h5>
      <p style="color:var(--accent-color); font-weight:bold; font-size:14px; margin-bottom:8px;">৳${activePrice.toFixed(2)}</p>
      <div class="card-action-area">${actionHTML}</div>
    `;
    fragment.appendChild(card);
  });
  wrap.innerHTML = '';
  wrap.appendChild(fragment);
}

function buildCheckoutStep2() {
  if (currentUser) {
    const nameEl = document.getElementById('chk-name');
    const phoneEl = document.getElementById('chk-phone');
    const addrEl = document.getElementById('chk-address');
    if (nameEl && !nameEl.value) nameEl.value = currentUser.name || '';
    if (phoneEl && !phoneEl.value) phoneEl.value = currentUser.phone || '';
    if (addrEl && !addrEl.value && selectedPaymentMethod !== 'pickup') addrEl.value = getPrimaryAddressText(currentUser);
  }
  updateDeliveryChargeDisplay();
  togglePickupSection();
  updatePaymentInfoSections();
}

function getShippingChargeForZone(zone) {
  if (selectedPaymentMethod === 'pickup') return 0;
  return zone === 'inside' ? 60 : 150;
}

function selectPaymentMethod(method) {
  selectedPaymentMethod = method;
  document.querySelectorAll('.payment-method-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-method') === method);
  });
  togglePickupSection();
  updateDeliveryChargeDisplay();
  updatePaymentInfoSections();
}

function updatePaymentInfoSections() {
  const codSection = document.getElementById('cod-info-section');
  const onlineSection = document.getElementById('online-info-section');
  if (codSection) codSection.style.display = (selectedPaymentMethod === 'cod') ? 'block' : 'none';
  if (onlineSection) onlineSection.style.display = (selectedPaymentMethod === 'online') ? 'block' : 'none';
}

function getPaymentInfoFields(method) {
  if (method === 'pickup') return { txnEl: document.getElementById('pickup-txn-id'), amountEl: document.getElementById('pickup-advance-amount') };
  if (method === 'cod') return { txnEl: document.getElementById('cod-txn-id'), amountEl: document.getElementById('cod-advance-amount') };
  if (method === 'online') return { txnEl: document.getElementById('online-txn-id'), amountEl: document.getElementById('online-paid-amount') };
  return { txnEl: null, amountEl: null };
}

function togglePickupSection() {
  const isPickup = selectedPaymentMethod === 'pickup';
  const section = document.getElementById('pickup-txn-section');
  const zoneSection = document.getElementById('delivery-zone-section');
  const addressEl = document.getElementById('chk-address');

  if (section) section.style.display = isPickup ? 'block' : 'none';
  if (zoneSection) zoneSection.style.display = isPickup ? 'none' : 'block';

  if (addressEl) {
    if (isPickup) {
      if (customerAddressBeforePickup === null) customerAddressBeforePickup = addressEl.value;
      addressEl.value = langData[currentLang].fAddr;
      addressEl.readOnly = true;
      addressEl.classList.add('readonly-field');
    } else {
      addressEl.readOnly = false;
      addressEl.classList.remove('readonly-field');
      if (customerAddressBeforePickup !== null) {
        addressEl.value = customerAddressBeforePickup;
        customerAddressBeforePickup = null;
      }
    }
  }
}

function updateDeliveryChargeDisplay() {
  const zoneInput = document.querySelector('input[name="shipping-zone"]:checked');
  const zone = zoneInput ? zoneInput.value : 'inside';
  const shipping = getShippingChargeForZone(zone);
  const el = document.getElementById('s2-delivery-charge-val');
  if (el) el.innerText = shipping.toFixed(2);
}

function resetPaymentMethodState() {
  const addressEl = document.getElementById('chk-address');
  if (addressEl) {
    addressEl.readOnly = false;
    addressEl.classList.remove('readonly-field');
    if (customerAddressBeforePickup !== null) addressEl.value = customerAddressBeforePickup;
  }
  customerAddressBeforePickup = null;
  selectedPaymentMethod = 'cod';
  document.querySelectorAll('.payment-method-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-method') === 'cod');
  });
  ['pickup-txn-id', 'pickup-advance-amount', 'cod-txn-id', 'cod-advance-amount', 'online-txn-id', 'online-paid-amount'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  togglePickupSection();
  updateDeliveryChargeDisplay();
  updatePaymentInfoSections();
}

function buildCheckoutStep3() {
  const l = langData[currentLang];
  const name = document.getElementById('chk-name').value;
  const phone = document.getElementById('chk-phone').value;
  const address = document.getElementById('chk-address').value;
  const noteEl = document.getElementById('chk-delivery-note');
  const note = noteEl ? noteEl.value.trim() : '';
  const leaveDoorEl = document.getElementById('chk-leave-at-door');
  const leaveAtDoor = leaveDoorEl ? leaveDoorEl.checked : false;
  const zoneInput = document.querySelector('input[name="shipping-zone"]:checked');
  const zone = zoneInput ? zoneInput.value : 'inside';
  const shipping = getShippingChargeForZone(zone);

  document.getElementById('rev-cust-info').innerText = `${name} · ${phone}`;

  let addrDisplay = address;
  if (selectedPaymentMethod === 'pickup') {
    addrDisplay += ` (${l.pickupOrderLbl})`;
  }
  if (leaveAtDoor) addrDisplay += ` (${l.leaveAtDoorLbl})`;
  if (note) addrDisplay += ` — ${l.deliveryNoteLbl}: ${note}`;
  document.getElementById('rev-addr-info').innerText = addrDisplay;

  let payLabel = l.payMethodCodLbl;
  let amountLbl = l.advanceAmountLbl;
  if (selectedPaymentMethod === 'online') { payLabel = l.payMethodOnlineLbl; amountLbl = l.paidAmountLbl; }
  else if (selectedPaymentMethod === 'pickup') { payLabel = l.pickupOrderLbl; amountLbl = l.advanceAmountLbl; }
  document.getElementById('rev-pay-info').innerText = payLabel;

  const { txnEl, amountEl } = getPaymentInfoFields(selectedPaymentMethod);
  const txnId = txnEl ? txnEl.value.trim() : '';
  const amount = amountEl ? amountEl.value.trim() : '';
  const payExtra = document.getElementById('rev-pay-extra');
  document.getElementById('rev-pay-amount-lbl').innerText = amountLbl;
  if (txnId || amount) {
    payExtra.style.display = 'block';
    document.getElementById('rev-pay-txn-val').innerText = txnId || '-';
    document.getElementById('rev-pay-amount-val').innerText = amount ? `৳${amount}` : '-';
  } else {
    payExtra.style.display = 'none';
  }

  let subtotal = 0, discount = 0, points = 0;
  const itemRows = [];
  cart.forEach(item => {
    const orig = item.originalPrice || item.price;
    subtotal += item.price * item.qty;
    discount += (orig - item.price) * item.qty;
    points += item.points * item.qty;
    itemRows.push(`<div class="summary-line"><span>${item.name} (x${item.qty})</span><span>৳ ${(item.price * item.qty).toFixed(2)}</span></div>`);
  });
  document.getElementById('rev-items-list').innerHTML = itemRows.join('');

  const grandTotal = subtotal + shipping;
  document.getElementById('rev-subtotal').innerText = subtotal.toFixed(2);
  const discRow = document.getElementById('rev-discount-row');
  if (discount > 0) {
    discRow.style.display = 'flex';
    document.getElementById('rev-discount').innerText = discount.toFixed(2);
  } else {
    discRow.style.display = 'none';
  }
  document.getElementById('rev-delivery').innerText = shipping.toFixed(2);
  document.getElementById('rev-grandtotal').innerText = grandTotal.toFixed(2);
  document.getElementById('rev-points').innerText = points;
}

async function submitCustomerOrder(e) {
  if (e && e.preventDefault) e.preventDefault();
  if(cart.length === 0) return;
  const l = langData[currentLang];
  const submitBtn = document.getElementById('chk-confirm-btn');
  const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.style.cursor = 'not-allowed';
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${l.processingOrder}`;
  }

  const name = document.getElementById('chk-name').value;
  const phone = document.getElementById('chk-phone').value;
  const addressEl = document.getElementById('chk-address');
  const address = addressEl.value;
  const noteEl = document.getElementById('chk-delivery-note');
  let note = noteEl ? noteEl.value.trim() : '';
  const leaveDoorEl = document.getElementById('chk-leave-at-door');
  const leaveAtDoor = leaveDoorEl ? leaveDoorEl.checked : false;
  if (leaveAtDoor) note = note ? `${note} (${l.leaveAtDoorLbl})` : l.leaveAtDoorLbl;

  const zone = document.querySelector('input[name="shipping-zone"]:checked').value;
  const shipping = getShippingChargeForZone(zone);

  let deliveryType = zone === 'inside' ? 'Inside Subarnachar' : 'Outside Subarnachar';
  let paymentMethodCanonical = 'Cash on Delivery';
  if (selectedPaymentMethod === 'online') {
    paymentMethodCanonical = 'Online Payment';
  } else if (selectedPaymentMethod === 'pickup') {
    paymentMethodCanonical = 'Pickup Order';
    deliveryType = 'Pickup Order';
  }

  const { txnEl, amountEl } = getPaymentInfoFields(selectedPaymentMethod);
  const txnId = txnEl ? txnEl.value.trim() : '';
  const amount = amountEl ? amountEl.value.trim() : '';

  let subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
  let totalPoints = cart.reduce((s, i) => s + (i.points * i.qty), 0);
  let grandTotal = subtotal + shipping;
  const d = new Date();
  const orderId = `SACAR-${String(d.getFullYear()).slice(-2)}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${Math.floor(1000 + Math.random()*9000)}`;
  const orderDate = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const orderTime = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
  const itemsText = cart.map(i => `${i.name} (x${i.qty})`).join(', ');
  const payload = {
    action: "placeOrder",
    orderId: orderId,
    orderDate: orderDate,
    orderTime: orderTime,
    customerName: name,
    customerPhone: phone,
    orderSource: "Website",
    deliveryType: deliveryType,
    paymentMethod: paymentMethodCanonical,
    address: address,
    deliveryNote: note,
    transactionId: txnId,
    advanceAmount: amount,
    deliveryCharge: shipping,
    grandTotal: grandTotal.toFixed(2),
    earnedPoints: totalPoints,
    itemsDetails: itemsText
  };
  try {
    const response = await fetch(WEB_APP_URL, { method: "POST", body: JSON.stringify(payload) });
    const result = await response.json();
    if(result.success) {
      if(currentUser && phone === currentUser.phone) {
        currentUser.points = parseInt(currentUser.points) + parseInt(totalPoints);
        localStorage.setItem('sacar_customer', JSON.stringify(currentUser));
        syncAuthUI();
      }
      cart = [];
      refreshCartUI();
      applyFiltersAndSort();
      checkoutStep = 1;
      resetPaymentMethodState();

      const modalMsg = `${l.orderSuccess}<br>${l.orderIdLbl} ${orderId}`;
      document.getElementById('success-modal-msg').innerHTML = modalMsg;

      document.getElementById('order-success-modal').style.display = 'flex';
    } else {
      showToast(l.orderProcessError, "error");
    }
  } catch(err) {
    showToast(l.networkErrorOrder, "error");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '';
      submitBtn.style.cursor = '';
      submitBtn.innerHTML = originalBtnHTML;
    }
  }
}

function closeSuccessModal() {
  document.getElementById('order-success-modal').style.display = 'none';
  showView('home');
}

function parseSavedAddresses(raw) {
  const defaults = [{ label: 'Home', address: '' }, { label: 'Office', address: '' }, { label: 'Other', address: '' }];
  if (!raw) return defaults;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length && parsed[0] && typeof parsed[0] === 'object' && 'label' in parsed[0]) {
      const result = defaults.map(d => ({ ...d }));
      parsed.forEach(item => {
        const idx = result.findIndex(r => r.label === item.label);
        if (idx !== -1) result[idx].address = item.address || '';
      });
      return result;
    }
  } catch (e) { /* legacy plain-text address, fall through */ }
  return [{ label: 'Home', address: raw }, { label: 'Office', address: '' }, { label: 'Other', address: '' }];
}

function stringifySavedAddresses(arr) {
  return JSON.stringify(arr.filter(a => a.address && a.address.trim() !== ''));
}

function getPrimaryAddressText(user) {
  if (!user || !user.address) return '';
  const list = parseSavedAddresses(user.address);
  const found = list.find(a => a.address && a.address.trim() !== '');
  return found ? found.address : '';
}

function getMemberSince(phone) {
  if (!phone) return '';
  const key = 'sacar_member_since';
  let store = {};
  try { store = JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) { store = {}; }
  if (!store[phone]) {
    store[phone] = new Date().toISOString().slice(0, 10);
    localStorage.setItem(key, JSON.stringify(store));
  }
  return store[phone];
}

function getRewardTierInfo(points) {
  const tiers = [
    { name: 'Bronze', min: 0 },
    { name: 'Silver', min: 500 },
    { name: 'Gold', min: 1000 },
    { name: 'Platinum', min: 2000 }
  ];
  let current = tiers[0];
  let next = tiers[1];
  for (let i = 0; i < tiers.length; i++) {
    if (points >= tiers[i].min) {
      current = tiers[i];
      next = tiers[i + 1] || null;
    }
  }
  if (!next) return { current, next: null, progressPct: 100, pointsToNext: 0 };
  const span = next.min - current.min;
  const progressed = points - current.min;
  const progressPct = Math.max(0, Math.min(100, Math.round((progressed / span) * 100)));
  const pointsToNext = next.min - points;
  return { current, next, progressPct, pointsToNext };
}

function getReferralCode(userId) {
  if (!userId) return '';
  const cleaned = userId.toString().replace(/[^A-Za-z0-9]/g, '');
  return 'SACAR-' + cleaned.slice(-6).toUpperCase();
}

function scrollToProfileSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function copyReferralLink() {
  const input = document.getElementById('referral-link-val');
  if (!input) return;
  const l = langData[currentLang];
  input.select();
  input.setSelectionRange(0, 99999);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(input.value)
      .then(() => showToast(l.referralCopied, "success"))
      .catch(() => { document.execCommand('copy'); showToast(l.referralCopied, "success"); });
  } else {
    document.execCommand('copy');
    showToast(l.referralCopied, "success");
  }
}

function shareReferralLink() {
  const input = document.getElementById('referral-link-val');
  const link = input ? input.value : '';
  const l = langData[currentLang];
  if (navigator.share) {
    navigator.share({ title: 'SACAR Mart', text: l.referralShareText, url: link }).catch(() => {});
  } else {
    copyReferralLink();
  }
}

function buildProfilePage() {
  if(!currentUser) { showView('home'); return; }
  const l = langData[currentLang];
  const points = parseInt(currentUser.points) || 0;

  document.getElementById('prof-header-name').innerText = currentUser.name || '';
  document.getElementById('prof-welcome-name').innerText = currentUser.name || '';
  document.getElementById('prof-header-id').innerText = currentUser.userId || 'N/A';
  document.getElementById('prof-id').innerText = currentUser.userId || 'N/A';

  const memberSince = getMemberSince(currentUser.phone);
  document.getElementById('prof-member-since').innerText = memberSince;
  document.getElementById('prof-member-since-2').innerText = memberSince;

  document.getElementById('prof-header-points').innerText = points;
  document.getElementById('stat-total-points').innerText = points;

  const tierInfo = getRewardTierInfo(points);
  const tierNameMap = { Bronze: l.tierBronze, Silver: l.tierSilver, Gold: l.tierGold, Platinum: l.tierPlatinum };
  document.getElementById('reward-progress-fill').style.width = tierInfo.progressPct + '%';
  document.getElementById('reward-progress-text').innerText = `${points} / ${tierInfo.next ? tierInfo.next.min : tierInfo.current.min}`;
  document.getElementById('current-tier-badge').innerText = tierNameMap[tierInfo.current.name];
  if (tierInfo.next) {
    document.getElementById('reward-next-tier-msg').innerText = `${l.pointsToNextTierPrefix} ${tierInfo.pointsToNext} ${l.pointsToNextTierSuffix} ${tierNameMap[tierInfo.next.name]}`.replace(/\s+/g, ' ').trim();
  } else {
    document.getElementById('reward-next-tier-msg').innerText = l.maxTierReached;
  }

  document.getElementById('prof-name').value = currentUser.name || '';
  document.getElementById('prof-phone').value = currentUser.phone || '';
  document.getElementById('prof-email').value = currentUser.email || '';

  const addresses = parseSavedAddresses(currentUser.address);
  document.getElementById('addr-home').value = addresses[0] ? addresses[0].address : '';
  document.getElementById('addr-office').value = addresses[1] ? addresses[1].address : '';
  document.getElementById('addr-other').value = addresses[2] ? addresses[2].address : '';

  const refCode = getReferralCode(currentUser.userId);
  document.getElementById('referral-code-val').innerText = refCode;
  document.getElementById('referral-link-val').value = `${window.location.origin}${window.location.pathname}?ref=${refCode}`;

  document.getElementById('acct-status-val').innerText = l.acctStatusActive;
  document.getElementById('acct-email-verify-val').innerText = l.notVerified;
  document.getElementById('acct-phone-verify-val').innerText = l.notVerified;

  loadOrderStatistics();
}

async function loadOrderStatistics() {
  if (!currentUser) return;
  const l = langData[currentLang];
  const totalEl = document.getElementById('stat-total-orders');
  const completedEl = document.getElementById('stat-completed-orders');
  const pendingEl = document.getElementById('stat-pending-orders');
  const historyContainer = document.getElementById('order-history-list');

  try {
    const response = await fetch(WEB_APP_URL, { method: "POST", body: JSON.stringify({ action: "getMyOrders", phone: currentUser.phone }) });
    const result = await response.json();
    if (result.success) {
      const orders = result.orders || [];
      let completed = 0, pending = 0;
      orders.forEach(o => {
        const st = (o.status || '').toString().trim().toLowerCase();
        if (st === 'completed') completed++;
        else if (st !== 'cancelled') pending++;
      });
      if (totalEl) totalEl.innerText = orders.length;
      if (completedEl) completedEl.innerText = completed;
      if (pendingEl) pendingEl.innerText = pending;
      renderOrderHistory(orders);
    } else if (historyContainer) {
      historyContainer.innerHTML = `<p class="empty-order-msg">${l.orderHistoryLoadError}</p>`;
    }
  } catch (e) {
    if (historyContainer) historyContainer.innerHTML = `<p class="empty-order-msg">${l.orderHistoryLoadError}</p>`;
  }
}

function renderOrderHistory(orders) {
  const container = document.getElementById('order-history-list');
  if (!container) return;
  const l = langData[currentLang];
  if (!orders.length) {
    container.innerHTML = `<p class="empty-order-msg">${l.noOrdersYet}</p>`;
    return;
  }
  const statusLabelMap = { completed: l.statusCompleted, pending: l.statusPending, cancelled: l.statusCancelled };
  const sorted = [...orders].reverse().slice(0, 20);
  const rows = sorted.map(o => {
    const stRaw = (o.status || 'Pending').toString().trim().toLowerCase();
    const stClass = stRaw === 'completed' ? 'completed' : (stRaw === 'cancelled' ? 'cancelled' : 'pending');
    const stLabel = statusLabelMap[stClass] || o.status;
    return `
      <div class="order-history-row">
        <div class="order-history-main">
          <span class="order-history-id">${o.orderId || ''}</span>
          <span class="order-history-date">${o.orderDate || ''} ${o.orderTime || ''}</span>
        </div>
        <div class="order-history-side">
          <span class="order-status-badge ${stClass}">${stLabel}</span>
          <span class="order-history-total">৳${o.grandTotal || '0'}</span>
        </div>
      </div>
    `;
  });
  container.innerHTML = rows.join('');
}

async function updateCustomerProfile() {
  if(!currentUser) return;
  const l = langData[currentLang];
  const name = document.getElementById('prof-name').value;
  const email = document.getElementById('prof-email').value;

  const payload = {
    action: "updateProfile",
    lang: currentLang,
    phone: currentUser.phone,
    name: name,
    email: email
  };

  try {
    const res = await fetch(WEB_APP_URL, { method: "POST", body: JSON.stringify(payload) });
    const result = await res.json();
    if(result.success) {
      currentUser.name = name;
      currentUser.email = email;
      localStorage.setItem('sacar_customer', JSON.stringify(currentUser));
      showToast(l.profUpdateSuccess, "success");
      syncAuthUI();
      buildProfilePage();
    } else {
      showToast(result.message || l.profileUpdateFail, "error");
    }
  } catch {
    showToast(l.profileUpdateFail, "error");
  }
}

async function saveDeliveryAddresses() {
  if(!currentUser) return;
  const l = langData[currentLang];
  const addresses = [
    { label: 'Home', address: document.getElementById('addr-home').value.trim() },
    { label: 'Office', address: document.getElementById('addr-office').value.trim() },
    { label: 'Other', address: document.getElementById('addr-other').value.trim() }
  ];
  const serialized = stringifySavedAddresses(addresses);

  const payload = {
    action: "updateProfile",
    lang: currentLang,
    phone: currentUser.phone,
    address: serialized
  };

  try {
    const res = await fetch(WEB_APP_URL, { method: "POST", body: JSON.stringify(payload) });
    const result = await res.json();
    if(result.success) {
      currentUser.address = serialized;
      localStorage.setItem('sacar_customer', JSON.stringify(currentUser));
      showToast(l.addrSaveSuccess, "success");
    } else {
      showToast(result.message || l.addrSaveFail, "error");
    }
  } catch {
    showToast(l.addrSaveFail, "error");
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
  if (open) updateCartDrawerLayout();
}

window.addEventListener('resize', () => {
  const drawer = document.getElementById('cart-drawer');
  if (drawer && drawer.classList.contains('active')) updateCartDrawerLayout();
});

function initFloatingCartBubble() {
  const bubble = document.getElementById('floating-cart-bubble');
  if (!bubble) return;

  const savedPos = JSON.parse(localStorage.getItem('sacar_bubble_pos') || 'null');
  if (savedPos) {
    bubble.style.left = savedPos.left;
    bubble.style.top = savedPos.top;
    bubble.style.right = 'auto';
    bubble.style.bottom = 'auto';
  }

  const dragState = { dragging: false, moved: false, startX: 0, startY: 0, offsetX: 0, offsetY: 0 };

  bubble.addEventListener('pointerdown', (e) => {
    dragState.dragging = true;
    dragState.moved = false;
    const rect = bubble.getBoundingClientRect();
    dragState.offsetX = e.clientX - rect.left;
    dragState.offsetY = e.clientY - rect.top;
    dragState.startX = e.clientX;
    dragState.startY = e.clientY;
    bubble.setPointerCapture(e.pointerId);
    bubble.style.transition = 'none';
  });

  bubble.addEventListener('pointermove', (e) => {
    if (!dragState.dragging) return;
    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) dragState.moved = true;
    if (!dragState.moved) return;

    let newLeft = e.clientX - dragState.offsetX;
    let newTop = e.clientY - dragState.offsetY;

    const maxLeft = window.innerWidth - bubble.offsetWidth - 4;
    const maxTop = window.innerHeight - bubble.offsetHeight - 4;
    newLeft = Math.min(Math.max(4, newLeft), maxLeft);
    newTop = Math.min(Math.max(4, newTop), maxTop);

    bubble.style.left = newLeft + 'px';
    bubble.style.top = newTop + 'px';
    bubble.style.right = 'auto';
    bubble.style.bottom = 'auto';
  });

  bubble.addEventListener('pointerup', (e) => {
    if (!dragState.dragging) return;
    dragState.dragging = false;
    bubble.style.transition = '';
    if (bubble.releasePointerCapture) bubble.releasePointerCapture(e.pointerId);

    if (dragState.moved) {
      const rect = bubble.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const snapLeft = centerX < window.innerWidth / 2;
      const finalLeft = snapLeft ? 12 : (window.innerWidth - rect.width - 12);
      bubble.style.left = finalLeft + 'px';
      localStorage.setItem('sacar_bubble_pos', JSON.stringify({ left: bubble.style.left, top: bubble.style.top }));
    } else {
      showView('checkout');
    }
  });
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
  syncCategoryActiveUI();
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

  document.getElementById("welcome-back-txt").innerText = l.welcomeBackTxt;
  document.getElementById("welcome-sub-txt").innerText = l.welcomeSubTxt;
  document.getElementById("prof-member-since-lbl").innerText = l.memberSinceLbl;
  document.getElementById("prof-header-points-lbl").innerText = l.pointsUnitShort;
  document.getElementById("reward-progress-title").innerText = l.rewardProgressTitle;
  document.getElementById("stat-total-orders-lbl").innerText = l.statTotalOrdersLbl;
  document.getElementById("stat-completed-orders-lbl").innerText = l.statCompletedOrdersLbl;
  document.getElementById("stat-pending-orders-lbl").innerText = l.statPendingOrdersLbl;
  document.getElementById("stat-total-points-lbl").innerText = l.statTotalPointsLbl;
  document.getElementById("qa-orders-lbl").innerText = l.qaOrdersLbl;
  document.getElementById("qa-rewards-lbl").innerText = l.qaRewardsLbl;
  document.getElementById("qa-refer-lbl").innerText = l.qaReferLbl;
  document.getElementById("qa-logout-lbl").innerText = l.qaLogoutLbl;
  document.getElementById("personal-info-title").innerText = l.personalInfoTitle;
  document.getElementById("prof-name-lbl").innerText = l.profName;
  document.getElementById("prof-phone-lbl").innerText = l.profPhone;
  document.getElementById("prof-email-lbl").innerText = l.profEmail;
  document.getElementById("prof-save-btn").innerText = l.profSave;
  document.getElementById("addr-section-title").innerText = l.addrSectionTitle;
  document.getElementById("addr-section-sub").innerText = l.addrSectionSub;
  document.getElementById("addr-home-lbl").innerText = l.addrHomeLbl;
  document.getElementById("addr-home").placeholder = l.addrHomePh;
  document.getElementById("addr-office-lbl").innerText = l.addrOfficeLbl;
  document.getElementById("addr-office").placeholder = l.addrOfficePh;
  document.getElementById("addr-other-lbl").innerText = l.addrOtherLbl;
  document.getElementById("addr-other").placeholder = l.addrOtherPh;
  document.getElementById("addr-save-btn").innerText = l.addrSaveBtn;
  document.getElementById("prof-pass-title").innerHTML = `<i class="fas fa-key"></i> ${l.profPassTitle}`;
  document.getElementById("prof-old-pass-lbl").innerText = l.profOldPassLbl;
  document.getElementById("prof-old-pass").placeholder = l.profOldPassPh;
  document.getElementById("prof-new-pass-lbl").innerText = l.profNewPassLbl;
  document.getElementById("prof-new-pass").placeholder = l.profNewPassPh;
  document.getElementById("prof-pass-btn").innerText = l.profPassBtn;
  document.getElementById("referral-title").innerText = l.referralTitle;
  document.getElementById("referral-sub").innerText = l.referralSub;
  document.getElementById("referral-copy-lbl").innerText = l.referralCopyLbl;
  document.getElementById("referral-link-lbl").innerText = l.referralLinkLbl;
  document.getElementById("referral-count-lbl").innerText = l.referralCountLbl;
  document.getElementById("referral-reward-lbl").innerText = l.referralRewardLbl;
  document.getElementById("acct-info-title").innerText = l.acctInfoTitle;
  document.getElementById("acct-userid-lbl").innerText = l.acctUserIdLbl;
  document.getElementById("acct-status-lbl").innerText = l.acctStatusLbl;
  document.getElementById("acct-member-since-lbl").innerText = l.acctMemberSinceLbl;
  document.getElementById("acct-email-verify-lbl").innerText = l.acctEmailVerifyLbl;
  document.getElementById("acct-phone-verify-lbl").innerText = l.acctPhoneVerifyLbl;
  document.getElementById("order-history-title").innerText = l.orderHistoryTitle;
  if (currentUser) {
    document.getElementById("acct-status-val").innerText = l.acctStatusActive;
    document.getElementById("acct-email-verify-val").innerText = l.notVerified;
    document.getElementById("acct-phone-verify-val").innerText = l.notVerified;
    const tierInfo = getRewardTierInfo(parseInt(currentUser.points) || 0);
    const tierNameMap = { Bronze: l.tierBronze, Silver: l.tierSilver, Gold: l.tierGold, Platinum: l.tierPlatinum };
    const tierBadge = document.getElementById("current-tier-badge");
    if (tierBadge) tierBadge.innerText = tierNameMap[tierInfo.current.name];
  }

  document.getElementById("checkout-step-title").innerText = checkoutStep === 1 ? l.stepCartTitle : (checkoutStep === 2 ? l.stepDeliveryTitle : l.stepReviewTitle);
  document.getElementById("prog-step1-lbl").innerText = l.progStep1;
  document.getElementById("prog-step2-lbl").innerText = l.progStep2;
  document.getElementById("prog-step3-lbl").innerText = l.progStep3;
  document.getElementById("add-more-txt").innerText = l.addMoreBtn;
  document.getElementById("checkout-suggested-title").innerText = l.suggestedTitle;
  document.getElementById("s1-sub-lbl").innerText = l.sumSub;
  document.getElementById("s1-disc-lbl").innerText = l.discountLbl;
  document.getElementById("s1-total-lbl").innerText = l.estimatedTotal;
  document.getElementById("step1-continue-txt").innerText = l.continueBtn;

  document.getElementById("chk-addr-lbl").innerText = l.chkAddr;
  document.getElementById("chk-address").placeholder = l.chkAddrPh;
  document.getElementById("chk-name-lbl").innerText = l.chkName;
  document.getElementById("chk-name").placeholder = l.chkNamePh;
  document.getElementById("chk-phone-lbl").innerText = l.chkPhone;
  document.getElementById("chk-phone").placeholder = l.chkPhonePh;
  document.getElementById("chk-note-lbl").innerText = l.deliveryNoteLbl;
  document.getElementById("chk-delivery-note").placeholder = l.deliveryNotePh;
  document.getElementById("chk-leave-at-door-lbl").innerText = l.leaveAtDoorLbl;
  document.getElementById("chk-zone-lbl").innerText = l.chkZone;
  document.getElementById("chk-zone-in").innerText = l.chkIn;
  document.getElementById("chk-zone-out").innerText = l.chkOut;
  document.getElementById("chk-del-charge-lbl").innerText = l.deliveryChargeLbl;
  document.getElementById("pickup-txn-lbl").innerText = l.pickupInfoLbl;
  document.getElementById("pickup-txn-id").placeholder = l.pickupTxnPh;
  document.getElementById("pickup-advance-amount").placeholder = l.advanceAmountPh;
  document.getElementById("pickup-notice-txt").innerText = l.pickupNoticeText;
  document.getElementById("cod-info-lbl").innerText = l.codInfoLbl;
  document.getElementById("cod-txn-id").placeholder = l.pickupTxnPh;
  document.getElementById("cod-advance-amount").placeholder = l.advanceAmountPh;
  document.getElementById("cod-notice-txt").innerText = l.codNoticeText;
  document.getElementById("online-info-lbl").innerText = l.onlineInfoLbl;
  document.getElementById("online-txn-id").placeholder = l.pickupTxnPh;
  document.getElementById("online-paid-amount").placeholder = l.paidAmountPh;
  document.getElementById("online-notice-txt").innerText = l.onlineNoticeText;
  document.getElementById("chk-pay-lbl").innerText = l.chkPay;
  document.getElementById("pay-btn-cod-lbl").innerText = l.payMethodCodLbl;
  document.getElementById("pay-btn-online-lbl").innerText = l.payMethodOnlineLbl;
  document.getElementById("pay-btn-pickup-lbl").innerText = l.pickupOrderLbl;
  document.getElementById("step2-continue-txt").innerText = l.continueToReviewBtn;

  document.getElementById("rev-cust-title").innerText = l.custInfoTitle;
  document.getElementById("rev-addr-title").innerText = l.reviewAddrTitle;
  document.getElementById("rev-pay-title").innerText = l.paymentMethodTitle;
  document.getElementById("rev-pay-txn-lbl").innerText = `${l.paymentTxnLbl}:`;
  document.getElementById("rev-items-title").innerText = l.orderedProductsTitle;
  document.getElementById("rev-sub-lbl").innerText = l.sumSub;
  document.getElementById("rev-disc-lbl").innerText = l.discountLbl;
  document.getElementById("rev-del-lbl").innerText = l.sumDel;
  document.getElementById("rev-total-lbl").innerText = l.sumTotal;
  document.getElementById("rev-pts-lbl").innerText = l.sumPts;
  document.getElementById("rev-pts-unit").innerText = l.sumPtsUnit;
  document.getElementById("chk-btn-txt").innerText = l.chkBtn;

  document.getElementById("cart-title").innerText = l.cartTitle;
  document.getElementById("cart-total-lbl").innerText = l.cartTotal;
  document.getElementById("cart-chk-btn").innerHTML = l.cartChk + '<i class="fas fa-arrow-right"></i>';
  document.getElementById("related-box-title").innerText = l.relatedTitle;
  if (checkoutStep === 3) buildCheckoutStep3();
  if (checkoutStep === 1) buildCheckoutSuggestions();

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

function positionSortDropdown() {
  const btn = document.getElementById("sort-trigger-btn");
  const content = document.querySelector("#sort-bottom-sheet .bottom-sheet-content");
  if (!btn || !content) return;
  const rect = btn.getBoundingClientRect();
  const dropdownWidth = Math.min(260, window.innerWidth - 20);
  content.style.width = dropdownWidth + "px";
  let left = rect.left;
  const maxLeft = window.innerWidth - dropdownWidth - 10;
  if (left > maxLeft) left = Math.max(10, maxLeft);
  content.style.left = left + "px";
  content.style.top = (rect.bottom + 8) + "px";
}

function toggleSortBottomSheet(show) {
  const sheet = document.getElementById("sort-bottom-sheet");
  if (!sheet) return;
  if (show) {
    positionSortDropdown();
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

  const detailsModal = document.getElementById("details-modal");
  if (detailsModal) {
    detailsModal.addEventListener("click", (e) => {
      if (e.target === detailsModal) closeDetailsModal();
    });
  }

  window.addEventListener("resize", () => {
    const sheet = document.getElementById("sort-bottom-sheet");
    if (sheet && sheet.classList.contains("active")) positionSortDropdown();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const dm = document.getElementById("details-modal");
    if (dm && dm.style.display === "flex") { closeDetailsModal(); return; }
    const sheet = document.getElementById("sort-bottom-sheet");
    if (sheet && sheet.classList.contains("active")) toggleSortBottomSheet(false);
  });
});

function applyFiltersAndSort() {
  let filteredProducts = localProductDB;

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

  renderProductGrid(finalProductsList);
}
