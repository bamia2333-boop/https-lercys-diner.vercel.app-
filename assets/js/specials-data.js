/* ==========================================================================
   LERCY'S DINER — DAILY SPECIALS DATA
   --------------------------------------------------------------------------
   THIS IS THE ONLY FILE STAFF NEED TO EDIT TO CHANGE THE DAILY MENU.
   You do not need to touch any layout, HTML or CSS to update a special.

   HOW TO EDIT
   -----------
   1. Find the weekday you want to change (monday ... sunday).
   2. Edit the `entrees` list — add or remove items between the quotes.
      Each item must end with a comma, except the last one.
   3. Save the file and refresh the website. That's it.

   RULES
   -----
   - `entrees` is the steam-table line for that day.
   - `sides` are the same every day unless you set them below.
   - Never add a price here unless it has been confirmed. Leave `price: ""`
     and the site will simply not show a price for that item.
   - The website automatically shows "Today on the line" on the homepage
     using the correct day. Nothing else needs updating.

   Last updated: 2025 — see VERIFY notes in README.md
   ========================================================================== */

window.LERCYS_SPECIALS = {

  /* ---- The everyday offer (confirmed from the restaurant's chalkboard) ---- */
  combo: {
    name: "Special Combo Plate Lunch",
    price: "$14.99",
    drinkPrice: "$2.99",
    includes: [
      "1 entrée",
      "2 starches / vegetables",
      "1 bread of choice",
      "1 dessert"
    ],
    note: "Dessert and drink are part of the deal — that's the whole point."
  },

  /* ---- Sides, breads and desserts available on the line every day ---- */
  sides: [
    "Mashed Potatoes", "Rice", "Corn", "Green Beans", "Macaroni & Cheese",
    "Twice Baked Potatoes", "Fried Okra", "Lima Beans", "Turnip Greens",
    "Cabbage", "Navy Beans", "Sweet Potato Casserole",
    "Broccoli Rice Casserole", "Black Eyed Peas"
  ],

  breads: ["Rolls", "Cornbread", "Jalapeño Cornbread"],

  desserts: [
    "Bread Pudding", "Banana Pudding", "Peach Cobbler", "Chocolate Surprise",
    "Chocolate Cake", "German Chocolate Cake", "Red Velvet Cake", "Lemon Cake"
  ],

  /* ---- Day by day -------------------------------------------------------
     VERIFY: this rotation was reconstructed from public listing data and the
     restaurant's own menu board. Confirm with the owners before launch.
     ---------------------------------------------------------------------- */
  days: {

    monday: {
      label: "Monday",
      entrees: ["Fried Catfish"]
    },

    tuesday: {
      label: "Tuesday",
      entrees: ["Liver & Onions", "Stuffed Bell Peppers"]
    },

    wednesday: {
      label: "Wednesday",
      entrees: ["Smothered Pork Ribs"]
    },

    thursday: {
      label: "Thursday",
      entrees: [
        "Chicken Fried Steak",
        "Chicken Fried Chicken",
        "Baked Chicken",
        "Beef Tips",
        "Stuffed Bell Peppers"
      ]
    },

    friday: {
      label: "Friday",
      entrees: [
        "Chicken Fried Steak",
        "Chicken Fried Chicken",
        "Baked Chicken",
        "Chicken Spaghetti",
        "Fried Catfish"
      ]
    },

    /* Saturday is closed. Leave this empty. */
    saturday: {
      label: "Saturday",
      closed: true,
      entrees: []
    },

    /* VERIFY: Sunday service was added after opening. */
    sunday: {
      label: "Sunday",
      entrees: [
        "Meatloaf",
        "Fried Catfish",
        "Beef Tips",
        "Chicken Fried Chicken",
        "Chicken Fried Steak",
        "Baked Chicken"
      ]
    }
  }
};
