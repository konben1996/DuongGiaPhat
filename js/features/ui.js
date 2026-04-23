(() => {
  const App = window.DuongGiaStoreApp;
  if (!App) return;

  let sliderTimer = null;

  function setOverlayVisibility() {
    const hasDrawerOpen = App.elements.mobileDrawer?.classList.contains("is-open");
    const hasProductModalOpen = App.elements.productModal?.classList.contains("is-open");
    const hasLoginModalOpen = App.elements.loginModal?.classList.contains("is-open");

    if (App.elements.globalBackdrop) {
      App.elements.globalBackdrop.hidden = !(hasDrawerOpen || hasLoginModalOpen);
    }

    App.elements.body.classList.toggle("is-locked", hasDrawerOpen || hasProductModalOpen || hasLoginModalOpen);
  }

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    setOverlayVisibility();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    setOverlayVisibility();
  }

  function openDrawer(drawer) {
    if (!drawer) return;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    setOverlayVisibility();
  }

  function closeDrawer(drawer) {
    if (!drawer) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    setOverlayVisibility();
  }

  function closeAllDrawers() {
    closeDrawer(App.elements.mobileDrawer);
  }

  function openLoginModal() {
    if (!App.elements.loginModal) return;

    openModal(App.elements.loginModal);
    window.setTimeout(() => {
      App.elements.loginIdentity?.focus();
    }, 0);
  }

  function closeLoginModal() {
    if (!App.elements.loginModal) return;

    closeModal(App.elements.loginModal);
    if (App.elements.loginStatus) App.elements.loginStatus.textContent = "";
    if (App.elements.loginForm) App.elements.loginForm.reset();
  }

  function handleLoginSubmit(event) {
    event.preventDefault();

    const identity = App.elements.loginIdentity?.value.trim() || "";
    const password = App.elements.loginPassword?.value || "";
    const remember = Boolean(App.elements.rememberLogin?.checked);

    if (!identity || !password) {
      if (App.elements.loginStatus) {
        App.elements.loginStatus.textContent = "Vui lòng nhập đầy đủ email/số điện thoại và mật khẩu.";
      }
      return;
    }

    if (App.elements.loginStatus) {
      App.elements.loginStatus.textContent = remember
        ? "Đăng nhập thử thành công, tài khoản sẽ được ghi nhớ trên thiết bị này."
        : "Đăng nhập thử thành công.";
    }

    App.showToast("Đăng nhập thử thành công");
    closeLoginModal();
  }

  function openProductModal(productId) {
    const product = App.findProductById(productId);
    if (!product || !App.elements.productModalContent || !App.elements.productModal) return;

    const gallery = App.getProductGallery(product);
    const featuredImage = gallery[0];

    App.elements.productModalContent.innerHTML = `
      <div class="product-modal__gallery">
        <div class="product-modal__visual">
          <img
            src="${featuredImage}"
            alt="${product.name}"
            loading="lazy"
            decoding="async"
            referrerpolicy="no-referrer"
            id="productModalMainImage"
          />
        </div>
        <div class="product-modal__thumbs">
          ${gallery
            .map(
              (image, index) => `
                <button
                  type="button"
                  class="product-modal__thumb ${index === 0 ? "is-active" : ""}"
                  data-gallery-image="${image}"
                  aria-label="Xem ảnh ${index + 1} của ${product.name}"
                >
                  <img
                    src="${image}"
                    alt="${product.name} - ảnh ${index + 1}"
                    loading="lazy"
                    decoding="async"
                    referrerpolicy="no-referrer"
                  />
                </button>
              `
            )
            .join("")}
        </div>
      </div>
      <div class="product-modal__info">
        <span class="section-kicker">${product.label}</span>
        <h3>${product.name}</h3>
        <p>${product.summary}</p>
        <div class="product-modal__price">Liên Hệ</div>
        <div class="product-modal__meta">
          <span><strong>Thương hiệu:</strong> ${product.brand}</span>
          <span><strong>Tình trạng:</strong> ${product.stock}</span>
          <span><strong>Ưu đãi:</strong> Giảm ${product.discount}% so với giá niêm yết</span>
        </div>
        <ul class="support-list">
          ${product.specs.map((spec) => `<li>${spec}</li>`).join("")}
        </ul>
        <div class="hero-slide__actions">
          <button type="button" class="btn btn--light" data-close-modal="productModal">
            Đóng
          </button>
        </div>
      </div>
    `;

    openModal(App.elements.productModal);
  }

  function activateTab(tabName) {
    App.state.currentTab = tabName;
    App.elements.productTabs?.querySelectorAll(".tab-btn").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.tab === tabName);
    });
    App.renderTabProducts();
  }

  function activateNewProductsTab(tabName) {
    App.state.currentNewProductsTab = tabName;
    App.elements.newProductsTabs?.querySelectorAll(".tab-btn").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.tab === tabName);
    });
    App.renderNewProductsSection();
  }

  function activatePromoProductsTab(tabName) {
    App.state.currentPromoProductsTab = tabName;
    App.elements.promoProductsTabs?.querySelectorAll(".tab-btn").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.tab === tabName);
    });
    App.renderPromoProductsSection();
  }

  function setCategory(category) {
    App.state.currentCategory = category;
    App.elements.categoryButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.categoryFilter === category);
    });

    App.renderTabProducts();
    App.renderCategorySections();
    App.renderNewProductsSection();
    App.renderPromoProductsSection();
  }

  function setSlide(index) {
    const total = App.elements.heroSlides.length;
    if (!total) return;

    App.state.currentSlide = (index + total) % total;

    App.elements.heroSlides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === App.state.currentSlide);
    });

    [...(App.elements.heroDots?.querySelectorAll(".hero-dot") || [])].forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === App.state.currentSlide);
    });
  }

  function buildHeroDots() {
    if (!App.elements.heroSlides.length || !App.elements.heroDots) return;

    App.elements.heroDots.innerHTML = App.elements.heroSlides
      .map(
        (_, index) =>
          `<button type="button" class="hero-dot ${index === 0 ? "is-active" : ""}" data-slide="${index}" aria-label="Đi tới slide ${index + 1}"></button>`
      )
      .join("");
  }

  function startAutoSlide() {
    if (App.elements.heroSlides.length < 2) return;

    stopAutoSlide();
    sliderTimer = setInterval(() => {
      setSlide(App.state.currentSlide + 1);
    }, 4500);
  }

  function stopAutoSlide() {
    if (sliderTimer) {
      clearInterval(sliderTimer);
      sliderTimer = null;
    }
  }

  function handleSpecialNav(targetId, anchor) {
    if (!targetId) return false;

    const target = document.getElementById(targetId);
    if (!target) return false;

    const headerOffset = window.innerWidth <= 768 ? 96 : 128;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;

    document.querySelectorAll(".drawer__nav a").forEach((link) => {
      link.classList.toggle("is-active", link === anchor);
    });

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: "smooth",
    });

    return true;
  }

  function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    const initialTheme = savedTheme === "dark" || savedTheme === "light" ? savedTheme : App.getSystemTheme();

    App.applyTheme(initialTheme);

    const handleThemeToggle = () => {
      const nextTheme = App.elements.body.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", nextTheme);
      App.applyTheme(nextTheme);
    };

    App.elements.themeToggle?.addEventListener("click", handleThemeToggle);
    App.elements.themeToggleMobile?.addEventListener("click", handleThemeToggle);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener?.("change", (event) => {
      const userSavedTheme = localStorage.getItem("theme");
      if (userSavedTheme === "dark" || userSavedTheme === "light") return;
      App.applyTheme(event.matches ? "dark" : "light");
    });
  }

  function initEvents() {
    App.elements.productTabs?.addEventListener("click", (event) => {
      const button = event.target.closest(".tab-btn");
      if (!button) return;
      activateTab(button.dataset.tab);
    });

    App.elements.newProductsTabs?.addEventListener("click", (event) => {
      const button = event.target.closest(".tab-btn");
      if (!button) return;
      activateNewProductsTab(button.dataset.tab);
    });

    App.elements.promoProductsTabs?.addEventListener("click", (event) => {
      const button = event.target.closest(".tab-btn");
      if (!button) return;
      activatePromoProductsTab(button.dataset.tab);
    });

    App.elements.categoryButtons.forEach((button) => {
      button.addEventListener("click", () => setCategory(button.dataset.categoryFilter));
    });

    App.elements.openMobileMenu?.addEventListener("click", () => openDrawer(App.elements.mobileDrawer));
    App.elements.openLoginModal?.addEventListener("click", openLoginModal);

    App.elements.globalBackdrop?.addEventListener("click", () => {
      closeAllDrawers();
      closeLoginModal();
    });

    App.elements.loginForm?.addEventListener("submit", handleLoginSubmit);

    document.querySelectorAll('[data-close-modal="loginModal"]').forEach((button) => {
      button.addEventListener("click", closeLoginModal);
    });

    document.querySelectorAll("[data-close-drawer]").forEach((button) => {
      button.addEventListener("click", () => {
        const drawer = document.getElementById(button.dataset.closeDrawer);
        if (drawer) closeDrawer(drawer);
      });
    });

    document.querySelectorAll("[data-close-modal]").forEach((button) => {
      button.addEventListener("click", () => {
        const modal = document.getElementById(button.dataset.closeModal);
        if (modal) closeModal(modal);
      });
    });

    document.addEventListener("click", (event) => {
      const actionButton = event.target.closest("[data-action]");
      if (actionButton) {
        const { action, id } = actionButton.dataset;

        if (action === "quick-view") {
          openProductModal(id);
          return;
        }
      }

      const modalCloser = event.target.closest("[data-close-modal]");
      if (modalCloser) {
        const modal = document.getElementById(modalCloser.dataset.closeModal);
        if (modal) closeModal(modal);
      }

      const galleryThumb = event.target.closest("[data-gallery-image]");
      if (galleryThumb) {
        const mainImage = document.getElementById("productModalMainImage");
        const nextImage = galleryThumb.dataset.galleryImage;

        if (mainImage && nextImage) {
          mainImage.src = nextImage;
          document.querySelectorAll(".product-modal__thumb").forEach((thumb) => {
            thumb.classList.toggle("is-active", thumb === galleryThumb);
          });
        }

        return;
      }

      const anchor = event.target.closest('a[href^="#"]');
      if (anchor) {
        const targetId = anchor.getAttribute("href").slice(1);
        if (handleSpecialNav(targetId, anchor)) {
          event.preventDefault();
          closeDrawer(App.elements.mobileDrawer);
        }
      }
    });

    App.elements.prevSlide?.addEventListener("click", () => {
      setSlide(App.state.currentSlide - 1);
      startAutoSlide();
    });

    App.elements.nextSlide?.addEventListener("click", () => {
      setSlide(App.state.currentSlide + 1);
      startAutoSlide();
    });

    App.elements.heroDots?.addEventListener("click", (event) => {
      const dot = event.target.closest(".hero-dot");
      if (!dot) return;
      setSlide(Number(dot.dataset.slide));
      startAutoSlide();
    });

    App.elements.backToTop?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeAllDrawers();
        closeModal(App.elements.productModal);
        closeLoginModal();
      }
    });

    window.addEventListener("scroll", () => {
      if (!App.elements.backToTop) return;
      const show = window.scrollY > 480;
      App.elements.backToTop.style.opacity = show ? "1" : "0.65";
    });
  }

  function init() {
    App.refreshElements();
    initTheme();
    buildHeroDots();
    App.renderTabProducts();
    App.renderCategorySections();
    App.renderNewProductsSection();
    App.renderPromoProductsSection();
    App.initProductCarousels();
    initEvents();
    App.updateAllCarouselNavStates();
    startAutoSlide();
  }

  App.setOverlayVisibility = setOverlayVisibility;
  App.openModal = openModal;
  App.closeModal = closeModal;
  App.openDrawer = openDrawer;
  App.closeDrawer = closeDrawer;
  App.closeAllDrawers = closeAllDrawers;
  App.openLoginModal = openLoginModal;
  App.closeLoginModal = closeLoginModal;
  App.handleLoginSubmit = handleLoginSubmit;
  App.openProductModal = openProductModal;
  App.activateTab = activateTab;
  App.activateNewProductsTab = activateNewProductsTab;
  App.activatePromoProductsTab = activatePromoProductsTab;
  App.setCategory = setCategory;
  App.setSlide = setSlide;
  App.buildHeroDots = buildHeroDots;
  App.startAutoSlide = startAutoSlide;
  App.stopAutoSlide = stopAutoSlide;
  App.handleSpecialNav = handleSpecialNav;
  App.initTheme = initTheme;
  App.initEvents = initEvents;
  App.init = init;
})();
