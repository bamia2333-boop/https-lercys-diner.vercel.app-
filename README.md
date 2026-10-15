# Lercy's Diner — Texas City

Official website for **Lercy's Diner**, 513 6th St N, Texas City, TX 77590 · (409) 229-7037.

A static, dependency-free website. No build step, no framework, no npm install. Open
`index.html` and it runs. Upload the folder to any host and it's live.

---

## Quick start

```bash
# Preview locally (any static server works)
python3 -m http.server 8080
# then open http://localhost:8080
```

That's it. There is nothing to compile.

---

## File map

```
.
├── index.html            Home
├── menu.html             Full menu (3 tabs, search)
├── specials.html         Daily specials (rendered from the data file)
├── about.html            Our story
├── gallery.html          Photo gallery with filters + lightbox
├── reviews.html          Reviews and rating breakdown
├── visit.html            Location, hours, FAQ, contact form
├── order.html            Delivery / pickup / curbside
│
├── assets/
│   ├── css/styles.css    All styling (single stylesheet)
│   └── js/
│       ├── specials-data.js   ← STAFF EDIT THIS FILE ONLY
│       └── main.js            Site behaviour
│
├── images/               All photography (.jpg + .webp pairs)
├── robots.txt
├── sitemap.xml
├── README.md             This file
└── MISSING_INFO.md       Owner approval checklist — read before launch
```

---

## How to update the daily specials

**You never need to touch HTML to change the menu.** Open
`assets/js/specials-data.js` in any text editor and edit the lists.

```js
monday: {
  label: "Monday",
  entrees: ["Fried Catfish"]        // ← add or remove items here
},
```

- Each item needs a comma after it, except the last one in the list.
- Save, refresh the page. Done.
- The homepage "Today on the line" strip and the `/specials` page both read from
  this one file and automatically pick the correct day. Nothing else to update.

Other things you can edit in that same file: the combo price, the sides list,
the breads list, and the desserts list.

---

## How to update prices

Prices for sandwiches, salads, kids items and drinks live in `menu.html`. Search
for the item name and change the text inside `<span class="menu-item__price">`.

The combo plate price appears in **three** places — `index.html`, `menu.html` and
`specials.html` — plus `assets/js/specials-data.js`. If you change it, change all
four, or ask your developer to move it into the data file.

---

## Deploying

Any static host works. The three easiest:

**Netlify** — drag the whole folder onto app.netlify.com/drop. Live in seconds.

**Vercel** — `npx vercel --prod` from inside the folder.

**GitHub Pages** — push the folder to a repo, then Settings → Pages → deploy from
the branch root.

### Before you deploy, do these two things

1. **Set your real domain.** Open `sitemap.xml` and `robots.txt` and replace
   `https://www.lercysdinertexascity.com` with your actual domain. The canonical
   and Open Graph URLs in every HTML file also use this placeholder.
2. **Read `MISSING_INFO.md`** and resolve the flagged items.

---

## What's already built in

- **Live Open/Closed status.** The pill on the homepage and the Visit page computes
  the current time in **America/Chicago**, so it's correct for a visitor in any time
  zone. It says "Open now until 2:00 PM", "Opens today at 10:30 AM", or
  "Closed — opens Monday at 10:30 AM". Today's row is highlighted in the hours table.
- **Restaurant + FAQ structured data** (`Restaurant` and `FAQPage` JSON-LD) on the
  relevant pages, so Google can show rich results.
- **Menu search.** Type "catfish" or "cornbread" on the menu page.
- **Gallery filters and a keyboard-accessible lightbox** (arrow keys, Escape, focus trap).
- **Click-to-copy address** button on the home and visit pages.
- **Responsive** from 320px up. Sticky mobile bar with Call / Directions / Order.
- **Accessibility:** skip link, visible focus rings, real alt text on every image,
  ARIA tabs with arrow-key navigation, `prefers-reduced-motion` respected.
- **Performance:** every photo ships as WebP with a JPEG fallback, below-fold images
  are lazy-loaded, the hero is preloaded. Total image payload ~2.9 MB for 12 photos.

---

## Photo credits and permissions

The photography in `images/` was collected from the restaurant's **public business
listings** (food-menu.net, menu-world.com, and a KGTX 7 News opening-day banner).

**These are not the restaurant's own licensed photographs.** Some were uploaded by
customers. Before a commercial launch you should either:

- get written permission from Lercy's Diner, or
- replace them with the owners' own photography (see `MISSING_INFO.md`).

The grand-opening banner is press material from KGTX 7. If you keep it, credit the
source.

To swap a photo: drop the new file into `images/` using the **same filename**, in both
`.jpg` and `.webp`. The site picks it up with no code changes.

---

## Technical notes for a developer

- **No framework, no dependencies, no build.** Plain HTML, one CSS file, one JS file.
  This was a deliberate choice for a small restaurant: nothing to break, nothing to
  update, nothing to pay for.
- `main.js` is an IIFE with no globals. The hours table lives in the `HOURS` object
  at the top — that's the single source of truth for open/closed logic.
- `specials-data.js` exposes `window.LERCYS_SPECIALS`. It's a plain JS object, not
  JSON, so staff can leave comments in the file.
- All content is server-rendered into static HTML, so it's crawlable and works with
  JavaScript disabled — except the daily specials, which have a `<noscript>` fallback
  telling visitors to call.
- The contact form **does not send anything**. See `MISSING_INFO.md` item 3.
