// ==========================================================================
// ONLINE SHOES MARKETING - JAVASCRIPT SYSTEM
// Safe, modular, robust logic for navigation, search, modal & interactions
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initShopFeatures();
  initContactForm();
  initProductModals();
});

// --------------------------------------------------------------------------
// 1. Mobile Navigation & Toggle (100% Reliable across touch & click)
// --------------------------------------------------------------------------
function initNavbar() {
  const toggleBtn = document.querySelector('.navbar-toggle');
  const navMenu = document.getElementById('navMenu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const isOpen = navMenu.classList.contains('active');
      if (isOpen) {
        navMenu.classList.remove('active');
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      } else {
        navMenu.classList.add('active');
        toggleBtn.classList.add('active');
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
    });

    // Close mobile menu when clicking any nav link
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        navMenu.classList.remove('active');
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close when window resized beyond tablet
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

// Global fallback toggle
function toggleMenu() {
  const toggleBtn = document.querySelector('.navbar-toggle');
  const navMenu = document.getElementById('navMenu');
  if (navMenu) {
    const isOpen = navMenu.classList.contains('active');
    if (isOpen) {
      navMenu.classList.remove('active');
      if (toggleBtn) {
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    } else {
      navMenu.classList.add('active');
      if (toggleBtn) {
        toggleBtn.classList.add('active');
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
    }
  }
}

// --------------------------------------------------------------------------
// 2. Shop Page Real-Time Search & Category Filters
// --------------------------------------------------------------------------
function initShopFeatures() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const filterPills = document.querySelectorAll('.filter-pill');
  const productCards = document.querySelectorAll('.our-products .product-card');
  const resultsCount = document.getElementById('resultsCount');

  if (!productCards.length) return; // Not on shop page

  let currentCategory = 'all';
  let currentSearchQuery = '';

  function filterProducts() {
    let visibleCount = 0;

    productCards.forEach((card) => {
      const title = (card.querySelector('.product-title')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('.product-desc')?.textContent || '').toLowerCase();
      const category = (card.getAttribute('data-category') || card.querySelector('.product-category')?.textContent || '').toLowerCase();

      const matchesSearch = !currentSearchQuery || title.includes(currentSearchQuery) || desc.includes(currentSearchQuery) || category.includes(currentSearchQuery);
      const matchesCategory = currentCategory === 'all' || category.includes(currentCategory);

      if (matchesSearch && matchesCategory) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (resultsCount) {
      resultsCount.textContent = `Showing ${visibleCount} product${visibleCount === 1 ? '' : 's'}`;
    }

    const productsContainer = document.querySelector('.our-products');
    let noResultsEl = document.getElementById('noResultsMessage');
    if (visibleCount === 0) {
      if (!noResultsEl && productsContainer) {
        noResultsEl = document.createElement('div');
        noResultsEl.id = 'noResultsMessage';
        noResultsEl.className = 'no-results';
        noResultsEl.innerHTML = `
          <i class="fa-solid fa-shoe-prints"></i>
          <h3>No matching shoes found</h3>
          <p>Try clearing your search query or choosing a different category.</p>
        `;
        productsContainer.appendChild(noResultsEl);
      }
    } else if (noResultsEl) {
      noResultsEl.remove();
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.trim().toLowerCase();
      filterProducts();
    });

    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        filterProducts();
      }
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (searchInput) {
        currentSearchQuery = searchInput.value.trim().toLowerCase();
      }
      filterProducts();
    });
  }

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = (pill.getAttribute('data-filter') || 'all').toLowerCase();
      filterProducts();
    });
  });
}

// --------------------------------------------------------------------------
// 3. Product Quick View Modal & Cart Action
// --------------------------------------------------------------------------
function initProductModals() {
  const modalOverlay = document.getElementById('productModal');
  const modalClose = document.getElementById('modalCloseBtn');
  const modalImg = document.getElementById('modalProductImg');
  const modalCategory = document.getElementById('modalProductCategory');
  const modalTitle = document.getElementById('modalProductTitle');
  const modalPrice = document.getElementById('modalProductPrice');
  const modalDesc = document.getElementById('modalProductDesc');
  const addToCartBtn = document.getElementById('modalAddToCartBtn');

  if (!modalOverlay) return;

  function openModal(data) {
    if (modalImg) modalImg.src = data.imgSrc || 'assets/images/7.jpg';
    if (modalImg) modalImg.alt = data.title || 'Shoe Image';
    if (modalCategory) modalCategory.textContent = data.category || 'Footwear';
    if (modalTitle) modalTitle.textContent = data.title || 'Exquisite Shoe';
    if (modalPrice) modalPrice.textContent = data.price || '$89.99';
    if (modalDesc) modalDesc.textContent = data.desc || 'Premium handcrafted footwear engineered with superior comfort and breathable materials for everyday elegance.';

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.btn-card-action, .product-card .product-title, .product-card-img-wrap').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const card = trigger.closest('.product-card');
      if (!card) return;

      const data = {
        imgSrc: card.querySelector('img')?.src,
        category: card.querySelector('.product-category')?.textContent,
        title: card.querySelector('.product-title')?.textContent,
        price: card.querySelector('.product-price')?.childNodes[0]?.textContent?.trim(),
        desc: card.querySelector('.product-desc')?.textContent
      };

      openModal(data);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  const sizeBtns = modalOverlay.querySelectorAll('.size-btn');
  sizeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const activeSize = modalOverlay.querySelector('.size-btn.active')?.textContent || '9';
      const shoeName = modalTitle?.textContent || 'Selected Item';
      showToast(`Added "${shoeName}" (Size US ${activeSize}) to cart!`);
      closeModal();
    });
  }
}

// --------------------------------------------------------------------------
// 4. Contact Form Submission
// --------------------------------------------------------------------------
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const textarea = document.getElementById('contactMessage');
  const charCounter = document.getElementById('charCounter');

  if (textarea && charCounter) {
    textarea.addEventListener('input', () => {
      charCounter.textContent = `${textarea.value.length}/500 characters`;
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = contactForm.querySelector('[name="name"]')?.value || 'Valued Customer';
      showToast(`Thank you, ${name}! Your inquiry has been sent successfully.`);
      contactForm.reset();
      if (charCounter) charCounter.textContent = '0/500 characters';
    });
  }
}

// --------------------------------------------------------------------------
// 5. Lightweight Toast Notification
// --------------------------------------------------------------------------
function showToast(message) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #22c55e;"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
