# MISSING INFORMATION — owner approval required before launch

Everything on this list is either **unverified**, **assumed**, or **not yet supplied**.
Nothing here was invented — where a fact couldn't be confirmed, the site renders a
placeholder and flags it with an HTML comment `<!-- VERIFY -->` in the source.

Search the codebase for `VERIFY` to find every flagged spot:

```bash
grep -rn "VERIFY" *.html assets/ README.md
```

---

## 1. Sunday hours — CONFIRM

**Status:** rendered as 10:30 AM – 2:00 PM
**Risk:** Medium

Sunday service was added *after* the May 2025 opening, and public listings disagree.
Yelp and MapQuest show Sunday open; Google's listing historically showed it closed.
The site currently shows Sunday as **open**.

**Action:** confirm the current Sunday hours. If closed, remove the Sunday row from
the hours tables in `index.html`, `visit.html`, and the `HOURS` object at the top of
`assets/js/main.js`, plus the `openingHoursSpecification` block in the JSON-LD.

---

## 2. Daily special rotation — CONFIRM

**Status:** reconstructed from public listings and the printed menu board
**Risk:** Medium

The Mon/Tue/Wed/Thu/Fri rotation in `assets/js/specials-data.js` was assembled from
listing data and the restaurant's own board — but the restaurant posts the day's line
fresh each morning on Facebook, and it changes. Treat the current rotation as a
*typical* week, not a guarantee.

**Action:** have the owner read through `assets/js/specials-data.js` and correct it.
It's a plain text file — they can edit it themselves.

---

## 3. Contact form recipient — NOT WIRED

**Status:** deliberately non-functional
**Risk:** High — a form that silently drops messages is worse than no form

There is **no confirmed email address** for Lercy's Diner anywhere in public sources.
The form on `visit.html` therefore does **not** pretend to send. When submitted, it
displays: *"This form is not connected to an inbox yet. Please call (409) 229-7037."*

**Action:** choose one:

- **Formspree** — sign up, then add `action="https://formspree.io/f/YOUR_ID" method="POST"`
  to the `<form>` tag in `visit.html` and remove the JS handler in `main.js` (`initForm`).
- **Netlify Forms** — add `netlify` and `name="contact"` attributes to the `<form>` tag.
- **mailto:** — change `action` to `mailto:their@email.com` (crude but zero setup).
- **Remove the form** and keep the phone number as the only contact route.

Do **not** leave it as-is on a live site.

---

## 4. Reservations — CONFIRM

**Status:** assumed walk-in only
**Risk:** Low

The FAQ says "We're walk-in only." No source confirms they take reservations, and a
cafeteria-style diner almost certainly doesn't.

**Action:** confirm, or delete that FAQ entry.

---

## 5. Logo — NOT SUPPLIED

**Status:** text-based logo with a lettered badge
**Risk:** Low

There is no vector logo or high-resolution logo file anywhere public — only the round
badge on their Facebook avatar. The site currently uses a text wordmark plus an "L"
badge in a burgundy circle, and a matching inline-SVG favicon.

**Action:** ask the owner for their logo file (SVG or PNG). If supplied, replace the
`.brand__badge` span in each page's header and update the favicon `<link>` in the
`<head>`.

---

## 6. Exterior / storefront photo — NOT AVAILABLE

**Status:** no such photo exists in any public source
**Risk:** Low

The gallery has no exterior shot because none was found. The gallery filter for
"Exterior & Location" was therefore **not built** — showing an empty filter would be
worse than omitting it.

**Action:** the owner photographs the storefront and sign, then add them to
`images/` and add a filter button + items to `gallery.html`.

---

## 7. Burger, dessert and drink photos — NOT AVAILABLE

**Status:** text-only cards
**Risk:** Low

The **Lercy Burger** signature card on the homepage is a text card with a note
reading *"Owner photo pending"* — deliberately, rather than faking it with a stock
photo. Same for desserts and drinks, which have no photography.

**Action:** photograph the Lercy Burger, bread pudding, banana pudding, peach cobbler
and the tea station. The owner has a burger video on Facebook that would work as a
still frame.

---

## 8. Owner and staff photographs — NOT SUPPLIED

**Status:** the About page uses venue and food photos only
**Risk:** Medium — needs consent

The About page tells Joy and Mark's story but shows no portrait of them. A published
press photo of Joy Cooper exists (The Daily News, Galveston County, credit
*STUART VILLANUEVA*), but it was not used because press photos require a licence.

**Action:** get portraits directly from the owners, with their written consent to
publish. Then add to the About page's story grid.

---

## 9. Photo permissions — ACTION REQUIRED

**Status:** 12 images sourced from third-party public listings
**Risk:** **High for a commercial launch**

The images in `images/` come from food-menu.net, menu-world.com and a KGTX 7 News
banner. Some were uploaded by customers. **Lercy's Diner may not own the rights to
all of them.**

**Action:** before going live, either get written permission from Lercy's Diner, or
replace them with the owners' own photography. See the asset manifest below.

---

## 10. Primary ordering partner — PICK ONE

**Status:** all four partners given equal weight
**Risk:** Low

Uber Eats, DoorDash, Seamless and Postmates are all linked. If the restaurant prefers
one (or has a better commercial arrangement with one), that should be the single
primary "Order Online" button in the header, with the rest on `order.html`.

**Action:** confirm the preferred partner.

---

## 11. Catering — NOT CONFIRMED

**Status:** mentioned in the contact form copy only
**Risk:** Low

The contact form says "Questions or catering" but no source confirms Lercy's offers
catering. No catering page was built.

**Action:** confirm whether they cater. If yes, build a dedicated page. If no, change
the form heading to just "Send us a note."

---

## 12. Domain name — PLACEHOLDER

**Status:** `https://www.lercysdinertexascity.com` used throughout
**Risk:** Medium — affects SEO

This domain is a **placeholder**. It appears in `robots.txt`, `sitemap.xml`, every
page's `<link rel="canonical">`, the Open Graph `og:url`, and the JSON-LD `url` and
`hasMenu` fields.

**Action:** replace with the real domain before deploying. A find-and-replace across
`*.html`, `robots.txt` and `sitemap.xml` handles it.

---

## 13. Accessibility features — CONFIRM

**Status:** assumed accessible entrance
**Risk:** Low

The Visit page claims an accessible entrance and seating, flagged with `<!-- VERIFY -->`.

**Action:** confirm, or remove that line.

---

## Asset manifest

| File | Source | Shows | Permission status |
|---|---|---|---|
| `steam-table-1` | food-menu.net | Steam-table line + Gather Dine Eat mural | UNCONFIRMED — replace |
| `steam-table-2` | food-menu.net | Dining room + chicken fried steak plate | UNCONFIRMED — replace |
| `steam-table-3` | food-menu.net | Dining room + chicken fried steak tray | UNCONFIRMED — replace |
| `steam-table-4` | food-menu.net | Tea urns + fried catfish + specials board | UNCONFIRMED — replace |
| `steam-table-5` | food-menu.net | Combo plate + $14.99 chalkboard + notice sign | UNCONFIRMED — replace |
| `steam-table-6` | food-menu.net | Mural seating + lunch tray | UNCONFIRMED — replace |
| `combo-chalkboard` | derived | Crop of `steam-table-5` | Same as source |
| `dining-room` | menu-world.com | Dining room + Texas A&M flags | UNCONFIRMED — replace |
| `buffet-tray` | menu-world.com | Steam tray of chicken spaghetti | UNCONFIRMED — replace |
| `catfish-plate` | menu-world.com | Fried catfish tray | UNCONFIRMED — replace |
| `menu-board` | menu-world.com | Printed Thursday / Friday menu board | UNCONFIRMED — replace |
| `grand-opening` | KGTX 7 News | Grand opening banner, May 27th | PRESS — credit source |

---

## Still to be supplied by the owner

- [ ] Logo file (SVG or high-res PNG)
- [ ] Storefront / exterior photograph
- [ ] Signage photograph
- [ ] Lercy Burger photograph
- [ ] Dessert photographs (bread pudding, banana pudding, peach cobbler)
- [ ] Drink / tea station photograph
- [ ] Owner portraits (Joy and Mark), with consent
- [ ] Staff photographs, with consent
- [ ] Written permission to use the listed photography, **or** replacements
- [ ] Confirmed email address for the contact form
- [ ] Confirmed Sunday hours
- [ ] Corrected daily special rotation
- [ ] Real domain name
