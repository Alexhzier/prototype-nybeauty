/* ==========================================================================
   ROSÉLIA ATELIER — MOCK CATALOG, TOAST POS INVENTORY & EDITORIAL DATA
   ========================================================================== */

window.ROSELIA_DATA = {
  storeInfo: {
    name: "Rosélia Flagship Beauty Bar — SoHo & Buckhead",
    lastPosSync: "2 mins ago",
    totalCatalogSkus: 2480,
    pickupGuaranteeText:
      "To prevent overselling, your card is only pre-authorized at checkout. Our in-store team verifies physical shelf availability via Toast POS before finalizing and fulfilling your order."
  },

  /* 1. Mega-Menu & Navigation Categories */
  megaCategories: [
    {
      id: "Hair Care",
      label: "Hair Care",
      subcategories: [
        "Honey & Silk Hair Oils",
        "Bond Repair Treatments",
        "4C & Coil Defining Custards",
        "Sulfate-Free Cleansing",
        "Edge Control & Braid Gels",
        "Scalp Detox & Serums"
      ],
      concerns: ["4C & Coily", "Curly (3A-3C)", "Color-Treated / Bond Repair", "Frizz & Humidity Shield"],
      featured: {
        tag: "Cult Bestseller • Synced Live",
        title: "Miel Infused Silk Hair Elixir",
        cta: "Shop Hair Care",
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=85"
      }
    },
    {
      id: "Wigs & Extensions",
      label: "Wigs & Extensions",
      subcategories: [
        "13x6 HD Melt Lace Front Wigs",
        "Raw Cambodian & Vietnamese Bundles",
        "Glueless Ready-to-Wear Units",
        "Seamless Clip-Ins & Tape-Ins",
        "Pre-Stretched Braiding Hair",
        "Lace Tint & Melt Adhesives"
      ],
      concerns: ["HD Lace & Melt", "Wavy & Straight", "4C & Coily", "High-Heat Styling"],
      featured: {
        tag: "Wig Bar Exclusive",
        title: "Swiss HD 13x6 Body Wave Unit",
        cta: "Explore Wig Bar",
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=85"
      }
    },
    {
      id: "Skincare",
      label: "Skincare",
      subcategories: [
        "Glass Skin Barrier Serums",
        "Rosewater & Peptide Toners",
        "Ceramide Cloud Creams",
        "AHA/BHA Glow Exfoliants",
        "24K Gold Hydrogel Eye Masks",
        "SPF 50 Invisible Dew Drops"
      ],
      concerns: ["Hydration & Glass Skin", "Brightening & Glow", "Sensitive Barrier"],
      featured: {
        tag: "Derm-Approved Luxury",
        title: "Damask Rose & Peptide Dew Serum",
        cta: "Shop Skincare",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=85"
      }
    },
    {
      id: "Makeup",
      label: "Makeup",
      subcategories: [
        "Peptide Plumping Lip Oils",
        "Liquid Silk Cloud Blushes",
        "Soft-Focus Setting Powders",
        "Faux Mink & Wispy Lash Clusters",
        "Luminous Skin Tints",
        "Waterproof Lip Liners"
      ],
      concerns: ["Hydration & Glass Skin", "Long-Wear Matte & Dew"],
      featured: {
        tag: "Viral on TikTok & IG",
        title: "Rosé Glaze Peptide Lip Oil",
        cta: "Shop Makeup",
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=85"
      }
    },
    {
      id: "Tools & Accessories",
      label: "Tools & Accessories",
      subcategories: [
        "450°F Titanium Silk-Press Irons",
        "Ionic High-Speed Hair Dryers",
        "Hot Combs & Lace Melt Bands",
        "22-Momme Mulberry Silk Bonnets",
        "Detangling Boar Bristle Brushes",
        "Salon Sectioning Clips"
      ],
      concerns: ["High-Heat Styling", "HD Lace & Melt", "4C & Coily"],
      featured: {
        tag: "Pro Stylist Essential",
        title: "Champagne Titanium Silk-Press Iron",
        cta: "Shop Pro Tools",
        image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=85"
      }
    }
  ],

  /* 2. Instagram Story / Arch Category Highlights */
  categoryStories: [
    {
      id: "Wigs & Extensions",
      title: "HD Lace & Bundles",
      subtitle: "420+ Units In-Store",
      image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=85"
    },
    {
      id: "Hair Care",
      title: "Honey & Curl Care",
      subtitle: "Elixirs, Masks & Gels",
      image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=85"
    },
    {
      id: "Makeup",
      title: "Lip Oils & Flush",
      subtitle: "Glossier-Inspired Dew",
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=85"
    },
    {
      id: "Skincare",
      title: "Glass Skin Rituals",
      subtitle: "Peptides & Rose Barrier",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=85"
    },
    {
      id: "Tools & Accessories",
      title: "Silk-Press & Bonnets",
      subtitle: "Titanium Irons & Silk",
      image: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?auto=format&fit=crop&w=600&q=85"
    },
    {
      id: "Low Stock",
      title: "Selling Fast In-Store",
      subtitle: "Live Toast POS Alerts",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=85"
    }
  ],

  /* 3. Rich Beauty Supply Product Catalog (Simulated POS Sync) */
  products: [
    {
      id: "prod-01",
      sku: "TST-HAIR-1042",
      name: "Miel & Rose Infused Hair Elixir Oil",
      brand: "Miel & Silk",
      category: "Hair Care",
      concern: "Frizz & Humidity Shield",
      price: 44.00,
      compareAtPrice: 52.00,
      rating: 4.9,
      reviews: 618,
      badge: " No.1 Bestseller",
      bestseller: true,
      trendingInStore: true,
      newArrival: false,
      stockStatus: "in_stock",
      stockCount: 19,
      aisle: "Aisle 2 • Shelf B4",
      variantType: "Size",
      variants: [
        { label: "50ml Standard Dropper", price: 44.00, skuSuffix: "50ML" },
        { label: "100ml Salon Value", price: 72.00, skuSuffix: "100ML" },
        { label: "15ml Travel Purse Mini", price: 22.00, skuSuffix: "15ML" }
      ],
      image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=85",
      hoverImage: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=85"
      ],
      shortDesc: "Cold-pressed wildflower honey, French rosehip oil, and hydrolyzed silk proteins deliver mirror-like shine without weighing down silk presses or raw bundles.",
      ingredients: "Prunus Amygdalus Dulcis (Sweet Almond) Oil, Mel (Wildflower Honey) Extract, Rosa Canina Fruit Oil, Hydrolyzed Silk, Argania Spinosa Kernel Oil, Tocopherol (Vitamin E).",
      howToUse: "Apply 2–3 drops to damp or dry mid-lengths and ends. Ideal as a finishing gloss after flat-ironing or to revive human hair wigs and bundles between washes."
    },
    {
      id: "prod-02",
      sku: "TST-WIG-8801",
      name: "13x6 Swiss HD Lace Front Wig — Raw Body Wave",
      brand: "Velvet Lace Co.",
      category: "Wigs & Extensions",
      concern: "HD Lace & Melt",
      price: 345.00,
      compareAtPrice: 410.00,
      rating: 5.0,
      reviews: 312,
      badge: "Wig Bar Icon",
      bestseller: true,
      trendingInStore: true,
      newArrival: false,
      stockStatus: "low_stock",
      stockCount: 2,
      aisle: "Wig Vault • Case 04",
      variantType: "Length & Density",
      variants: [
        { label: "20\" • 180% Density", price: 295.00, skuSuffix: "20IN" },
        { label: "24\" • 200% Density", price: 345.00, skuSuffix: "24IN" },
        { label: "28\" • 200% Density", price: 395.00, skuSuffix: "28IN" },
        { label: "30\" • 250% Luxury Full", price: 445.00, skuSuffix: "30IN" }
      ],
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=85",
      hoverImage: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=900&q=85"
      ],
      shortDesc: "Ultra-thin 0.10mm Swiss HD lace with pre-plucked baby hairs, bleached invisible knots, and 100% unprocessed single-donor Virgin hair that lifts cleanly to #613.",
      ingredients: "100% Unprocessed Single-Donor Human Hair, Authentic Swiss 13x6 HD Lace, Adjustable Glueless Elastic Band + Removable Combs.",
      howToUse: "Tint lace with Velvet Lace Melt Spray if needed. Secure glueless band or apply a thin layer of Rosélia Melt Adhesive along the hairline and tie down with our Silk Melt Band for 10 minutes."
    },
    {
      id: "prod-03",
      sku: "TST-MKP-2094",
      name: "Rosé Glaze Peptide Plumping Lip Treatment Oil",
      brand: "CloudBlush",
      category: "Makeup",
      concern: "Hydration & Glass Skin",
      price: 24.00,
      compareAtPrice: null,
      rating: 4.9,
      reviews: 894,
      badge: "Viral Hit",
      bestseller: true,
      trendingInStore: true,
      newArrival: true,
      stockStatus: "in_stock",
      stockCount: 46,
      aisle: "Front Beauty Bar • Bin 1A",
      variantType: "Shade",
      variants: [
        { label: "Ballet Slipper (Sheer Pink)", hex: "#F7BDC8", price: 24.00, skuSuffix: "BALLET" },
        { label: "Spiced Mauve (Warm Rosewood)", hex: "#A85D6B", price: 24.00, skuSuffix: "MAUVE" },
        { label: "Guava Jam (Vibrant Rose)", hex: "#E05780", price: 24.00, skuSuffix: "GUAVA" },
        { label: "Honey Champagne (24K Shimmer)", hex: "#E4C389", price: 24.00, skuSuffix: "HONEY" },
        { label: "Espresso Glaze (Rich Cocoa)", hex: "#4D2E2B", price: 24.00, skuSuffix: "ESPRESSO" }
      ],
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=85",
      hoverImage: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85"
      ],
      shortDesc: "Cushiony, non-sticky lip oil-gloss hybrid powered by Palmitoyl Tripeptide-1, cloudberry seed oil, and botanical squalane for high-shine glass lips.",
      ingredients: "Hydrogenated Polyisobutene, Squalane, Rubus Chamaemorus (Cloudberry) Seed Oil, Palmitoyl Tripeptide-1, Butyrospermum Parkii (Shea) Butter.",
      howToUse: "Swipe plush doe-foot applicator generously over bare lips or layer over lip liner for an instant cushiony, mirror-glazed finish."
    },
    {
      id: "prod-04",
      sku: "TST-TOOL-4410",
      name: "Champagne Titanium 450°F Digital Silk-Press Flat Iron",
      brand: "Aura Tools",
      category: "Tools & Accessories",
      concern: "High-Heat Styling",
      price: 168.00,
      compareAtPrice: 195.00,
      rating: 4.9,
      reviews: 405,
      badge: "Low Stock Alert",
      bestseller: true,
      trendingInStore: true,
      newArrival: false,
      stockStatus: "low_stock",
      stockCount: 2,
      aisle: "Aisle 5 • Pro Appliances",
      variantType: "Plate Width",
      variants: [
        { label: "1.0\" Precision Silk-Press Plate", price: 168.00, skuSuffix: "100IN" },
        { label: "1.5\" Wide Bundle & Long Hair Plate", price: 178.00, skuSuffix: "150IN" }
      ],
      image: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?auto=format&fit=crop&w=800&q=85",
      hoverImage: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1522338140262-f46f5913618a?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=900&q=85"
      ],
      shortDesc: "One-pass mirror-finish titanium floating plates with negative-ion generator. Engineered specifically for 4C silk presses and bone-straight HD wig styling.",
      ingredients: "Aircraft-Grade Rose-Gold Titanium Floating Plates, Dual-Voltage Ceramic MCH Heater (15-second heat up), 9ft 360° Swivel Cord.",
      howToUse: "Mist hair with heat protectant. Use the chase method with a carbon fine-tooth comb at 380°F–430°F for a humidity-resistant silk press."
    },
    {
      id: "prod-05",
      sku: "TST-HAIR-3019",
      name: "Velvet Hold 48-Hour Lace Melt & Edge Sculpting Pomade",
      brand: "Rosélia Atelier",
      category: "Hair Care",
      concern: "4C & Coily",
      price: 18.00,
      compareAtPrice: 22.00,
      rating: 4.8,
      reviews: 1120,
      badge: "Sold Out In-Store",
      bestseller: true,
      trendingInStore: false,
      newArrival: false,
      stockStatus: "out_of_stock",
      stockCount: 0,
      aisle: "Aisle 1 • Edge Bar",
      variantType: "Scent & Finish",
      variants: [
        { label: "White Peach & Rose (Clear Zero-Flake)", price: 18.00, skuSuffix: "PEACH" },
        { label: "Black Castor Infused (Tinted Dark)", price: 19.00, skuSuffix: "CASTOR" }
      ],
      image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=85",
      hoverImage: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85"
      ],
      shortDesc: "Sweat-proof, humidity-resistant edge & baby hair sculpting gel fortified with biotin and Jamaican black castor oil. Zero white residue on 4C hair or HD lace.",
      ingredients: "Aqua, Ceteareth-25, PEG-7 Glyceryl Cocoate, Ricinus Communis (Castor) Seed Oil, Biotin, Hydrolyzed Wheat Protein, Rosa Damascena Flower Water.",
      howToUse: "Scoop a dime-sized amount using our Dual-Ended Edge Brush. Swoop baby hairs and wrap with a satin melt band for 5 minutes."
    },
    {
      id: "prod-06",
      sku: "TST-SKIN-5120",
      name: "Damask Rose & Multi-Peptide Glass Skin Barrier Serum",
      brand: "Lumière Skin",
      category: "Skincare",
      concern: "Hydration & Glass Skin",
      price: 58.00,
      compareAtPrice: 68.00,
      rating: 4.9,
      reviews: 472,
      badge: "New Arrival",
      bestseller: true,
      trendingInStore: true,
      newArrival: true,
      stockStatus: "in_stock",
      stockCount: 27,
      aisle: "Aisle 3 • Skincare Sanctuary",
      variantType: "Size",
      variants: [
        { label: "30ml Glass Bottle", price: 58.00, skuSuffix: "30ML" },
        { label: "50ml Jumbo Refillable", price: 84.00, skuSuffix: "50ML" }
      ],
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=85",
      hoverImage: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=85"
      ],
      shortDesc: "5% Niacinamide, Copper Tripeptides, and Bulgarian Damask Rose water drench skin in weightless hydration for an instant lit-from-within bounce.",
      ingredients: "Rosa Damascena Flower Water, Niacinamide, Glycerin, Copper Tripeptide-1, Sodium Hyaluronate, Panthenol, Centella Asiatica Extract.",
      howToUse: "Press 3–4 drops into damp skin morning and night before moisturizer or as a luminous primer before makeup."
    },
    {
      id: "prod-07",
      sku: "TST-WIG-7731",
      name: "Raw Vietnamese Single-Donor Bone Straight 3-Bundle Deal",
      brand: "Velvet Lace Co.",
      category: "Wigs & Extensions",
      concern: "Wavy & Straight",
      price: 280.00,
      compareAtPrice: 330.00,
      rating: 5.0,
      reviews: 229,
      badge: "Stylist Favorite",
      bestseller: true,
      trendingInStore: true,
      newArrival: false,
      stockStatus: "in_stock",
      stockCount: 11,
      aisle: "Wig Vault • Wall B",
      variantType: "Bundle Lengths",
      variants: [
        { label: "18\" / 20\" / 22\" (300g Total)", price: 280.00, skuSuffix: "182022" },
        { label: "22\" / 24\" / 26\" (300g Total)", price: 335.00, skuSuffix: "222426" },
        { label: "26\" / 28\" / 30\" (300g Total)", price: 390.00, skuSuffix: "262830" }
      ],
      image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=85",
      hoverImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85"
      ],
      shortDesc: "Cuticle-aligned, double-drawn raw Vietnamese human hair bundles. Naturally lustrous from root to tip and lasts 3–5+ years with proper care.",
      ingredients: "100% Unprocessed Raw Vietnamese Human Hair (3x 100g Double-Weft Bundles, Natural 1B Off-Black).",
      howToUse: "Co-wash with sulfate-free conditioner prior to sew-in, quick-weave, or custom wig construction. Seal wefts if cutting."
    },
    {
      id: "prod-08",
      sku: "TST-MKP-6310",
      name: "Cloud Soufflé Liquid Silk Cheek & Lip Flush",
      brand: "CloudBlush",
      category: "Makeup",
      concern: "Hydration & Glass Skin",
      price: 26.00,
      compareAtPrice: null,
      rating: 4.8,
      reviews: 531,
      badge: "New Shade",
      bestseller: false,
      trendingInStore: true,
      newArrival: true,
      stockStatus: "low_stock",
      stockCount: 2,
      aisle: "Front Beauty Bar • Bin 2C",
      variantType: "Shade",
      variants: [
        { label: "Chiffon Pink (Cool Baby Pink)", hex: "#F4ACB7", price: 26.00, skuSuffix: "CHIFFON" },
        { label: "Peony Flush (Vibrant Rose)", hex: "#E05780", price: 26.00, skuSuffix: "PEONY" },
        { label: "Terracotta Silk (Warm Berry)", hex: "#B54D5B", price: 26.00, skuSuffix: "BERRY" }
      ],
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=85",
      hoverImage: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=85"
      ],
      shortDesc: "Weightless whipped serum-blush that melts seamlessly into skin for a diffused, watercolor flush that never disturbs foundation.",
      ingredients: "Dimethicone, Aqua, Squalane, Nelumbo Nucifera (Lotus) Flower Extract, Synthetic Fluorphlogopite, Tocopheryl Acetate.",
      howToUse: "Tap 1–2 micro-dots onto the apples of cheeks and blend upward with fingertips or a stippling brush."
    },
    {
      id: "prod-09",
      sku: "TST-HAIR-9921",
      name: "KeraLuxe Bond-Rebuilding Collagen & Silk Hair Masque",
      brand: "KeraLuxe Pro",
      category: "Hair Care",
      concern: "Color-Treated / Bond Repair",
      price: 38.00,
      compareAtPrice: 46.00,
      rating: 4.9,
      reviews: 389,
      badge: "Bleach Rescue",
      bestseller: true,
      trendingInStore: false,
      newArrival: false,
      stockStatus: "in_stock",
      stockCount: 15,
      aisle: "Aisle 2 • Shelf A1",
      variantType: "Size",
      variants: [
        { label: "250ml Luxury Jar", price: 38.00, skuSuffix: "250ML" },
        { label: "500ml Backbar Tub", price: 62.00, skuSuffix: "500ML" }
      ],
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=85",
      hoverImage: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85"
      ],
      shortDesc: "Intensive disulfide bond-multiplying mask that restores elasticity and softness to #613 blonde wigs, color-treated curls, and heat-stressed strands in 10 minutes.",
      ingredients: "Aqua, Cetearyl Alcohol, Bis-Aminopropyl Diglycol Dimaleate, Hydrolyzed Collagen, Silk Amino Acids, Butyrospermum Parkii Butter.",
      howToUse: "After shampooing, work generously from roots to ends. Comb through with a wide-tooth shower comb and leave on for 10–15 minutes under a thermal cap."
    },
    {
      id: "prod-10",
      sku: "TST-TOOL-1180",
      name: "22-Momme Mulberry Silk Double-Lined Wig & Curl Bonnet",
      brand: "Rosélia Atelier",
      category: "Tools & Accessories",
      concern: "4C & Coily",
      price: 36.00,
      compareAtPrice: 44.00,
      rating: 4.9,
      reviews: 740,
      badge: "Nightly Essential",
      bestseller: false,
      trendingInStore: true,
      newArrival: true,
      stockStatus: "in_stock",
      stockCount: 31,
      aisle: "Aisle 4 • Silk & Accessories",
      variantType: "Shade",
      variants: [
        { label: "Soft Blush Pink (#FFF0F3)", hex: "#FFF0F3", price: 36.00, skuSuffix: "BLUSH" },
        { label: "Dusty Rose (#F4ACB7)", hex: "#F4ACB7", price: 36.00, skuSuffix: "ROSE" },
        { label: "Champagne Gold (#D4AF37)", hex: "#D4AF37", price: 36.00, skuSuffix: "GOLD" },
        { label: "Deep Espresso (#2B2123)", hex: "#2B2123", price: 36.00, skuSuffix: "ESPRESSO" }
      ],
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=85",
      hoverImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85"
      ],
      shortDesc: "OEKO-TEX certified 6A grade 22-momme Mulberry silk with a wide lay-flat satin edge band that protects laid edges, braids, and 30-inch bundles overnight.",
      ingredients: "100% Grade 6A 22-Momme Pure Mulberry Silk Interior & Exterior, Non-Slip Stretch Satin Edge Tie Band.",
      howToUse: "Gather hair loosely at the crown, slip bonnet over ears and hairline, and tie the flat stretch band gently around the perimeter to keep edges laid."
    },
    {
      id: "prod-11",
      sku: "TST-SKIN-8204",
      name: "Ceramide & Rosewater Whipped Barrier Cloud Cream",
      brand: "Lumière Skin",
      category: "Skincare",
      concern: "Hydration & Glass Skin",
      price: 48.00,
      compareAtPrice: null,
      rating: 4.8,
      reviews: 264,
      badge: "Clean Beauty",
      bestseller: false,
      trendingInStore: false,
      newArrival: true,
      stockStatus: "out_of_stock",
      stockCount: 0,
      aisle: "Aisle 3 • Skincare Sanctuary",
      variantType: "Size",
      variants: [
        { label: "50ml Refillable Jar", price: 48.00, skuSuffix: "50ML" },
        { label: "50ml Pod Refill Cartridge", price: 39.00, skuSuffix: "REFILL" }
      ],
      image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=85",
      hoverImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85"
      ],
      shortDesc: "Biomimetic 5-Ceramide complex and French rosewater lock in 72-hour moisture and calm redness without clogging pores.",
      ingredients: "Aqua, Rosa Centifolia Flower Water, Ceramide NP, Ceramide AP, Ceramide EOP, Cholesterol, Phytosphingosine, Squalane.",
      howToUse: "Warm a pearl-sized scoop between fingertips and press gently onto face and neck after serum."
    },
    {
      id: "prod-12",
      sku: "TST-WIG-5509",
      name: "Invisible Melt Lace Tint Mousse & Adhesive Spray Duo",
      brand: "Velvet Lace Co.",
      category: "Wigs & Extensions",
      concern: "HD Lace & Melt",
      price: 32.00,
      compareAtPrice: 38.00,
      rating: 4.9,
      reviews: 512,
      badge: "Glueless Kit",
      bestseller: true,
      trendingInStore: true,
      newArrival: false,
      stockStatus: "in_stock",
      stockCount: 24,
      aisle: "Aisle 1 • Lace & Melt Bar",
      variantType: "Lace Tint Shade",
      variants: [
        { label: "Warm Honey / Light Tan", hex: "#D6A17A", price: 32.00, skuSuffix: "HONEY" },
        { label: "Caramel / Medium Brown", hex: "#A66A43", price: 32.00, skuSuffix: "CARAMEL" },
        { label: "Rich Espresso / Deep Brown", hex: "#5C3624", price: 32.00, skuSuffix: "ESPRESSO" }
      ],
      image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=85",
      hoverImage: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=85"
      ],
      shortDesc: "Micro-foaming lace tint mousse matches your exact scalp undertone in 60 seconds, paired with our water-soluble, sweat-resistant Glueless Lace Melt Spray.",
      ingredients: "Acrylates/Octylacrylamide Copolymer, Alcohol Denat., Biotin, Panthenol, Iron Oxides (CI 77491, CI 77492, CI 77499).",
      howToUse: "Dab tint mousse along the inside of your HD or transparent lace, blow-dry cool for 30s, then mist Melt Spray along hairline and tie down."
    }
  ],

  /* 4. Instagram Community "Shop the Look" Feed */
  communityLooks: [
    {
      id: "look-01",
      handle: "@maya.luxehair",
      caption: "24\" Swiss HD Body Wave melted with the Invisible Melt Duo + Miel Elixir for that glass hair bounce ✨",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=85",
      productIds: ["prod-02", "prod-01", "prod-12"]
    },
    {
      id: "look-02",
      handle: "@chloeglows",
      caption: "Morning glass skin prep with the Damask Rose Peptide Serum & Guava Jam Lip Treatment Oil 🌷",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=85",
      productIds: ["prod-06", "prod-03", "prod-08"]
    },
    {
      id: "look-03",
      handle: "@silkpress.diary",
      caption: "One pass at 410°F with the Champagne Titanium Flat Iron + 2 drops of Miel & Rose Elixir. Humidity who?",
      image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=700&q=85",
      productIds: ["prod-04", "prod-01", "prod-10"]
    },
    {
      id: "look-04",
      handle: "@roseliabeauty.soho",
      caption: "Inside our SoHo Wig & Beauty Bar — order online with 1-Hour Toast POS Shelf Verification 🥂",
      image: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?auto=format&fit=crop&w=700&q=85",
      productIds: ["prod-07", "prod-09", "prod-05"]
    }
  ]
};
