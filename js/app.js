/* ==========================================================================
   ROSÉLIA ATELIER — INTERACTIVE SPA STATE, POS SYNC & UI CONTROLLER
   ========================================================================== */

(function () {
  const DATA = window.ROSELIA_DATA;

  /* Application State */
  const state = {
    currentView: "home", // 'home' | 'catalog' | 'pdp'
    homeTab: "all", // 'all' | 'trending' | 'new' | 'low_stock'
    catalogFilters: {
      category: "All",
      brands: [],
      priceRange: "all", // 'all' | 'under30' | '30to100' | 'over100'
      concern: "All",
      inStoreOnly: false,
      searchQuery: "",
      sortBy: "featured",
      gridCols: 3,
      visibleCount: 9
    },
    activePdp: {
      productId: "prod-02",
      selectedVariantIndex: 1,
      selectedImageIndex: 0,
      quantity: 1,
      fulfillment: "pickup" // 'pickup' | 'ship'
    },
    cart: [
      {
        productId: "prod-01",
        variantIndex: 0,
        quantity: 1,
        fulfillment: "pickup"
      },
      {
        productId: "prod-03",
        variantIndex: 2,
        quantity: 1,
        fulfillment: "pickup"
      }
    ],
    wishlist: ["prod-02"],
    notifyTargetProductId: null,
    activeLookId: null,
    activeStrategyTab: "platforms", // 'platforms' | 'middleware' | 'preauth' | 'simulator'
    posSyncCounter: 8942,
    lastSyncLabel: "2 mins ago"
  };

  /* Helper: Format Currency */
  function fmtPrice(num) {
    return "$" + Number(num).toFixed(2);
  }

  /* Helper: Get Product by ID */
  function getProduct(id) {
    return DATA.products.find((p) => p.id === id);
  }

  /* Helper: Render Exact Stock Badge HTML */
  function renderStockBadge(product) {
    if (product.stockStatus === "in_stock") {
      return `
        <div class="stock-badge in-stock" title="Verified via Toast POS Shelf Sync">
          <span class="status-dot green"></span>
          <span>🟢 In Stock Online &amp; In-Store (Synced ${state.lastSyncLabel})</span>
        </div>
      `;
    }
    if (product.stockStatus === "low_stock") {
      const count = product.stockCount || 2;
      return `
        <div class="stock-badge low-stock" title="High demand item on physical store shelves">
          <span class="status-dot amber"></span>
          <span>🟠 Low Stock: Only ${count} left in store!</span>
        </div>
      `;
    }
    return `
      <div class="stock-badge out-of-stock" title="Currently sold out on store shelves">
        <span class="status-dot red"></span>
        <span>🔴 Temporarily Out of Stock</span>
      </div>
    `;
  }

  /* Helper: Render Product Card HTML */
  function renderProductCard(product, index = 0) {
    const isOut = product.stockStatus === "out_of_stock";
    const isWishlisted = state.wishlist.includes(product.id);
    const defaultVariant = product.variants[0];

    const swatchesHtml = product.variants
      .slice(0, 4)
      .map((v) => {
        if (v.hex) {
          return `<span class="swatch-dot" style="background:${v.hex}" title="${v.label}"></span>`;
        }
        return `<span class="swatch-pill-mini">${v.label.split("•")[0].trim()}</span>`;
      })
      .join("");

    const actionBtnHtml = isOut
      ? `<button class="quick-add-btn notify-btn" data-action="open-notify" data-id="${product.id}">
           <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
           Notify Me When Back
         </button>`
      : `<button class="quick-add-btn" data-action="quick-add" data-id="${product.id}">
           <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
           Quick Add — ${fmtPrice(defaultVariant.price)}
         </button>`;

    return `
      <article class="product-card card-enter" style="--stagger-i: ${index};" data-product-id="${product.id}">
        <div class="product-card-media" data-action="open-pdp" data-id="${product.id}">
          <img class="product-img-primary" src="${product.image}" alt="${product.name}" loading="lazy" onerror="if(this.src!=='${product.hoverImage}'){this.src='${product.hoverImage}';}" />
          <img class="product-img-secondary" src="${product.hoverImage}" alt="${product.name} alternate view" loading="lazy" onerror="if(this.src!=='${product.image}'){this.src='${product.image}';}" />
          <div class="product-card-badges">
            <span class="editorial-tag ${product.stockStatus === "low_stock" || product.newArrival ? "tag-pink" : ""}">${product.badge}</span>
            <button class="wishlist-card-btn ${isWishlisted ? "wishlisted" : ""}" data-action="toggle-wishlist" data-id="${product.id}" aria-label="Save to Wishlist">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="${isWishlisted ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>
          <div class="quick-add-drawer">
            ${actionBtnHtml}
          </div>
        </div>

        <div class="product-card-body">
          <div class="product-brand-row">
            <span>${product.brand}</span>
            <span class="product-rating">★ ${product.rating.toFixed(1)} <span>(${product.reviews})</span></span>
          </div>

          <h3 class="product-card-title" data-action="open-pdp" data-id="${product.id}">${product.name}</h3>

          <div class="product-swatches-preview">
            ${swatchesHtml}
          </div>

          <div style="margin: 0.25rem 0;">
            ${renderStockBadge(product)}
          </div>

          <div class="product-card-footer">
            <div>
              <span class="product-price">${fmtPrice(product.price)}</span>
              ${product.compareAtPrice ? `<span class="product-price-compare">${fmtPrice(product.compareAtPrice)}</span>` : ""}
            </div>
            <span class="product-aisle-tag">${product.aisle}</span>
          </div>
        </div>
      </article>
    `;
  }

  /* ==========================================================================
     DEPARTMENT METADATA & SEAMLESS DEPARTMENT TRANSITIONS
     ========================================================================== */
  const DEPARTMENT_META = {
    "All": {
      title: "All Collections",
      subtitle: "2,480 curated beauty formulas, virgin human hair units, and pro styling tools.",
      count: "2,480"
    },
    "Wigs & Extensions": {
      title: "Wigs & Extensions",
      subtitle: "Raw single-donor bundles, 13x6 HD Swiss lace units, and glueless melt essentials.",
      count: "420"
    },
    "Hair Care": {
      title: "Hair Care",
      subtitle: "French rosehip & honey elixirs, bond-repair masques, and coil sculpting care.",
      count: "680"
    },
    "Skincare": {
      title: "Skincare",
      subtitle: "Multi-peptide barrier serums, rosewater dew mists, and whipped cloud creams.",
      count: "520"
    },
    "Makeup": {
      title: "Makeup",
      subtitle: "Peptide plumping lip oils, whipped watercolor blushes, and soft-focus tints.",
      count: "490"
    },
    "Tools & Accessories": {
      title: "Tools & Accessories",
      subtitle: "Champagne titanium silk-press irons, 22-momme pure silk bonnets, and melt bands.",
      count: "370"
    }
  };

  /* Helper: Synchronize Top Navigation Header Category Active State */
  function updateHeaderCategoryActive() {
    const isCatalog = state.currentView === "catalog";
    const currentCat = state.catalogFilters.category;
    document.querySelectorAll("#primary-nav-list .nav-link[data-category]").forEach((btn) => {
      const cat = btn.dataset.category;
      btn.classList.toggle("active-department", isCatalog && currentCat === cat);
    });
  }

  /* Unified Seamless Department Switcher with Fluid Two-Phase Text & Stagger Transitions */
  function switchCategoryDepartment(targetCat, options = {}) {
    closeAllDrawers();
    const prevCat = state.catalogFilters.category;
    state.catalogFilters.category = targetCat;
    if (options.concern) {
      state.catalogFilters.concern = options.concern;
    } else if (prevCat !== targetCat) {
      state.catalogFilters.concern = "All";
    }

    if (state.currentView !== "catalog") {
      switchView("catalog", { category: targetCat, ...options });
      updateHeaderCategoryActive();
      return;
    }

    // Seamless in-place transition when already on Catalog view
    updateHeaderCategoryActive();
    const grid = document.getElementById("catalog-product-grid");
    const bannerText = document.getElementById("catalog-banner-text-wrap");

    // Phase 1: Soft fade-out of current title & subtitle
    if (grid) grid.classList.add("grid-transitioning");
    if (bannerText) {
      bannerText.classList.remove("text-fade-in");
      bannerText.classList.add("text-fade-out");
    }

    // Phase 2: Update content while invisible, then fade in with gentle upward glide
    setTimeout(() => {
      renderCatalogView();
      if (grid) grid.classList.remove("grid-transitioning");
      if (bannerText) {
        bannerText.classList.remove("text-fade-out");
        bannerText.classList.add("text-fade-in");
      }

      // Smooth scroll only if user scrolled past the ribbon bar
      if (window.scrollY > 240) {
        const topBar = document.querySelector(".catalog-dept-ribbon-bar");
        if (topBar) {
          topBar.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }
    }, 180);
  }

  /* ==========================================================================
     SPA VIEW NAVIGATION WITH FLUID FADE & SLIDE TRANSITIONS
     ========================================================================== */
  function switchView(targetView, options = {}) {
    const views = {
      home: document.getElementById("view-home"),
      catalog: document.getElementById("view-catalog"),
      pdp: document.getElementById("view-pdp")
    };

    // Update nav active states
    document.querySelectorAll(".nav-link[data-nav-view]").forEach((link) => {
      link.classList.toggle("active", link.dataset.navView === targetView);
    });

    const currentEl = views[state.currentView];
    const nextEl = views[targetView];

    if (options.category) {
      state.catalogFilters.category = options.category;
    }
    if (options.inStoreOnly !== undefined) {
      state.catalogFilters.inStoreOnly = options.inStoreOnly;
    }
    if (options.productId) {
      state.activePdp.productId = options.productId;
      state.activePdp.selectedVariantIndex = 0;
      state.activePdp.selectedImageIndex = 0;
      state.activePdp.quantity = 1;
    }

    // Re-render target view data before showing
    if (targetView === "home") renderHomeSections();
    if (targetView === "catalog") renderCatalogView();
    if (targetView === "pdp") renderPdpView();
    updateHeaderCategoryActive();

    if (state.currentView === targetView) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    currentEl.classList.remove("view-active");
    setTimeout(() => {
      currentEl.classList.remove("view-visible");
      nextEl.classList.add("view-visible");
      // Trigger reflow for cubic-bezier(0.22, 1, 0.36, 1) entrance
      void nextEl.offsetWidth;
      nextEl.classList.add("view-active");
      state.currentView = targetView;
      updateHeaderCategoryActive();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 220);
  }

  /* ==========================================================================
     RENDER MEGA-MENU & HEADER
     ========================================================================== */
  function renderMegaNavigation() {
    const navContainer = document.getElementById("primary-nav-list");
    if (!navContainer) return;

    const itemsHtml = DATA.megaCategories
      .map(
        (cat) => `
      <div class="nav-item">
        <button class="nav-link" data-action="go-category" data-category="${cat.id}">
          ${cat.label}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="mega-menu">
          <div>
            <div class="mega-col-title">Shop ${cat.label}</div>
            <ul class="mega-list">
              ${cat.subcategories
                .map(
                  (sub) => `
                <li>
                  <button class="mega-sublink" data-action="go-category" data-category="${cat.id}">
                    <span>${sub}</span>
                  </button>
                </li>
              `
                )
                .join("")}
            </ul>
          </div>
          <div>
            <div class="mega-col-title">By Concern &amp; Texture</div>
            <ul class="mega-list">
              ${cat.concerns
                .map(
                  (c) => `
                <li>
                  <button class="mega-sublink" data-action="go-concern" data-category="${cat.id}" data-concern="${c}">
                    <span>${c}</span>
                  </button>
                </li>
              `
                )
                .join("")}
            </ul>
            <div style="margin-top:1.1rem; padding-top:0.85rem; border-top:1px solid var(--border-subtle);">
              <button class="btn btn-secondary" style="width:100%; padding:0.5rem 0.9rem; font-size:0.78rem;" data-action="go-category" data-category="${cat.id}">
                View All ${cat.label}
              </button>
            </div>
          </div>
          <div class="mega-featured-card">
            <div>
              <img class="mega-featured-img" src="${cat.featured.image}" alt="${cat.featured.title}" />
              <span class="mega-featured-tag">${cat.featured.tag}</span>
              <div class="mega-featured-title">${cat.featured.title}</div>
            </div>
            <button class="btn btn-primary" style="width:100%; padding:0.55rem 1rem; font-size:0.78rem;" data-action="go-category" data-category="${cat.id}">
              ${cat.featured.cta}
            </button>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    navContainer.innerHTML =
      itemsHtml +
      `
      <div class="nav-item">
        <button class="nav-link" data-action="go-category" data-category="All">
          Full Catalog (2,480+ SKUs)
        </button>
      </div>
    `;
  }

  /* ==========================================================================
     RENDER HOMEPAGE SECTIONS
     ========================================================================== */
  function renderHomeSections() {
    // 1. Category Carousel (Instagram Story Arch Cards)
    const storiesTrack = document.getElementById("home-category-stories");
    if (storiesTrack) {
      storiesTrack.innerHTML = DATA.categoryStories
        .map(
          (story) => `
        <div class="category-story-card" data-action="story-filter" data-category="${story.id}">
          <div class="category-story-ring">
            <div class="category-story-img-wrap">
              <img src="${story.image}" alt="${story.title}" loading="lazy" />
            </div>
          </div>
          <div class="category-story-title">${story.title}</div>
          <div class="category-story-count">${story.subtitle}</div>
        </div>
      `
        )
        .join("");
    }

    // 2. Bestsellers & Live POS Grid
    renderHomeBestsellersGrid();

    // 3. Instagram & Brand Community Grid ("Shop the Look")
    const instaGrid = document.getElementById("home-insta-grid");
    if (instaGrid) {
      instaGrid.innerHTML = DATA.communityLooks
        .map(
          (look) => `
        <div class="insta-card" data-action="open-look-modal" data-look-id="${look.id}">
          <img src="${look.image}" alt="${look.caption}" loading="lazy" />
          <div class="insta-overlay">
            <span class="insta-handle">${look.handle}</span>
            <p class="insta-caption">${look.caption}</p>
            <span class="insta-shop-pill">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
              Shop the Look (${look.productIds.length} Items)
            </span>
          </div>
        </div>
      `
        )
        .join("");
    }
  }

  function renderHomeBestsellersGrid() {
    const gridEl = document.getElementById("home-bestsellers-grid");
    if (!gridEl) return;

    let filtered = [...DATA.products];
    if (state.homeTab === "trending") {
      filtered = filtered.filter((p) => p.trendingInStore);
    } else if (state.homeTab === "new") {
      filtered = filtered.filter((p) => p.newArrival);
    } else if (state.homeTab === "low_stock") {
      filtered = filtered.filter((p) => p.stockStatus === "low_stock" || p.stockStatus === "out_of_stock");
    }

    gridEl.innerHTML = filtered.slice(0, 8).map((p, idx) => renderProductCard(p, idx)).join("");

    document.querySelectorAll("[data-home-tab]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.homeTab === state.homeTab);
    });
  }

  /* ==========================================================================
     RENDER SCALABLE CATEGORY / CATALOG VIEW
     ========================================================================== */
  function getFilteredCatalogProducts() {
    const f = state.catalogFilters;
    let list = [...DATA.products];

    if (f.category && f.category !== "All") {
      list = list.filter((p) => p.category === f.category);
    }
    if (f.brands.length > 0) {
      list = list.filter((p) => f.brands.includes(p.brand));
    }
    if (f.concern && f.concern !== "All") {
      list = list.filter((p) => p.concern === f.concern);
    }
    if (f.inStoreOnly) {
      list = list.filter((p) => p.stockStatus === "in_stock" || p.stockStatus === "low_stock");
    }
    if (f.priceRange === "under30") {
      list = list.filter((p) => p.price < 30);
    } else if (f.priceRange === "30to100") {
      list = list.filter((p) => p.price >= 30 && p.price <= 100);
    } else if (f.priceRange === "over100") {
      list = list.filter((p) => p.price > 100);
    }
    if (f.searchQuery.trim() !== "") {
      const q = f.searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (f.sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (f.sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (f.sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    } else if (f.sortBy === "instock-first") {
      const rank = { in_stock: 1, low_stock: 2, out_of_stock: 3 };
      list.sort((a, b) => rank[a.stockStatus] - rank[b.stockStatus]);
    }

    return list;
  }

  function renderCatalogView() {
    const f = state.catalogFilters;
    const filtered = getFilteredCatalogProducts();
    const deptInfo = DEPARTMENT_META[f.category] || DEPARTMENT_META["All"];

    // Update Banner Department Text (Clean, Elevated & Uncluttered)
    const titleEl = document.getElementById("catalog-heading-title");
    const subEl = document.getElementById("catalog-heading-subtitle");
    const breadcrumbDeptEl = document.getElementById("catalog-breadcrumb-dept");

    if (titleEl) titleEl.textContent = deptInfo.title;
    if (subEl) subEl.textContent = deptInfo.subtitle;
    if (breadcrumbDeptEl) breadcrumbDeptEl.textContent = f.category === "All" ? "All Collections" : f.category;

    // Render Top Category Department Ribbon (Top Navigation for Categories)
    const ribbonEl = document.getElementById("catalog-dept-ribbon");
    if (ribbonEl) {
      const depts = ["All", "Wigs & Extensions", "Hair Care", "Skincare", "Makeup", "Tools & Accessories"];
      ribbonEl.innerHTML = depts
        .map((d) => {
          const count = d === "All" ? DATA.products.length : DATA.products.filter((p) => p.category === d).length;
          const isActive = f.category === d;
          return `
            <button class="dept-pill-btn ${isActive ? "active" : ""}" data-action="go-category" data-category="${d}">
              <span>${d === "All" ? "All Collections" : d}</span>
              <span class="dept-badge">${count}</span>
            </button>
          `;
        })
        .join("");
    }

    // Update In-Store Switch UI
    const switchEl = document.getElementById("catalog-instore-switch");
    if (switchEl) {
      switchEl.classList.toggle("active", f.inStoreOnly);
    }

    // Render Category Radio Filters with active row highlight
    const categories = ["All", "Hair Care", "Wigs & Extensions", "Skincare", "Makeup", "Tools & Accessories"];
    const catListEl = document.getElementById("filter-category-list");
    if (catListEl) {
      catListEl.innerHTML = categories
        .map((c) => {
          const count =
            c === "All" ? DATA.products.length : DATA.products.filter((p) => p.category === c).length;
          const isActive = f.category === c;
          return `
            <label class="filter-checkbox-label ${isActive ? "active-dept-row" : ""}">
              <span class="filter-checkbox-left">
                <input type="radio" name="cat-filter" value="${c}" ${isActive ? "checked" : ""} data-action="filter-cat" />
                <span>${c}</span>
              </span>
              <span class="filter-sku-count">${count}</span>
            </label>
          `;
        })
        .join("");
    }

    // Render Brand Checkboxes
    const allBrands = [...new Set(DATA.products.map((p) => p.brand))];
    const brandListEl = document.getElementById("filter-brand-list");
    if (brandListEl) {
      brandListEl.innerHTML = allBrands
        .map((b) => {
          const count = DATA.products.filter((p) => p.brand === b).length;
          return `
            <label class="filter-checkbox-label">
              <span class="filter-checkbox-left">
                <input type="checkbox" value="${b}" ${f.brands.includes(b) ? "checked" : ""} data-action="filter-brand" />
                <span>${b}</span>
              </span>
              <span class="filter-sku-count">${count}</span>
            </label>
          `;
        })
        .join("");
    }

    // Render Concern Radio Filters
    const allConcerns = ["All", ...new Set(DATA.products.map((p) => p.concern))];
    const concernListEl = document.getElementById("filter-concern-list");
    if (concernListEl) {
      concernListEl.innerHTML = allConcerns
        .map(
          (c) => `
          <label class="filter-checkbox-label">
            <span class="filter-checkbox-left">
              <input type="radio" name="concern-filter" value="${c}" ${f.concern === c ? "checked" : ""} data-action="filter-concern" />
              <span>${c}</span>
            </span>
          </label>
        `
        )
        .join("");
    }

    // Render Active Filter Chips
    const activeChipsEl = document.getElementById("catalog-active-chips");
    if (activeChipsEl) {
      const chips = [];
      if (f.category !== "All") chips.push({ label: `Category: ${f.category}`, clear: "category" });
      if (f.concern !== "All") chips.push({ label: `Concern: ${f.concern}`, clear: "concern" });
      if (f.inStoreOnly) chips.push({ label: `In-Store Pickup Available`, clear: "inStoreOnly" });
      if (f.priceRange !== "all") chips.push({ label: `Price Filter Active`, clear: "priceRange" });
      if (f.searchQuery) chips.push({ label: `Search: "${f.searchQuery}"`, clear: "searchQuery" });
      f.brands.forEach((b) => chips.push({ label: b, clear: "brand", val: b }));

      activeChipsEl.innerHTML =
        chips.length === 0
          ? ""
          : chips
              .map(
                (chip) => `
            <span class="active-filter-chip">
              ${chip.label}
              <button data-action="clear-chip" data-clear="${chip.clear}" data-val="${chip.val || ""}">✕</button>
            </span>
          `
              )
              .join("") +
            `<button class="btn btn-secondary" style="padding:0.25rem 0.75rem; font-size:0.75rem;" data-action="reset-all-filters">Clear All</button>`;
    }

    // Results Count & Grid
    const countLabel = document.getElementById("catalog-results-count");
    if (countLabel) {
      countLabel.innerHTML = `Showing <strong>${Math.min(filtered.length, f.visibleCount)}</strong> of <strong>${filtered.length}</strong> curated SKUs (Connected to Toast POS Catalog: 2,480+ Store Items)`;
    }

    const catalogGrid = document.getElementById("catalog-product-grid");
    document.querySelectorAll('[data-action="set-grid-cols"]').forEach((btn) => {
      btn.classList.toggle("active", Number(btn.dataset.cols) === f.gridCols);
    });
    if (catalogGrid) {
      catalogGrid.classList.toggle("cols-3", f.gridCols === 3);
      if (filtered.length === 0) {
        catalogGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align:center; padding: 3.5rem 1.5rem; background: var(--bg-white); border-radius: var(--radius-md); border: 1px solid var(--border-pink);">
            <h3 class="section-title" style="font-size: 1.75rem; margin-bottom: 0.5rem;">No Matching Beauty SKUs Found</h3>
            <p style="color: var(--text-mauve); margin-bottom: 1.25rem;">Try clearing one of your filters or switching off the In-Store Pickup filter to view out-of-stock items.</p>
            <button class="btn btn-primary" data-action="reset-all-filters">Reset All Filters</button>
          </div>
        `;
      } else {
        catalogGrid.innerHTML = filtered.slice(0, f.visibleCount).map((p, idx) => renderProductCard(p, idx)).join("");
      }
    }

    // Pagination / Load More
    const paginationEl = document.getElementById("catalog-pagination-box");
    if (paginationEl) {
      const shown = Math.min(filtered.length, f.visibleCount);
      const pct = filtered.length > 0 ? Math.round((shown / filtered.length) * 100) : 100;
      paginationEl.innerHTML = `
        <div style="font-size: 0.85rem; color: var(--text-mauve);">
          Displaying <strong>${shown}</strong> of <strong>${filtered.length}</strong> filtered products
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width: ${pct}%;"></div>
        </div>
        ${
          shown < filtered.length
            ? `<button class="btn btn-secondary" data-action="load-more-catalog">Load More SKUs (${filtered.length - shown} Remaining)</button>`
            : `<span style="font-size:0.78rem; color: var(--text-mauve);">All matching SKUs loaded • Ready for 2,400+ SKU pagination</span>`
        }
      `;
    }
  }

  /* ==========================================================================
     RENDER PRODUCT DETAIL PAGE (PDP)
     ========================================================================== */
  function renderPdpView() {
    const product = getProduct(state.activePdp.productId) || DATA.products[0];
    const variant = product.variants[state.activePdp.selectedVariantIndex] || product.variants[0];
    const isOut = product.stockStatus === "out_of_stock";
    const fullSku = `${product.sku}-${variant.skuSuffix}`;

    const container = document.getElementById("pdp-dynamic-container");
    if (!container) return;

    // Cross-sell recommendations (3 products not equal to current)
    const crossSell = DATA.products.filter((p) => p.id !== product.id).slice(0, 4);

    container.innerHTML = `
      <div class="breadcrumb-bar">
        <button data-action="nav-home">Home</button>
        <span>/</span>
        <button data-action="go-category" data-category="${product.category}">${product.category}</button>
        <span>/</span>
        <span style="color: var(--text-espresso); font-weight: 600;">${product.name}</span>
      </div>

      <div class="pdp-main-grid">
        <!-- Left: Interactive Gallery -->
        <div class="pdp-gallery">
          <div class="pdp-thumbs">
            ${product.gallery
              .map(
                (imgUrl, idx) => `
              <button class="pdp-thumb-btn ${idx === state.activePdp.selectedImageIndex ? "active" : ""}" data-action="select-pdp-img" data-index="${idx}">
                <img src="${imgUrl}" alt="${product.name} thumbnail ${idx + 1}" />
              </button>
            `
              )
              .join("")}
          </div>
          <div class="pdp-stage">
            <img src="${product.gallery[state.activePdp.selectedImageIndex] || product.image}" alt="${product.name}" />
            <div style="position:absolute; top:1rem; left:1rem;">
              <span class="editorial-tag tag-pink">${product.badge}</span>
            </div>
          </div>
        </div>

        <!-- Right: Product Details, Swatches & Simulated POS Controls -->
        <div class="pdp-info-panel">
          <!-- Interactive POS Stock State Simulator (For Client/Owner Demo) -->
          <div class="pdp-pos-simulator-bar">
            <span style="font-size:0.74rem; font-weight:700; color: var(--text-mauve);">
              ⚡ SIMULATE TOAST POS SHELF STATUS:
            </span>
            <div class="pdp-pos-sim-btns">
              <button class="sim-state-btn ${product.stockStatus === "in_stock" ? "active" : ""}" data-action="sim-pdp-stock" data-state="in_stock">🟢 In Stock</button>
              <button class="sim-state-btn ${product.stockStatus === "low_stock" ? "active" : ""}" data-action="sim-pdp-stock" data-state="low_stock">🟠 Low Stock (2)</button>
              <button class="sim-state-btn ${product.stockStatus === "out_of_stock" ? "active" : ""}" data-action="sim-pdp-stock" data-state="out_of_stock">🔴 Out of Stock</button>
            </div>
          </div>

          <div class="product-brand-row" style="margin-bottom:0.25rem;">
            <span>${product.brand} • SKU: <strong style="font-family:var(--font-mono);">${fullSku}</strong></span>
            <span class="product-rating">★★★★★ ${product.rating.toFixed(1)} <span>(${product.reviews} Reviews)</span></span>
          </div>

          <h1 class="pdp-title">${product.name}</h1>

          <div style="margin: 0.75rem 0;">
            ${renderStockBadge(product)}
          </div>

          <div class="pdp-price-row">
            <span class="pdp-price-current">${fmtPrice(variant.price)}</span>
            ${
              product.compareAtPrice
                ? `<span class="product-price-compare" style="font-size:1.05rem;">${fmtPrice(product.compareAtPrice)}</span>`
                : ""
            }
            <span style="font-size:0.78rem; color: var(--text-mauve);">• 4 interest-free payments of ${fmtPrice(variant.price / 4)}</span>
          </div>

          <p style="font-size:0.93rem; color: var(--text-mauve); margin-bottom:1.4rem;">
            ${product.shortDesc}
          </p>

          <!-- Shade / Length / Size Swatches -->
          <div class="pdp-variant-block">
            <div class="pdp-variant-label">
              <span>Select ${product.variantType}: <strong style="color:var(--pink-magenta);">${variant.label}</strong></span>
              <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-mauve);">${product.aisle}</span>
            </div>
            <div class="pdp-swatch-list">
              ${product.variants
                .map(
                  (v, idx) => `
                <button class="pdp-swatch-chip ${idx === state.activePdp.selectedVariantIndex ? "active" : ""}" data-action="select-pdp-variant" data-index="${idx}">
                  ${v.hex ? `<span class="swatch-dot" style="background:${v.hex}; width:16px; height:16px;"></span>` : ""}
                  <span>${v.label}</span>
                </button>
              `
                )
                .join("")}
            </div>
          </div>

          <!-- Fulfillment Method -->
          <div class="fulfillment-grid">
            <div class="fulfillment-option ${state.activePdp.fulfillment === "pickup" ? "active" : ""}" data-action="select-fulfillment" data-method="pickup">
              <div style="font-weight:700; font-size:0.83rem; display:flex; align-items:center; justify-content:space-between;">
                <span>🛍️ 1-Hour Store Pickup</span>
                <span style="color:var(--status-green); font-size:0.74rem;">FREE</span>
              </div>
              <div style="font-size:0.74rem; color:var(--text-mauve); margin-top:2px;">
                SoHo Flagship • ${product.aisle}
              </div>
            </div>
            <div class="fulfillment-option ${state.activePdp.fulfillment === "ship" ? "active" : ""}" data-action="select-fulfillment" data-method="ship">
              <div style="font-weight:700; font-size:0.83rem; display:flex; align-items:center; justify-content:space-between;">
                <span>🚚 Luxury Courier Shipping</span>
                <span style="color:var(--pink-magenta); font-size:0.74rem;">Free $50+</span>
              </div>
              <div style="font-size:0.74rem; color:var(--text-mauve); margin-top:2px;">
                Ships today after POS shelf check
              </div>
            </div>
          </div>

          <!-- Primary CTA Row (Add to Cart vs Pink Notify Me When Back) -->
          <div class="pdp-action-row">
            ${
              isOut
                ? `<button class="btn btn-primary" style="flex:1; padding:1rem 1.5rem; font-size:0.95rem;" data-action="open-notify" data-id="${product.id}">
                     🔔 Temporarily Out of Stock — Notify Me When Back
                   </button>`
                : `
                  <div class="qty-stepper">
                    <button data-action="pdp-qty" data-delta="-1" aria-label="Decrease quantity">−</button>
                    <span>${state.activePdp.quantity}</span>
                    <button data-action="pdp-qty" data-delta="1" aria-label="Increase quantity">+</button>
                  </div>
                  <button class="btn btn-primary" style="flex:1; padding:1rem 1.5rem; font-size:0.95rem;" data-action="add-pdp-to-cart">
                    Add to Bag • ${fmtPrice(variant.price * state.activePdp.quantity)}
                  </button>
                `
            }
          </div>

          <!-- Required Store Pickup & Order Verification Notice -->
          <div class="verification-guarantee-banner">
            <div class="verification-guarantee-icon">✓</div>
            <div class="verification-guarantee-text">
              <strong>Stock Confirmation Guarantee (Toast POS Verified)</strong>
              To prevent overselling, your card is only pre-authorized at checkout. Our in-store team verifies physical shelf availability via Toast POS before finalizing and fulfilling your order.
            </div>
          </div>

          <!-- Accordion Tabs -->
          <div class="accordion-list">
            <div class="accordion-item open">
              <button class="accordion-trigger" data-action="toggle-accordion">
                <span>How to Use &amp; Stylist Application Tips</span>
                <span>−</span>
              </button>
              <div class="accordion-content">
                ${product.howToUse}
              </div>
            </div>
            <div class="accordion-item">
              <button class="accordion-trigger" data-action="toggle-accordion">
                <span>Full Ingredients &amp; Material Specs</span>
                <span>+</span>
              </button>
              <div class="accordion-content">
                ${product.ingredients}
              </div>
            </div>
            <div class="accordion-item">
              <button class="accordion-trigger" data-action="toggle-accordion">
                <span>In-Store Pickup &amp; Toast POS Pre-Auth Workflow</span>
                <span>+</span>
              </button>
              <div class="accordion-content">
                Every online order places a temporary pre-authorization hold. Our Beauty Bar associates receive an instant pick-ticket showing exact shelf location (<strong>${product.aisle}</strong>), scan the physical barcode in Toast POS, and only capture payment once your item is sealed in your luxury Rosélia bag.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Complete the Routine Cross-Sell Carousel -->
      <div style="margin-top: 4rem; padding-top: 3rem; border-top: 1px solid var(--border-pink);">
        <div class="section-header-row">
          <div>
            <span class="eyebrow">Curated Pairing</span>
            <h2 class="section-title">Complete the <em>Routine</em></h2>
          </div>
          <button class="btn btn-secondary" data-action="go-category" data-category="${product.category}">
            Explore More in ${product.category}
          </button>
        </div>
        <div class="product-grid">
          ${crossSell.map(renderProductCard).join("")}
        </div>
      </div>
    `;
  }

  /* ==========================================================================
     CART DRAWER & PRE-AUTH CHECKOUT SIMULATION
     ========================================================================== */
  function renderCartDrawer() {
    const countBadges = document.querySelectorAll(".cart-count-badge");
    const totalQty = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    countBadges.forEach((b) => (b.textContent = totalQty));

    const subtotal = state.cart.reduce((sum, item) => {
      const p = getProduct(item.productId);
      if (!p) return sum;
      const v = p.variants[item.variantIndex] || p.variants[0];
      return sum + v.price * item.quantity;
    }, 0);

    // Free Shipping Meter ($50 threshold)
    const freeShipThreshold = 50;
    const meterText = document.getElementById("cart-shipping-text");
    const meterFill = document.getElementById("cart-shipping-fill");
    if (meterText && meterFill) {
      if (subtotal >= freeShipThreshold) {
        meterText.innerHTML = `✨ You've unlocked <strong>FREE Luxury Courier Shipping</strong> &amp; Priority 1-Hr Store Pickup!`;
        meterFill.style.width = "100%";
      } else {
        const diff = freeShipThreshold - subtotal;
        meterText.innerHTML = `Add <strong>${fmtPrice(diff)}</strong> more for <strong>FREE Shipping Over $50</strong>`;
        meterFill.style.width = `${Math.min(100, Math.round((subtotal / freeShipThreshold) * 100))}%`;
      }
    }

    const bodyEl = document.getElementById("cart-items-container");
    if (bodyEl) {
      if (state.cart.length === 0) {
        bodyEl.innerHTML = `
          <div style="text-align:center; padding: 3rem 1rem;">
            <p style="font-family:var(--font-serif); font-size:1.4rem; margin-bottom:0.5rem;">Your Rosélia Bag is Empty</p>
            <p style="font-size:0.85rem; color:var(--text-mauve); margin-bottom:1.5rem;">Explore our HD Lace Wig Vault, Honey Hair Elixirs, and Peptide Lip Oils.</p>
            <button class="btn btn-primary" data-action="close-drawers">Shop Bestsellers</button>
          </div>
        `;
      } else {
        bodyEl.innerHTML = state.cart
          .map((item, idx) => {
            const p = getProduct(item.productId);
            if (!p) return "";
            const v = p.variants[item.variantIndex] || p.variants[0];
            return `
              <div class="cart-item">
                <img class="cart-item-img" src="${p.image}" alt="${p.name}" />
                <div style="flex:1; min-width:0;">
                  <div style="display:flex; justify-content:space-between; gap:0.5rem;">
                    <h4 style="font-family:var(--font-serif); font-size:1.05rem; font-weight:600; line-height:1.2;">${p.name}</h4>
                    <button style="color:var(--text-mauve); font-size:0.8rem;" data-action="remove-cart-item" data-index="${idx}" title="Remove">✕</button>
                  </div>
                  <div style="font-size:0.75rem; color:var(--text-mauve); margin:0.2rem 0;">
                    ${v.label} • <span style="color:var(--status-green); font-weight:600;">${item.fulfillment === "pickup" ? "In-Store Pickup" : "Delivery"}</span>
                  </div>
                  <div style="display:flex; align-items:center; justify-content:space-between; margin-top:0.55rem;">
                    <div class="qty-stepper" style="padding:0.1rem;">
                      <button style="width:26px; height:26px;" data-action="cart-item-qty" data-index="${idx}" data-delta="-1">−</button>
                      <span style="width:26px; font-size:0.8rem;">${item.quantity}</span>
                      <button style="width:26px; height:26px;" data-action="cart-item-qty" data-index="${idx}" data-delta="1">+</button>
                    </div>
                    <strong style="font-size:0.92rem;">${fmtPrice(v.price * item.quantity)}</strong>
                  </div>
                </div>
              </div>
            `;
          })
          .join("");
      }
    }

    const subtotalEl = document.getElementById("cart-subtotal-amount");
    if (subtotalEl) {
      subtotalEl.textContent = fmtPrice(subtotal);
    }
  }

  /* ==========================================================================
     LIVE SEARCH DROPDOWN SUGGESTIONS
     ========================================================================== */
  function handleSearchInput(query) {
    const dropdown = document.getElementById("search-suggestions-dropdown");
    const listEl = document.getElementById("search-suggestions-list");
    if (!dropdown || !listEl) return;

    const q = query.trim().toLowerCase();
    let matches = DATA.products;
    if (q.length > 0) {
      matches = DATA.products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.concern.toLowerCase().includes(q)
      );
    }

    listEl.innerHTML =
      matches.length === 0
        ? `<div style="padding:0.75rem; font-size:0.82rem; color:var(--text-mauve);">No instant matches for "${query}". Press Enter to search catalog.</div>`
        : matches
            .slice(0, 4)
            .map(
              (p) => `
          <div class="search-suggestion-item" data-action="open-pdp" data-id="${p.id}">
            <img class="search-suggestion-thumb" src="${p.image}" alt="${p.name}" />
            <div class="search-suggestion-info">
              <div class="search-suggestion-title">${p.name}</div>
              <div class="search-suggestion-meta">
                <span>${p.brand}</span>
                <span>•</span>
                <strong style="color:var(--pink-magenta);">${fmtPrice(p.price)}</strong>
                <span>•</span>
                <span>${p.stockStatus === "in_stock" ? "🟢 In Stock" : p.stockStatus === "low_stock" ? "🟠 Only 2 Left" : "🔴 Out of Stock"}</span>
              </div>
            </div>
          </div>
        `
            )
            .join("");

    dropdown.classList.add("open");
  }

  /* ==========================================================================
     MODALS: NOTIFY ME, SHOP THE LOOK, PRE-AUTH CHECKOUT & STRATEGY
     ========================================================================== */
  function openNotifyModal(productId) {
    const product = getProduct(productId);
    if (!product) return;
    state.notifyTargetProductId = productId;

    const modal = document.getElementById("modal-notify");
    const content = document.getElementById("modal-notify-body");
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="display:flex; gap:1rem; align-items:center; background:var(--pink-blush); padding:0.9rem; border-radius:var(--radius-sm); border:1px solid var(--border-pink); margin-bottom:1.25rem;">
        <img src="${product.image}" alt="${product.name}" style="width:64px; height:64px; border-radius:var(--radius-sm);" />
        <div>
          <span class="editorial-tag tag-pink">🔴 Temporarily Out of Stock</span>
          <h4 style="font-family:var(--font-serif); font-size:1.15rem; margin-top:0.25rem;">${product.name}</h4>
          <div style="font-size:0.76rem; color:var(--text-mauve);">Toast POS SKU: ${product.sku} • ${fmtPrice(product.price)}</div>
        </div>
      </div>
      <form id="notify-restock-form">
        <div style="margin-bottom:0.9rem;">
          <label style="display:block; font-size:0.8rem; font-weight:600; margin-bottom:0.35rem;">Email Address for Instant Restock Alert</label>
          <input type="email" required placeholder="you@example.com" style="width:100%; padding:0.75rem 0.9rem; border-radius:var(--radius-sm); border:1px solid var(--border-pink); background:var(--bg-ivory);" />
        </div>
        <div style="margin-bottom:1.15rem;">
          <label style="display:block; font-size:0.8rem; font-weight:600; margin-bottom:0.35rem;">SMS Mobile Number (Optional — Priority 15-Min VIP Hold Link)</label>
          <input type="tel" placeholder="(555) 234-5678" style="width:100%; padding:0.75rem 0.9rem; border-radius:var(--radius-sm); border:1px solid var(--border-pink); background:var(--bg-ivory);" />
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%;">
          🔔 Subscribe to Live Toast POS Restock Alert
        </button>
      </form>
      <p style="font-size:0.74rem; color:var(--text-mauve); margin-top:0.85rem; text-align:center;">
        The moment our receiving team scans new units into Toast POS, you'll receive an automated SMS/Email reserve link.
      </p>
    `;

    modal.classList.add("open");

    const form = document.getElementById("notify-restock-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        modal.classList.remove("open");
        showToastNotification(`🔔 Restock webhook registered for ${product.name}! You'll be notified as soon as Toast POS logs new inventory.`);
      });
    }
  }

  function openLookModal(lookId) {
    const look = DATA.communityLooks.find((l) => l.id === lookId);
    if (!look) return;
    const modal = document.getElementById("modal-look");
    const content = document.getElementById("modal-look-body");
    if (!modal || !content) return;

    const taggedProducts = look.productIds.map(getProduct).filter(Boolean);

    content.innerHTML = `
      <div style="display:grid; grid-template-columns: 1fr 1.15fr; gap:1.5rem; align-items:start;">
        <div style="border-radius:var(--radius-md); overflow:hidden; border:1px solid var(--border-pink);">
          <img src="${look.image}" alt="${look.handle}" style="width:100%; height:360px; object-fit:cover;" />
          <div style="padding:0.85rem; background:var(--pink-blush);">
            <strong style="color:var(--pink-magenta); font-size:0.85rem;">${look.handle}</strong>
            <p style="font-size:0.8rem; color:var(--text-espresso); margin-top:0.25rem;">${look.caption}</p>
          </div>
        </div>
        <div>
          <span class="eyebrow">Featured in This Look</span>
          <h3 style="font-family:var(--font-serif); font-size:1.6rem; margin-bottom:1rem;">Shop the Routine</h3>
          <div style="display:flex; flex-direction:column; gap:0.85rem;">
            ${taggedProducts
              .map(
                (p) => `
              <div style="display:flex; align-items:center; gap:0.85rem; padding:0.65rem; border:1px solid var(--border-subtle); border-radius:var(--radius-sm);">
                <img src="${p.image}" alt="${p.name}" style="width:56px; height:64px; border-radius:6px;" />
                <div style="flex:1; min-width:0;">
                  <div style="font-weight:600; font-size:0.86rem;">${p.name}</div>
                  <div style="font-size:0.78rem; color:var(--pink-magenta); font-weight:700;">${fmtPrice(p.price)}</div>
                  <div style="margin-top:3px;">${renderStockBadge(p)}</div>
                </div>
                ${
                  p.stockStatus === "out_of_stock"
                    ? `<button class="btn btn-secondary" style="padding:0.45rem 0.85rem; font-size:0.75rem;" data-action="open-notify" data-id="${p.id}">Notify</button>`
                    : `<button class="btn btn-primary" style="padding:0.45rem 0.85rem; font-size:0.75rem;" data-action="quick-add" data-id="${p.id}">+ Bag</button>`
                }
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
    modal.classList.add("open");
  }

  function openCheckoutSimModal() {
    closeAllDrawers();
    const modal = document.getElementById("modal-checkout-sim");
    const body = document.getElementById("modal-checkout-sim-body");
    if (!modal || !body) return;

    const subtotal = state.cart.reduce((sum, item) => {
      const p = getProduct(item.productId);
      if (!p) return sum;
      const v = p.variants[item.variantIndex] || p.variants[0];
      return sum + v.price * item.quantity;
    }, 0);

    body.innerHTML = `
      <div class="verification-guarantee-banner" style="margin-bottom:1.25rem;">
        <div class="verification-guarantee-icon">🔒</div>
        <div class="verification-guarantee-text">
          <strong>Pre-Authorization Checkout Hold Active</strong>
          To prevent overselling, your card is only pre-authorized at checkout. Our in-store team verifies physical shelf availability via Toast POS before finalizing and fulfilling your order.
        </div>
      </div>

      <div style="background:var(--bg-ivory); padding:1rem; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); margin-bottom:1.25rem;">
        <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:0.35rem;">
          <span>Items in Bag (${state.cart.reduce((s, i) => s + i.quantity, 0)})</span>
          <strong>${fmtPrice(subtotal)}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:0.35rem;">
          <span>Fulfillment &amp; Toast POS Shelf Check</span>
          <strong style="color:var(--status-green);">FREE (1-Hr Store Pickup / $50+ Ship)</strong>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:1rem; padding-top:0.5rem; border-top:1px solid var(--border-subtle);">
          <strong>Pre-Authorization Hold Total</strong>
          <strong style="color:var(--pink-magenta);">${fmtPrice(subtotal)}</strong>
        </div>
      </div>

      <div id="preauth-live-stage" style="padding:1rem; border:1px dashed var(--pink-dusty); border-radius:var(--radius-sm); margin-bottom:1.25rem; font-size:0.82rem;">
        <div style="font-weight:700; margin-bottom:0.4rem;">Interactive Workflow Preview:</div>
        <ol style="padding-left:1.2rem; color:var(--text-mauve); display:flex; flex-direction:column; gap:0.3rem;">
          <li><strong>Step 1 (Pre-Auth):</strong> Card is authorized for <strong>${fmtPrice(subtotal)}</strong> (<code>capture_method: manual</code> — $0 charged yet).</li>
          <li><strong>Step 2 (Toast POS Pick Ticket):</strong> In-store associate scans item barcode on shelf to verify physical availability.</li>
          <li><strong>Step 3 (Final Capture):</strong> Payment is captured only after shelf confirmation &amp; SMS pickup code is sent.</li>
        </ol>
      </div>

      <button class="btn btn-primary" style="width:100%;" data-action="trigger-preauth-order">
        ✨ Simulate Pre-Authorization Order &amp; Toast POS Verification
      </button>
    `;

    modal.classList.add("open");
  }

  /* ==========================================================================
     RENDER STRATEGY & TOAST POS ARCHITECTURE MODAL (Owner/Client View)
     ========================================================================== */
  function renderStrategyModalContent() {
    const body = document.getElementById("strategy-modal-tab-content");
    if (!body) return;

    document.querySelectorAll("[data-strategy-tab]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.strategyTab === state.activeStrategyTab);
    });

    if (state.activeStrategyTab === "platforms") {
      body.innerHTML = `
        <div style="margin-bottom:1.25rem;">
          <span class="eyebrow">1. E-Commerce Platform Recommendation</span>
          <h3 class="section-title" style="font-size:1.75rem; margin-top:0.2rem;">Scalable Platforms Built for High-SKU Beauty Supply Stores</h3>
          <p style="font-size:0.88rem; color:var(--text-mauve); margin-top:0.35rem;">
            Beauty supply stores manage thousands of variants (hair lengths 14"–30", densities, lace tints, lip shades, and pro sizes). Here is how the top architectures compare when paired with your physical <strong>Toast POS</strong> system:
          </p>
        </div>

        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:1.15rem;">
          <!-- Option 1: Shopify -->
          <div style="background:var(--pink-blush); border:2px solid var(--pink-magenta); border-radius:var(--radius-md); padding:1.35rem; position:relative;">
            <span class="editorial-tag tag-pink" style="margin-bottom:0.65rem; display:inline-block;">★ Primary Recommendation</span>
            <h4 style="font-family:var(--font-serif); font-size:1.4rem; margin-bottom:0.4rem;">Shopify (Standard / Plus)</h4>
            <p style="font-size:0.8rem; color:var(--text-mauve); margin-bottom:0.9rem;">
              Industry gold standard for modern beauty brands (Glossier, Gisou, Kylie Cosmetics). Native support for <strong>2,000 variants per product</strong> and native <strong>Manual Payment Capture (Pre-Authorization)</strong>.
            </p>
            <ul style="font-size:0.8rem; display:flex; flex-direction:column; gap:0.45rem;">
              <li>✅ <strong>Native Pre-Auth Hold:</strong> 1-click toggle for "Automatically authorize, manually capture after Toast POS verification".</li>
              <li>✅ <strong>Multi-Location Inventory:</strong> Separates Backroom Warehouse vs. Physical Retail Floor stock.</li>
              <li>✅ <strong>Instagram / TikTok Shop Sync:</strong> Direct Shop-the-Look social catalog integration.</li>
              <li>✅ <strong>Fastest Time-to-Market:</strong> 99.99% uptime, PCI compliant, zero server maintenance.</li>
            </ul>
          </div>

          <!-- Option 2: WooCommerce -->
          <div style="background:var(--bg-white); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:1.35rem;">
            <span class="editorial-tag" style="margin-bottom:0.65rem; display:inline-block;">Best for Custom Control</span>
            <h4 style="font-family:var(--font-serif); font-size:1.4rem; margin-bottom:0.4rem;">WooCommerce + Custom POS Bridge</h4>
            <p style="font-size:0.8rem; color:var(--text-mauve); margin-bottom:0.9rem;">
              Open-source WordPress commerce engine offering full database ownership and zero platform transaction fees beyond Stripe processing.
            </p>
            <ul style="font-size:0.8rem; display:flex; flex-direction:column; gap:0.45rem;">
              <li>✅ <strong>Unlimited Custom Attributes:</strong> Ideal for custom wig builder rules (Cap Size + Lace + Length + Custom Color).</li>
              <li>✅ <strong>Stripe Authorize-Only Mode:</strong> Supports 7-day card pre-authorization holds out of the box.</li>
              <li>⚠️ <strong>Requires Managed Hosting:</strong> Needs WP Engine / Kinsta + Elasticsearch/Algolia to keep 5,000+ SKUs fast.</li>
            </ul>
          </div>

          <!-- Option 3: Custom Headless -->
          <div style="background:var(--bg-white); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:1.35rem;">
            <span class="editorial-tag" style="margin-bottom:0.65rem; display:inline-block;">Phase 2 Enterprise Scale</span>
            <h4 style="font-family:var(--font-serif); font-size:1.4rem; margin-bottom:0.4rem;">Headless Next.js + Shopify Storefront API</h4>
            <p style="font-size:0.8rem; color:var(--text-mauve); margin-bottom:0.9rem;">
              Uses this exact custom luxury SPA front-end coupled to Shopify's back-end checkout &amp; inventory GraphQL APIs.
            </p>
            <ul style="font-size:0.8rem; display:flex; flex-direction:column; gap:0.45rem;">
              <li>✅ <strong>Sub-100ms Page Transitions:</strong> Instant SPA animations &amp; custom AI shade/hair match quizzes.</li>
              <li>✅ <strong>Custom Toast POS Middleware:</strong> Direct serverless webhook worker syncing barcode scans in real time.</li>
            </ul>
          </div>
        </div>
      `;
    } else if (state.activeStrategyTab === "middleware") {
      body.innerHTML = `
        <div style="margin-bottom:1rem;">
          <span class="eyebrow">2. Toast POS Integration &amp; Sync Bridges</span>
          <h3 class="section-title" style="font-size:1.75rem; margin-top:0.2rem;">How Toast POS Syncs with Your Online Beauty Catalog</h3>
          <p style="font-size:0.88rem; color:var(--text-mauve); margin-top:0.35rem;">
            Because Toast POS was originally architected for high-speed retail/hospitality checkout, connecting it to e-commerce requires an <strong>Inventory Sync Middleware Bridge</strong> + <strong>Safety Stock Buffers</strong>:
          </p>
        </div>

        <div class="arch-diagram-grid">
          <div class="arch-node">
            <div style="font-family:var(--font-mono); font-size:0.72rem; color:var(--pink-magenta); font-weight:700;">IN-STORE PHYSICAL LAYER</div>
            <h4 style="font-family:var(--font-serif); font-size:1.25rem; margin:0.25rem 0;">Toast POS Registers &amp; Barcode Scanners</h4>
            <p style="font-size:0.78rem; color:var(--text-mauve);">
              Walk-in customers purchase wigs, braiding hair, and lip oils. Every barcode scan decrements physical shelf count in Toast Retail POS.
            </p>
          </div>

          <div class="arch-connector">
            <div>⇄ Webhook / API</div>
            <div style="font-size:1.2rem;">⟶</div>
            <div>Every 60–120s</div>
          </div>

          <div class="arch-node" style="border-top-color:var(--accent-gold); background:var(--pink-blush);">
            <div style="font-family:var(--font-mono); font-size:0.72rem; color:var(--text-espresso); font-weight:700;">MIDDLEWARE SYNC BRIDGE</div>
            <h4 style="font-family:var(--font-serif); font-size:1.25rem; margin:0.25rem 0;">SKU IQ / Yellow Dog / Custom Webhook Bridge</h4>
            <p style="font-size:0.78rem; color:var(--text-mauve);">
              Maps Toast POS UPC/SKU codes (<code>TST-WIG-8801</code>) to E-Commerce Variants. Applies <strong>Safety Buffer Rules</strong> (e.g., if Toast = 2 units, show 🟠 <em>Low Stock</em> badge; if Toast ≤ 1 unit on high-velocity items, hold for walk-in).
            </p>
          </div>

          <div class="arch-connector">
            <div>⇄ GraphQL Sync</div>
            <div style="font-size:1.2rem;">⟶</div>
            <div>Real-Time UI</div>
          </div>

          <div class="arch-node" style="border-top-color:var(--status-green);">
            <div style="font-family:var(--font-mono); font-size:0.72rem; color:var(--status-green); font-weight:700;">LUXURY STOREFRONT LAYER</div>
            <h4 style="font-family:var(--font-serif); font-size:1.25rem; margin:0.25rem 0;">Rosélia Online Store &amp; Local Delivery</h4>
            <p style="font-size:0.78rem; color:var(--text-mauve);">
              Displays live 🟢/🟠/🔴 stock badges, triggers <strong>Nash / DoorDash Drive</strong> for local 1-hr courier delivery, or queues 1-Hr In-Store Pickup.
            </p>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem; margin-top:1rem;">
          <div style="background:var(--bg-ivory); padding:1rem; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
            <strong style="font-size:0.85rem; color:var(--pink-magenta);">Recommended Turnkey Bridges:</strong>
            <p style="font-size:0.79rem; color:var(--text-mauve); margin-top:0.25rem;">
              <strong>SKU IQ</strong> or <strong>Yellow Dog Inventory</strong> provide pre-built connectors between POS systems and Shopify/WooCommerce, syncing SKU quantities, prices, and omnichannel order receipts automatically.
            </p>
          </div>
          <div style="background:var(--bg-ivory); padding:1rem; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
            <strong style="font-size:0.85rem; color:var(--pink-magenta);">Local Same-Day Beauty Courier (Nash):</strong>
            <p style="font-size:0.79rem; color:var(--text-mauve); margin-top:0.25rem;">
              Integrate <strong>Nash</strong> so stylists and local shoppers who need last-minute braiding hair, lash clusters, or HD lace adhesive can get 45-minute UberDirect/DoorDash courier dispatch once verified in-store.
            </p>
          </div>
        </div>
      `;
    } else if (state.activeStrategyTab === "preauth") {
      body.innerHTML = `
        <div style="margin-bottom:1rem;">
          <span class="eyebrow">3. "Verify Before Fulfillment" Pre-Auth Workflow</span>
          <h3 class="section-title" style="font-size:1.75rem; margin-top:0.2rem;">Eliminating Walk-In Overselling &amp; Refund Fees</h3>
          <p style="font-size:0.88rem; color:var(--text-mauve); margin-top:0.35rem;">
            In a busy beauty supply store, a walk-in shopper might pick up the last 24" HD Lace Wig from the display case 30 seconds before an online shopper clicks "Buy". Our <strong>Pre-Authorization Verification Flow</strong> protects both customer trust and your merchant margins:
          </p>
        </div>

        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:0.9rem; margin:1.25rem 0;">
          <div style="background:var(--bg-ivory); padding:1.1rem; border-radius:var(--radius-sm); border-left:4px solid var(--pink-magenta);">
            <div style="font-family:var(--font-mono); font-size:0.72rem; color:var(--pink-magenta);">STEP 01 • CHECKOUT</div>
            <h4 style="font-size:0.95rem; margin:0.3rem 0;">Card Pre-Authorized Only</h4>
            <p style="font-size:0.78rem; color:var(--text-mauve);">
              Customer checks out online. Payment gateway places a temporary authorization hold (<code>capture_method: manual</code>). Funds are verified, but <strong>not yet captured</strong>.
            </p>
          </div>

          <div style="background:var(--bg-ivory); padding:1.1rem; border-radius:var(--radius-sm); border-left:4px solid var(--accent-gold);">
            <div style="font-family:var(--font-mono); font-size:0.72rem; color:var(--status-amber);">STEP 02 • IN-STORE PICK</div>
            <h4 style="font-size:0.95rem; margin:0.3rem 0;">Shelf &amp; Toast POS Scan</h4>
            <p style="font-size:0.78rem; color:var(--text-mauve);">
              In-store tablet alerts staff with exact aisle/bin (e.g., <em>Wig Vault • Case 04</em>). Staff member physically pulls the item and scans it against Toast POS.
            </p>
          </div>

          <div style="background:var(--status-green-bg); padding:1.1rem; border-radius:var(--radius-sm); border-left:4px solid var(--status-green);">
            <div style="font-family:var(--font-mono); font-size:0.72rem; color:var(--status-green);">STEP 03A • VERIFIED</div>
            <h4 style="font-size:0.95rem; margin:0.3rem 0;">1-Click Capture &amp; Ready SMS</h4>
            <p style="font-size:0.78rem; color:var(--text-mauve);">
              Staff taps "Verified on Shelf". Payment is captured automatically, Toast POS deducts 1 unit, and customer gets their "Ready for Pickup / Shipped" SMS.
            </p>
          </div>

          <div style="background:var(--pink-blush); padding:1.1rem; border-radius:var(--radius-sm); border-left:4px solid var(--pink-magenta-dark);">
            <div style="font-family:var(--font-mono); font-size:0.72rem; color:var(--pink-magenta-dark);">STEP 03B • IF SOLD OUT</div>
            <h4 style="font-size:0.95rem; margin:0.3rem 0;">Zero-Fee Void or Shade Swap</h4>
            <p style="font-size:0.78rem; color:var(--text-mauve);">
              If a walk-in just bought the last unit, staff can offer a 1-click SMS shade/length swap OR void the uncaptured hold—<strong>saving 2.9% + $0.30 Stripe refund fees!</strong>
            </p>
          </div>
        </div>
      `;
    } else if (state.activeStrategyTab === "simulator") {
      body.innerHTML = `
        <div style="margin-bottom:1rem;">
          <span class="eyebrow">4. Interactive Live POS Sandbox</span>
          <h3 class="section-title" style="font-size:1.75rem; margin-top:0.2rem;">Test Real-Time Toast POS Shelf Updates Across the Storefront</h3>
          <p style="font-size:0.88rem; color:var(--text-mauve); margin-top:0.35rem;">
            Click any product below to simulate a walk-in customer buying or returning units at a physical Toast POS register—then close this modal to see the product cards, badges, and "Notify Me When Back" buttons update live!
          </p>
        </div>

        <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:0.85rem;">
          ${DATA.products
            .slice(0, 6)
            .map(
              (p) => `
            <div style="display:flex; align-items:center; justify-content:space-between; gap:0.75rem; padding:0.75rem; background:var(--bg-ivory); border:1px solid var(--border-subtle); border-radius:var(--radius-sm);">
              <div style="display:flex; align-items:center; gap:0.7rem; min-width:0;">
                <img src="${p.image}" alt="${p.name}" style="width:46px; height:46px; border-radius:6px;" />
                <div style="min-width:0;">
                  <div style="font-size:0.82rem; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p.name}</div>
                  <div style="margin-top:2px;">${renderStockBadge(p)}</div>
                </div>
              </div>
              <div style="display:flex; gap:0.3rem; flex-shrink:0;">
                <button class="sim-state-btn ${p.stockStatus === "in_stock" ? "active" : ""}" data-action="global-sim-stock" data-id="${p.id}" data-state="in_stock">🟢 In</button>
                <button class="sim-state-btn ${p.stockStatus === "low_stock" ? "active" : ""}" data-action="global-sim-stock" data-id="${p.id}" data-state="low_stock">🟠 Low</button>
                <button class="sim-state-btn ${p.stockStatus === "out_of_stock" ? "active" : ""}" data-action="global-sim-stock" data-id="${p.id}" data-state="out_of_stock">🔴 Out</button>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    }
  }

  /* ==========================================================================
     UTILITIES: DRAWERS, MODALS & TOAST NOTIFICATIONS
     ========================================================================== */
  function openDrawer(drawerId) {
    document.getElementById("global-backdrop")?.classList.add("open");
    document.getElementById(drawerId)?.classList.add("open");
  }

  function closeAllDrawers() {
    document.getElementById("global-backdrop")?.classList.remove("open");
    document.querySelectorAll(".slide-drawer").forEach((d) => d.classList.remove("open"));
    document.querySelectorAll(".modal-container").forEach((m) => m.classList.remove("open"));
  }

  let toastTimer = null;
  function showToastNotification(message) {
    const toast = document.getElementById("live-toast-popup");
    const text = document.getElementById("live-toast-text");
    if (!toast || !text) return;
    text.innerHTML = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 4200);
  }

  function addItemToCart(productId, variantIndex = 0, quantity = 1, fulfillment = "pickup") {
    const product = getProduct(productId);
    if (!product) return;
    if (product.stockStatus === "out_of_stock") {
      openNotifyModal(productId);
      return;
    }

    const existing = state.cart.find(
      (i) => i.productId === productId && i.variantIndex === variantIndex && i.fulfillment === fulfillment
    );
    if (existing) {
      existing.quantity += quantity;
    } else {
      state.cart.push({ productId, variantIndex, quantity, fulfillment });
    }

    renderCartDrawer();
    openDrawer("cart-drawer");
    showToastNotification(
      `🛍️ Added <strong>${product.name}</strong> to bag • Pre-Auth Shelf Guarantee Active`
    );
  }

  function refreshAllViews() {
    renderHomeSections();
    renderCatalogView();
    if (state.currentView === "pdp") renderPdpView();
    renderCartDrawer();
    renderStrategyModalContent();
  }

  /* ==========================================================================
     GLOBAL EVENT DELEGATION
     ========================================================================== */
  function bindEvents() {
    document.addEventListener("click", (e) => {
      // Close search dropdown if clicked outside
      const searchWrapper = document.querySelector(".search-wrapper");
      if (searchWrapper && !searchWrapper.contains(e.target)) {
        document.getElementById("search-suggestions-dropdown")?.classList.remove("open");
      }

      const target = e.target.closest("[data-action], [data-home-tab], [data-strategy-tab]");
      if (!target) return;

      // 1. Homepage Bestseller Tabs
      if (target.dataset.homeTab) {
        state.homeTab = target.dataset.homeTab;
        renderHomeBestsellersGrid();
        return;
      }

      // 2. Strategy Modal Tabs
      if (target.dataset.strategyTab) {
        state.activeStrategyTab = target.dataset.strategyTab;
        renderStrategyModalContent();
        return;
      }

      const action = target.dataset.action;

      switch (action) {
        case "nav-home":
          closeAllDrawers();
          switchView("home");
          break;

        case "nav-catalog":
          closeAllDrawers();
          switchView("catalog");
          break;

        case "go-category": {
          const cat = target.dataset.category || "All";
          switchCategoryDepartment(cat);
          break;
        }

        case "go-concern": {
          const cat = target.dataset.category || "All";
          const concern = target.dataset.concern || "All";
          switchCategoryDepartment(cat, { concern: concern });
          break;
        }

        case "story-filter": {
          const cat = target.dataset.category;
          if (cat === "Low Stock") {
            state.catalogFilters.inStoreOnly = true;
            state.catalogFilters.sortBy = "instock-first";
            switchCategoryDepartment("All");
          } else {
            switchCategoryDepartment(cat);
          }
          break;
        }

        case "open-pdp": {
          const id = target.dataset.id;
          document.getElementById("search-suggestions-dropdown")?.classList.remove("open");
          closeAllDrawers();
          switchView("pdp", { productId: id });
          break;
        }

        case "quick-add": {
          e.stopPropagation();
          const id = target.dataset.id;
          addItemToCart(id, 0, 1, "pickup");
          break;
        }

        case "open-notify": {
          e.stopPropagation();
          const id = target.dataset.id;
          openNotifyModal(id);
          break;
        }

        case "toggle-wishlist": {
          e.stopPropagation();
          const id = target.dataset.id;
          const idx = state.wishlist.indexOf(id);
          if (idx >= 0) {
            state.wishlist.splice(idx, 1);
            showToastNotification("Removed item from your Saved Beauty List.");
          } else {
            state.wishlist.push(id);
            showToastNotification("💖 Saved to your Beauty Wishlist!");
          }
          document.querySelectorAll(".wishlist-count-badge").forEach((b) => (b.textContent = state.wishlist.length));
          refreshAllViews();
          break;
        }

        case "open-cart":
          renderCartDrawer();
          openDrawer("cart-drawer");
          break;

        case "open-mobile-nav":
          openDrawer("mobile-nav-drawer");
          break;

        case "close-drawers":
          closeAllDrawers();
          break;

        case "toggle-instore-filter":
          state.catalogFilters.inStoreOnly = !state.catalogFilters.inStoreOnly;
          renderCatalogView();
          break;

        case "clear-chip": {
          const type = target.dataset.clear;
          if (type === "category") state.catalogFilters.category = "All";
          if (type === "concern") state.catalogFilters.concern = "All";
          if (type === "inStoreOnly") state.catalogFilters.inStoreOnly = false;
          if (type === "priceRange") state.catalogFilters.priceRange = "all";
          if (type === "searchQuery") state.catalogFilters.searchQuery = "";
          if (type === "brand") {
            state.catalogFilters.brands = state.catalogFilters.brands.filter((b) => b !== target.dataset.val);
          }
          renderCatalogView();
          break;
        }

        case "reset-all-filters":
          state.catalogFilters.category = "All";
          state.catalogFilters.brands = [];
          state.catalogFilters.priceRange = "all";
          state.catalogFilters.concern = "All";
          state.catalogFilters.inStoreOnly = false;
          state.catalogFilters.searchQuery = "";
          renderCatalogView();
          break;

        case "load-more-catalog":
          state.catalogFilters.visibleCount += 6;
          renderCatalogView();
          break;

        case "set-grid-cols":
          state.catalogFilters.gridCols = Number(target.dataset.cols) || 3;
          renderCatalogView();
          break;

        /* PDP Interactions */
        case "select-pdp-img":
          state.activePdp.selectedImageIndex = Number(target.dataset.index) || 0;
          renderPdpView();
          break;

        case "select-pdp-variant":
          state.activePdp.selectedVariantIndex = Number(target.dataset.index) || 0;
          renderPdpView();
          break;

        case "select-fulfillment":
          state.activePdp.fulfillment = target.dataset.method || "pickup";
          renderPdpView();
          break;

        case "pdp-qty": {
          const delta = Number(target.dataset.delta) || 0;
          state.activePdp.quantity = Math.max(1, state.activePdp.quantity + delta);
          renderPdpView();
          break;
        }

        case "add-pdp-to-cart":
          addItemToCart(
            state.activePdp.productId,
            state.activePdp.selectedVariantIndex,
            state.activePdp.quantity,
            state.activePdp.fulfillment
          );
          break;

        case "sim-pdp-stock": {
          const newState = target.dataset.state;
          const p = getProduct(state.activePdp.productId);
          if (p) {
            p.stockStatus = newState;
            p.stockCount = newState === "in_stock" ? 18 : newState === "low_stock" ? 2 : 0;
            state.lastSyncLabel = "just now";
            refreshAllViews();
            showToastNotification(
              `⚡ Toast POS Webhook Simulated: <strong>${p.sku}</strong> updated to <strong>${newState.replace("_", " ").toUpperCase()}</strong>`
            );
          }
          break;
        }

        case "global-sim-stock": {
          const id = target.dataset.id;
          const newState = target.dataset.state;
          const p = getProduct(id);
          if (p) {
            p.stockStatus = newState;
            p.stockCount = newState === "in_stock" ? 16 : newState === "low_stock" ? 2 : 0;
            state.lastSyncLabel = "just now";
            refreshAllViews();
            showToastNotification(
              `⚡ Toast POS Register Scan: <strong>${p.name}</strong> is now <strong>${newState.replace("_", " ").toUpperCase()}</strong>`
            );
          }
          break;
        }

        case "toggle-accordion": {
          const item = target.closest(".accordion-item");
          if (item) {
            item.classList.toggle("open");
          }
          break;
        }

        /* Cart Item Controls */
        case "cart-item-qty": {
          const idx = Number(target.dataset.index);
          const delta = Number(target.dataset.delta);
          if (state.cart[idx]) {
            state.cart[idx].quantity += delta;
            if (state.cart[idx].quantity <= 0) {
              state.cart.splice(idx, 1);
            }
            renderCartDrawer();
          }
          break;
        }

        case "remove-cart-item": {
          const idx = Number(target.dataset.index);
          state.cart.splice(idx, 1);
          renderCartDrawer();
          break;
        }

        case "open-checkout-sim":
          openCheckoutSimModal();
          break;

        case "trigger-preauth-order": {
          const stage = document.getElementById("preauth-live-stage");
          if (stage) {
            stage.innerHTML = `
              <div style="color:var(--status-green); font-weight:700; margin-bottom:0.35rem;">
                ✅ Order #RSL-${Math.floor(10000 + Math.random() * 90000)} Pre-Authorized!
              </div>
              <p style="color:var(--text-espresso); font-size:0.82rem;">
                Card pre-authorization hold succeeded ($0 captured so far). Pick-ticket dispatched to <strong>SoHo Flagship Toast POS Terminal #2</strong>. You will receive an SMS confirmation as soon as your stylist associate scans your items off the shelf!
              </p>
            `;
          }
          state.cart = [];
          renderCartDrawer();
          showToastNotification("🎉 Pre-Auth Order Placed! Sent to Toast POS for physical shelf verification.");
          break;
        }

        case "open-look-modal":
          openLookModal(target.dataset.lookId);
          break;

        case "open-strategy-modal":
          renderStrategyModalContent();
          document.getElementById("modal-strategy")?.classList.add("open");
          break;

        case "trigger-pos-sync":
          state.posSyncCounter += 1;
          state.lastSyncLabel = "just now";
          document.querySelectorAll(".pos-sync-time-label").forEach((el) => (el.textContent = "just now"));
          refreshAllViews();
          showToastNotification(
            `🟢 Toast POS Sync #${state.posSyncCounter}: Verified 2,480 SKUs across SoHo &amp; Buckhead shelves in 120ms.`
          );
          break;

        case "quick-search-tag": {
          const tag = target.dataset.tag || "";
          const input = document.getElementById("global-search-input");
          if (input) {
            input.value = tag;
            handleSearchInput(tag);
          }
          break;
        }
      }
    });

    // Change events for catalog sidebar filters & sort dropdown
    document.addEventListener("change", (e) => {
      const t = e.target;
      if (t.dataset.action === "filter-cat") {
        switchCategoryDepartment(t.value);
      } else if (t.dataset.action === "filter-brand") {
        const val = t.value;
        if (t.checked) {
          state.catalogFilters.brands.push(val);
        } else {
          state.catalogFilters.brands = state.catalogFilters.brands.filter((b) => b !== val);
        }
        renderCatalogView();
      } else if (t.dataset.action === "filter-concern") {
        state.catalogFilters.concern = t.value;
        renderCatalogView();
      } else if (t.dataset.action === "filter-price") {
        state.catalogFilters.priceRange = t.value;
        renderCatalogView();
      } else if (t.id === "catalog-sort-select") {
        state.catalogFilters.sortBy = t.value;
        renderCatalogView();
      }
    });

    // Search Input Listeners
    const searchInput = document.getElementById("global-search-input");
    if (searchInput) {
      searchInput.addEventListener("focus", () => {
        handleSearchInput(searchInput.value);
      });
      searchInput.addEventListener("input", () => {
        handleSearchInput(searchInput.value);
      });
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          state.catalogFilters.searchQuery = searchInput.value;
          document.getElementById("search-suggestions-dropdown")?.classList.remove("open");
          switchView("catalog");
        }
      });
    }
  }

  /* Initialize Application */
  document.addEventListener("DOMContentLoaded", () => {
    // Graceful luxury fallback if an image is blocked or offline
    document.addEventListener(
      "error",
      (e) => {
        if (e.target && e.target.tagName === "IMG" && !e.target.dataset.fallbackApplied) {
          e.target.dataset.fallbackApplied = "true";
          const label = encodeURIComponent(e.target.alt || "Rosélia Atelier");
          e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="700" viewBox="0 0 600 700"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23FFF0F3"/><stop offset="100%" stop-color="%23F4ACB7"/></linearGradient></defs><rect width="600" height="700" fill="url(%23g)"/><circle cx="300" cy="310" r="110" fill="none" stroke="%23D4AF37" stroke-width="2"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="%232B2123">${label}</text></svg>`;
        }
      },
      true
    );

    renderMegaNavigation();
    renderHomeSections();
    renderCatalogView();
    renderPdpView();
    renderCartDrawer();
    renderStrategyModalContent();
    bindEvents();
  });
})();
