(() => {
  const headerHTML = `
    

    <header class="header">
      <div class="container header__main">
        <button class="icon-btn mobile-only" id="openMobileMenu" aria-label="Mở menu">
          ☰
        </button>

        <a href="#" class="logo" aria-label="Đường Gia Phát">
          <img src="assets/logo.svg" alt="Đường Gia Phát" class="logo__image" />
          <div class="logo__text">
            <strong>Đường Gia Phát</strong>
            <span>PC - Laptop cấu hình cao</span>
          </div>
        </a>

        <button
          type="button"
          class="theme-toggle theme-toggle--mobile mobile-only"
          id="themeToggleMobile"
          aria-label="Chuyển giao diện sáng tối"
        >
          <span class="theme-toggle__icon" aria-hidden="true">🌙</span>
        </button>

        <div class="header__actions">
          <button
            type="button"
            class="login-btn"
            id="openLoginModal"
            aria-label="Mở popup đăng nhập"
          >
            Đăng nhập
          </button>
          <button type="button" class="theme-toggle" id="themeToggle" aria-label="Chuyển giao diện sáng tối">
            <span class="theme-toggle__icon" aria-hidden="true">🌙</span>
          </button>
        </div>
      </div>

      <nav class="navbar">
        <div class="container navbar__inner">
          <a href="#">Trang chủ</a>
          <a href="#featured">Sản phẩm bán chạy</a>
          <a href="#new-products">Sản phẩm mới</a>
          <a href="#promo-products">Khuyến mãi</a>
          <a href="#laptops">Máy tính xách tay</a>
          <a href="#desktop">Máy tính để bàn</a>
          <a href="#gaming">Laptop game & đồ họa</a>
        </div>
      </nav>
    </header>
  `;

  const footerHTML = `
    <footer class="footer">
      <div class="container footer__grid footer__grid--three">
        <div class="footer__col">
          <a class="logo logo--footer" aria-label="Đường Gia Phát">
            <img src="assets/logo.svg" alt="Đường Gia Phát" class="logo__image" />
            <div class="logo__text">
              <strong>Đường Gia Phát</strong>
              <span>Uy tín tạo nên thương hiệu</span>
            </div>
          </a>
          <p>
            Chuyên phân phối laptop, PC gaming, workstation, phụ kiện và linh kiện chính hãng với dịch vụ
            chăm sóc khách hàng tận tâm.
          </p>
        </div>

        <div class="footer__col">
          <h3>Thông tin liên hệ</h3>
          <a href="tel:0000">Hotline: </a>
          <a href="tel:000">Bán lẻ: </a>
          <a href="mailto:">Email: </a>
        </div>
      </div>
      <div class="container footer__bottom">
        <p>© 2026 Đường Gia Phát.</p>
      </div>
    </footer>
  `;

  const loginModalHTML = `
    <div class="modal" id="loginModal" aria-hidden="true">
      <div class="modal__overlay" data-close-modal="loginModal"></div>
      <div class="modal__content modal__content--auth" role="dialog" aria-modal="true" aria-labelledby="loginModalTitle">
        <button type="button" class="modal__close" data-close-modal="loginModal" aria-label="Đóng popup đăng nhập">✕</button>
        <div class="auth-panel">
          <div class="auth-panel__header">
            <span class="section-kicker">Đăng nhập</span>
            <h3 id="loginModalTitle">Chào mừng bạn quay lại</h3>
            <p>Đăng nhập để lưu sản phẩm yêu thích, xem lịch sử và nhận ưu đãi cá nhân hoá.</p>
          </div>
          <form class="auth-form" id="loginForm">
            <label>
              <span>Email hoặc số điện thoại</span>
              <input type="text" name="identity" id="loginIdentity" autocomplete="username" placeholder="Nhập email hoặc số điện thoại" />
            </label>
            <label>
              <span>Mật khẩu</span>
              <input type="password" name="password" id="loginPassword" autocomplete="current-password" placeholder="Nhập mật khẩu" />
            </label>
            <div class="checkbox-line">
              <input type="checkbox" id="rememberLogin" name="rememberLogin" />
              <label for="rememberLogin">Ghi nhớ đăng nhập</label>
            </div>
            <button type="submit" class="btn btn--primary btn--block">Đăng nhập</button>
            <button type="button" class="btn btn--light btn--block" data-close-modal="loginModal">Đóng</button>
            <p class="auth-link">
              Chưa có tài khoản? <a href="#" class="auth-link__action">Đăng ký tài khoản</a>
            </p>
            <p class="auth-status" id="loginStatus" aria-live="polite"></p>
          </form>
        </div>
      </div>
    </div>
  `;

  function renderHeader(target = document.getElementById("siteHeader")) {
    if (target) target.innerHTML = headerHTML;
  }

  function renderFooter(target = document.getElementById("siteFooter")) {
    if (target) target.innerHTML = footerHTML;
  }

  function renderLoginModal(target = document.getElementById("siteModal")) {
    if (target) target.innerHTML = loginModalHTML;
  }

  function renderLayout() {
    renderHeader();
    renderFooter();
    renderLoginModal();
  }

  window.DuongGiaStoreLayout = {
    renderHeader,
    renderFooter,
    renderLayout,
  };

  renderLayout();
})();
