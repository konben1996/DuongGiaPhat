(() => {
  const App = window.DuongGiaStoreApp;
  if (!App) return;

  let toastTimer = null;

  function renderGrid(target, list) {
    if (!target) return;

    if (!list.length) {
      target.innerHTML = `
        <div class="empty-state">
          Không tìm thấy sản phẩm phù hợp. Hãy thử đổi từ khóa hoặc danh mục khác.
        </div>
      `;
      return;
    }

    target.innerHTML = list.map(App.createProductCard).join("");
    App.initLazyImages();
  }

  function getCarouselStep(grid) {
    const card = grid.querySelector(".product-card");
    const cardWidth = card?.getBoundingClientRect().width || 280;
    const computedStyles = window.getComputedStyle(grid);
    const gapValue = computedStyles.columnGap || computedStyles.gap || "0px";
    const gap = Number.parseFloat(gapValue) || 0;

    return Math.max(Math.round(cardWidth + gap), 220);
  }

  function updateCarouselNavState(carousel) {
    const grid = carousel.querySelector(".product-grid--carousel");
    const prev = carousel.querySelector(".product-carousel__nav--prev");
    const next = carousel.querySelector(".product-carousel__nav--next");

    if (!grid || !prev || !next) return;

    const { scrollLeft, scrollWidth, clientWidth } = grid;
    const maxScrollLeft = Math.max(scrollWidth - clientWidth, 0);
    const canScroll = maxScrollLeft > 1;

    prev.disabled = !canScroll || scrollLeft <= 1;
    next.disabled = !canScroll || scrollLeft >= maxScrollLeft - 1;
  }

  function updateAllCarouselNavStates() {
    document.querySelectorAll(".product-carousel").forEach((carousel) => {
      updateCarouselNavState(carousel);
    });
  }

  function scrollCarousel(carousel, direction) {
    const grid = carousel.querySelector(".product-grid--carousel");
    if (!grid) return;

    grid.scrollBy({
      left: direction * getCarouselStep(grid),
      behavior: "smooth",
    });

    window.setTimeout(() => updateCarouselNavState(carousel), 180);
  }

  function resetCarouselScroll(grid) {
    grid.scrollTo({
      left: 0,
      behavior: "auto",
    });
  }

  function renderTabProducts() {
    renderGrid(App.elements.tabProductGrid, App.getTabProducts());

    if (App.elements.tabProductGrid) {
      resetCarouselScroll(App.elements.tabProductGrid);
    }

    window.setTimeout(updateAllCarouselNavStates, 0);
  }

  function renderCategorySections() {
    const filteredProducts = App.getFilteredProducts();

    const laptopProducts = filteredProducts.filter((product) =>
      ["gaming-laptop", "workstation", "office-laptop"].includes(product.category)
    );
    const desktopProducts = filteredProducts.filter((product) => product.category === "gaming-pc");
    const gamingProducts = filteredProducts.filter((product) =>
      ["gaming-laptop", "workstation", "gaming-pc"].includes(product.category)
    );

    renderGrid(App.elements.laptopGrid, laptopProducts.slice(0, 10));
    renderGrid(App.elements.desktopGrid, desktopProducts.slice(0, 10));
    renderGrid(App.elements.gamingGrid, gamingProducts.slice(0, 10));
  }

  function renderNewProductsSection() {
    const newProductsGrid = document.getElementById("newProductsGrid");
    if (!newProductsGrid) return;

    renderGrid(newProductsGrid, App.getProductsByTag(App.state.currentNewProductsTab).slice(0, 12));
  }

  function renderPromoProductsSection() {
    const promoProductsGrid = document.getElementById("promoProductsGrid");
    if (!promoProductsGrid) return;

    renderGrid(promoProductsGrid, App.getProductsByTag(App.state.currentPromoProductsTab).slice(0, 12));
  }

  function showToast(message) {
    if (!App.elements.toast) return;

    App.elements.toast.setAttribute("role", "status");
    App.elements.toast.setAttribute("aria-live", "polite");
    App.elements.toast.textContent = message;
    App.elements.toast.classList.add("is-visible");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      App.elements.toast.classList.remove("is-visible");
    }, 2400);
  }

  function activateTab(tabName) {
    App.state.currentTab = tabName;
    App.elements.productTabs?.querySelectorAll(".tab-btn").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.tab === tabName);
    });
    renderTabProducts();
  }

  function activateNewProductsTab(tabName) {
    App.state.currentNewProductsTab = tabName;
    App.elements.newProductsTabs?.querySelectorAll(".tab-btn").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.tab === tabName);
    });
    renderNewProductsSection();
  }

  function activatePromoProductsTab(tabName) {
    App.state.currentPromoProductsTab = tabName;
    App.elements.promoProductsTabs?.querySelectorAll(".tab-btn").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.tab === tabName);
    });
    renderPromoProductsSection();
  }

  function setCategory(category) {
    App.state.currentCategory = category;
    App.elements.categoryButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.categoryFilter === category);
    });

    renderTabProducts();
    renderCategorySections();
    renderNewProductsSection();
    renderPromoProductsSection();
  }

  function initProductCarousels() {
    document.querySelectorAll(".product-carousel").forEach((carousel) => {
      const grid = carousel.querySelector(".product-grid--carousel");
      const prev = carousel.querySelector(".product-carousel__nav--prev");
      const next = carousel.querySelector(".product-carousel__nav--next");

      if (!grid || !prev || !next) return;

      prev.addEventListener("click", () => scrollCarousel(carousel, -1));
      next.addEventListener("click", () => scrollCarousel(carousel, 1));
      grid.addEventListener("scroll", () => {
        window.requestAnimationFrame(() => updateCarouselNavState(carousel));
      });

      updateCarouselNavState(carousel);
    });
  }

  App.renderGrid = renderGrid;
  App.getCarouselStep = getCarouselStep;
  App.updateCarouselNavState = updateCarouselNavState;
  App.updateAllCarouselNavStates = updateAllCarouselNavStates;
  App.scrollCarousel = scrollCarousel;
  App.resetCarouselScroll = resetCarouselScroll;
  App.renderTabProducts = renderTabProducts;
  App.renderCategorySections = renderCategorySections;
  App.renderNewProductsSection = renderNewProductsSection;
  App.renderPromoProductsSection = renderPromoProductsSection;
  App.showToast = showToast;
  App.activateTab = activateTab;
  App.activateNewProductsTab = activateNewProductsTab;
  App.activatePromoProductsTab = activatePromoProductsTab;
  App.setCategory = setCategory;
  App.initProductCarousels = initProductCarousels;
})();
