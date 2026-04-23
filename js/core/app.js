(() => {
  const App = (window.DuongGiaStoreApp = window.DuongGiaStoreApp || {});

  const productDataSources = Object.values(window.DuongGiaStoreProducts || {});
  const products = productDataSources.flatMap((source) => source.products || []);
  const productGalleries = productDataSources.reduce(
    (acc, source) => Object.assign(acc, source.productGalleries || {}),
    {}
  );

  const defaultProductImage =
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";
  const imagePlaceholder =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3C/svg%3E";

  const state = App.state || {
    currentSlide: 0,
    currentTab: "bestSeller",
    currentNewProductsTab: "newArrival",
    currentPromoProductsTab: "discount",
    currentCategory: "all",
  };

  const elements = {
    body: document.body,
    tabProductGrid: document.getElementById("tabProductGrid"),
    tabProductCarousel: document.getElementById("tabProductCarousel"),
    tabProductPrev: document.getElementById("tabProductPrev"),
    tabProductNext: document.getElementById("tabProductNext"),
    productTabs: document.getElementById("productTabs"),
    newProductsTabs: document.getElementById("newProductsTabs"),
    promoProductsTabs: document.querySelector("#promo-products .tabs"),
    categoryButtons: [...document.querySelectorAll("[data-category-filter]")],
    laptopGrid: document.getElementById("laptopGrid"),
    desktopGrid: document.getElementById("desktopGrid"),
    gamingGrid: document.getElementById("gamingGrid"),
    openMobileMenu: document.getElementById("openMobileMenu"),
    mobileDrawer: document.getElementById("mobileDrawer"),
    globalBackdrop: document.getElementById("globalBackdrop"),
    productModal: document.getElementById("productModal"),
    productModalContent: document.getElementById("productModalContent"),
    loginModal: document.getElementById("loginModal"),
    openLoginModal: document.getElementById("openLoginModal"),
    loginForm: document.getElementById("loginForm"),
    loginStatus: document.getElementById("loginStatus"),
    loginIdentity: document.getElementById("loginIdentity"),
    loginPassword: document.getElementById("loginPassword"),
    rememberLogin: document.getElementById("rememberLogin"),
    toast: document.getElementById("toast"),
    backToTop: document.getElementById("backToTop"),
    themeToggle: document.getElementById("themeToggle"),
    themeToggleMobile: document.getElementById("themeToggleMobile"),
    heroSlides: [...document.querySelectorAll(".hero-slide")],
    heroDots: document.getElementById("heroDots"),
    prevSlide: document.getElementById("prevSlide"),
    nextSlide: document.getElementById("nextSlide"),
  };

  let imageObserver = null;

  function refreshElements() {
    Object.assign(elements, {
      body: document.body,
      tabProductGrid: document.getElementById("tabProductGrid"),
      tabProductCarousel: document.getElementById("tabProductCarousel"),
      tabProductPrev: document.getElementById("tabProductPrev"),
      tabProductNext: document.getElementById("tabProductNext"),
      productTabs: document.getElementById("productTabs"),
      newProductsTabs: document.getElementById("newProductsTabs"),
      promoProductsTabs: document.querySelector("#promo-products .tabs"),
      categoryButtons: [...document.querySelectorAll("[data-category-filter]")],
      laptopGrid: document.getElementById("laptopGrid"),
      desktopGrid: document.getElementById("desktopGrid"),
      gamingGrid: document.getElementById("gamingGrid"),
      openMobileMenu: document.getElementById("openMobileMenu"),
      mobileDrawer: document.getElementById("mobileDrawer"),
      globalBackdrop: document.getElementById("globalBackdrop"),
      productModal: document.getElementById("productModal"),
      productModalContent: document.getElementById("productModalContent"),
      loginModal: document.getElementById("loginModal"),
      openLoginModal: document.getElementById("openLoginModal"),
      loginForm: document.getElementById("loginForm"),
      loginStatus: document.getElementById("loginStatus"),
      loginIdentity: document.getElementById("loginIdentity"),
      loginPassword: document.getElementById("loginPassword"),
      rememberLogin: document.getElementById("rememberLogin"),
      toast: document.getElementById("toast"),
      backToTop: document.getElementById("backToTop"),
      themeToggle: document.getElementById("themeToggle"),
      themeToggleMobile: document.getElementById("themeToggleMobile"),
      heroSlides: [...document.querySelectorAll(".hero-slide")],
      heroDots: document.getElementById("heroDots"),
      prevSlide: document.getElementById("prevSlide"),
      nextSlide: document.getElementById("nextSlide"),
    });

    return elements;
  }

  function formatCurrency(value) {
    return value.toLocaleString("vi-VN") + "₫";
  }

  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function updateThemeToggle(theme) {
    const toggleButtons = [elements.themeToggle, elements.themeToggleMobile].filter(Boolean);

    toggleButtons.forEach((button) => {
      const icon = button.querySelector(".theme-toggle__icon");
      const text = button.querySelector(".theme-toggle__text");

      if (icon) icon.textContent = theme === "dark" ? "☀️" : "🌙";
      if (text) text.textContent = theme === "dark" ? "Giao diện sáng" : "Giao diện tối";

      button.setAttribute(
        "aria-label",
        theme === "dark" ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"
      );
    });
  }

  function applyTheme(theme) {
    elements.body.dataset.theme = theme;
    updateThemeToggle(theme);
  }

  function findProductById(productId) {
    return products.find((product) => product.id === productId);
  }

  function getProductImage(product) {
    return product.image || defaultProductImage;
  }

  function getProductGallery(product) {
    const extraImages = productGalleries[product.id] || [];

    return [getProductImage(product), ...extraImages]
      .filter(Boolean)
      .filter((image, index, list) => list.indexOf(image) === index)
      .slice(0, 4);
  }

  function getFilteredProducts(baseList = products) {
    return baseList.filter((product) => {
      return state.currentCategory === "all" || product.category === state.currentCategory;
    });
  }

  function getProductsByTag(tagName) {
    return getFilteredProducts().filter((product) => product.tags.includes(tagName));
  }

  function getTabProducts() {
    return getProductsByTag(state.currentTab);
  }

  function createProductCard(product) {
    return `
      <article class="product-card">
        <div class="product-card__discount">-${product.discount}%</div>
        <div class="product-card__media">
          <img
            src="${imagePlaceholder}"
            data-src="${getProductImage(product)}"
            alt="${product.name}"
            loading="lazy"
            decoding="async"
            fetchpriority="low"
            referrerpolicy="no-referrer"
            class="lazy-product-image"
          />
        </div>
        <span class="product-card__category">${product.label}</span>
        <h3 class="product-card__title">${product.name}</h3>
        <div class="product-card__pricing">
          <span class="product-card__current">Liên Hệ</span>
        </div>
        <div class="product-card__actions">
          <button type="button" class="btn-quick" data-action="quick-view" data-id="${product.id}">
            Xem nhanh
          </button>
        </div>
      </article>
    `;
  }

  function initLazyImages() {
    const lazyImages = [...document.querySelectorAll(".lazy-product-image[data-src]")];

    if (!lazyImages.length) return;

    if (!("IntersectionObserver" in window)) {
      lazyImages.forEach((image) => {
        image.src = image.dataset.src;
        image.removeAttribute("data-src");
      });
      return;
    }

    if (imageObserver) imageObserver.disconnect();

    imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const image = entry.target;
          const source = image.dataset.src;

          if (source) {
            image.src = source;
            image.removeAttribute("data-src");
          }

          observer.unobserve(image);
        });
      },
      {
        rootMargin: "250px 0px",
      }
    );

    lazyImages.forEach((image) => imageObserver.observe(image));
  }

  App.config = {
    defaultProductImage,
    imagePlaceholder,
  };
  App.state = state;
  App.elements = elements;
  App.products = products;
  App.productGalleries = productGalleries;
  App.refreshElements = refreshElements;
  App.formatCurrency = formatCurrency;
  App.getSystemTheme = getSystemTheme;
  App.updateThemeToggle = updateThemeToggle;
  App.applyTheme = applyTheme;
  App.findProductById = findProductById;
  App.getProductImage = getProductImage;
  App.getProductGallery = getProductGallery;
  App.getFilteredProducts = getFilteredProducts;
  App.getProductsByTag = getProductsByTag;
  App.getTabProducts = getTabProducts;
  App.createProductCard = createProductCard;
  App.initLazyImages = initLazyImages;
})();
