export const initialProducts = [
  {
    name: "Fresh Organic Hass Avocados (Pack of 3)",
    description: "Hand-picked, perfectly ripe Hass avocados rich in healthy fats and potassium. Ideal for avocado toast, salads, and guacamole.",
    price: 4.99,
    category: "Fruits & Vegetables",
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    numReviews: 42,
    featured: true
  },
  {
    name: "Wild Organic Blueberries (300g)",
    description: "Plump, antioxidant-rich organic wild blueberries bursting with natural sweetness. Freshly packed daily.",
    price: 5.49,
    category: "Fruits & Vegetables",
    stock: 18,
    imageUrl: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    numReviews: 56,
    featured: true
  },
  {
    name: "Organic Whole Milk (1 Gallon)",
    description: "Farm-fresh, pasteurized grade-A whole milk from pasture-raised grass-fed dairy cows. No artificial hormones.",
    price: 3.89,
    category: "Dairy & Eggs",
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    numReviews: 88,
    featured: false
  },
  {
    name: "Pasture-Raised Brown Eggs (Dozen)",
    description: "Large grade-A organic brown eggs with rich golden yolks. Collected from free-roaming hens with high welfare standards.",
    price: 4.29,
    category: "Dairy & Eggs",
    stock: 22,
    imageUrl: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    numReviews: 114,
    featured: true
  },
  {
    name: "Artisan Sourdough Boule",
    description: "Naturally fermented sourdough loaf with a crispy caramelized crust and airy, soft interior. Baked fresh every morning.",
    price: 6.25,
    category: "Bakery",
    stock: 14,
    imageUrl: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    numReviews: 67,
    featured: true
  },
  {
    name: "Golden Flaky Butter Croissants (Pack of 4)",
    description: "Authentic French-style butter croissants with hundreds of delicate, buttery layers. Perfect warm with jam.",
    price: 5.99,
    category: "Bakery",
    stock: 12,
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
    numReviews: 31,
    featured: false
  },
  {
    name: "Cold-Pressed Valencia Orange Juice (1L)",
    description: "100% pure cold-pressed orange juice with gentle pulp. No added sugars, preservatives, or concentrates.",
    price: 4.79,
    category: "Beverages",
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    numReviews: 29,
    featured: false
  },
  {
    name: "Ceremonial Japanese Matcha Tea (50g)",
    description: "First-harvest ceremonial grade organic green tea powder from Uji, Kyoto. Smooth, vibrant green with rich umami.",
    price: 18.50,
    category: "Beverages",
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    numReviews: 92,
    featured: true
  },
  {
    name: "Roasted Sea Salt & Almond Dark Chocolate (85g)",
    description: "Fair-trade 72% Ecuadorian dark chocolate with roasted California almonds and a touch of Maldon sea salt flakes.",
    price: 3.99,
    category: "Snacks & Organic",
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    numReviews: 45,
    featured: false
  },
  {
    name: "Raw Organic Forest Honey (500g)",
    description: "Unfiltered, unpasteurized pure honey harvested from mountain wildflowers. Retains natural pollen and enzymes.",
    price: 8.95,
    category: "Snacks & Organic",
    stock: 19,
    imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    numReviews: 73,
    featured: true
  },
  {
    name: "Crisp Royal Gala Apples (1kg)",
    description: "Sweet, crunchy and aromatic Gala apples grown sustainably in regional orchards. Washed and ready to eat.",
    price: 3.49,
    category: "Fruits & Vegetables",
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
    numReviews: 38,
    featured: false
  },
  {
    name: "Artisan Aged Cheddar Cheese (250g)",
    description: "Sharp white cheddar naturally aged for 18 months. Crumbly texture with complex nutty undertones.",
    price: 6.99,
    category: "Dairy & Eggs",
    stock: 16,
    imageUrl: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    numReviews: 51,
    featured: false
  }
];

export const initialUsers = [
  {
    name: "Store Administrator",
    email: "admin@store.com",
    password: "admin123", // Will be hashed
    role: "admin"
  },
  {
    name: "Jane Customer",
    email: "user@store.com",
    password: "user123", // Will be hashed
    role: "user"
  }
];
