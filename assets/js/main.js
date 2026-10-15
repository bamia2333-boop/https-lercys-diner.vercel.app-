/* ==========================================================================
   Lercy's Diner — site behaviour
   Vanilla JS. No dependencies.
   Handles: nav, sticky header, open/closed status (America/Chicago),
            today's hours highlight, menu tabs + search + filters,
            gallery filters + lightbox, daily specials rendering,
            scroll reveal.
   ========================================================================== */
(function () {
  "use strict";

  var TZ = "America/Chicago";

  /* ------------------------------------------------------------------
     1. Hours — single source of truth for the whole site
     ------------------------------------------------------------------ */
  var HOURS = {
    0: { label: "Sunday",    open: "10:30", close: "14:00", closed: false },
    1: { label: "Monday",    open: "10:30", close: "14:00", closed: false },
    2: { label: "Tuesday",   open: "10:30", close: "14:00", closed: false },
    3: { label: "Wednesday", open: "10:30", close: "14:00", closed: false },
    4: { label: "Thursday",  open: "10:30", close: "14:00", closed: false },
    5: { label: "Friday",    open: "10:30", close: "14:00", closed: false },
    6: { label: "Saturday",  open: null,     close: null,     closed: true  }
  };

  var DAY_KEYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

  /* Get "now" broken into parts *in Central Time*, regardless of where the
     visitor is. This is what makes the Open/Closed pill correct for a
     customer in another state or country. */
  function centralNow() {
    var fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false
    });
    var parts = {};
    fmt.formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
    var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    var hour = parseInt(parts.hour, 10);
    if (hour === 24) { hour = 0; }
    return {
      day: map[parts.weekday],
      minutes: hour * 60 + parseInt(parts.minute, 10)
    };
  }

  function toMinutes(hhmm) {
    var a = hhmm.split(":");
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  }

  function formatTime(hhmm) {
    var a = hhmm.split(":");
    var h = parseInt(a[0], 10);
    var m = a[1];
    var ap = h >= 12 ? "PM" : "AM";
    var h12 = h % 12; if (h12 === 0) { h12 = 12; }
    return h12 + ":" + m + " " + ap;
  }

  function openStatus() {
    var now = centralNow();
    var today = HOURS[now.day];
    if (today && !today.closed) {
      var o = toMinutes(today.open), c = toMinutes(today.close);
      if (now.minutes >= o && now.minutes < c) {
        return { open: true, text: "Open now until " + formatTime(today.close) };
      }
      if (now.minutes < o) {
        return { open: false, text: "Opens today at " + formatTime(today.open) };
      }
    }
    /* Closed — find the next open day */
    for (var i = 1; i <= 7; i++) {
      var d = (now.day + i) % 7;
      var day = HOURS[d];
      if (day && !day.closed) {
        var when = (i === 1) ? "tomorrow" : day.label;
        return { open: false, text: "Closed — opens " + when + " at " + formatTime(day.open) };
      }
    }
    return { open: false, text: "Closed" };
  }

  /* ------------------------------------------------------------------
     2. Header, nav, sticky state
     ------------------------------------------------------------------ */
  function initHeader() {
    var header = document.querySelector(".site-header");
    var toggle = document.querySelector(".nav__toggle");
    var links = document.getElementById("nav-links");

    if (header) {
      var onScroll = function () {
        header.classList.toggle("is-stuck", window.scrollY > 8);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    if (toggle && links) {
      toggle.addEventListener("click", function () {
        var open = links.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      links.addEventListener("click", function (e) {
        if (e.target.tagName === "A") {
          links.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    /* Mark the current page in the nav */
    var here = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav__links a").forEach(function (a) {
      var target = a.getAttribute("href");
      if (target === here || (here === "index.html" && target === "index.html")) {
        a.setAttribute("aria-current", "page");
      }
    });
  }

  /* ------------------------------------------------------------------
     3. Open / closed pill + today's hours highlight
     ------------------------------------------------------------------ */
  function initStatus() {
    var s = openStatus();
    document.querySelectorAll("[data-status]").forEach(function (el) {
      el.classList.toggle("status--closed", !s.open);
      var dot = el.querySelector(".status__dot");
      el.innerHTML = "";
      if (dot) { el.appendChild(dot); } else {
        var d = document.createElement("span");
        d.className = "status__dot";
        el.appendChild(d);
      }
      el.appendChild(document.createTextNode(s.text));
    });

    var today = centralNow().day;
    document.querySelectorAll("[data-day]").forEach(function (row) {
      row.classList.toggle("is-today", parseInt(row.getAttribute("data-day"), 10) === today);
    });
  }

  /* ------------------------------------------------------------------
     4. Menu tabs
     ------------------------------------------------------------------ */
  function initTabs() {
    var tabs = document.querySelectorAll('[role="tab"]');
    if (!tabs.length) { return; }

    function select(tab) {
      tabs.forEach(function (t) {
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.setAttribute("tabindex", on ? "0" : "-1");
        if (panel) { panel.hidden = !on; }
      });
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab); });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") { next = tabs[(i + 1) % tabs.length]; }
        if (e.key === "ArrowLeft") { next = tabs[(i - 1 + tabs.length) % tabs.length]; }
        if (next) { e.preventDefault(); next.focus(); select(next); }
      });
    });

    /* Deep link: /menu.html#sandwiches opens that tab */
    var hash = location.hash.replace("#", "");
    var byHash = hash && document.querySelector('[data-tab-id="' + hash + '"]');
    if (byHash) { select(byHash); }
  }

  /* ------------------------------------------------------------------
     5. Menu search + category chips
     ------------------------------------------------------------------ */
  function initMenuTools() {
    var search = document.getElementById("menu-search");
    var chips = document.querySelectorAll("[data-filter]");
    var items = document.querySelectorAll("[data-menu-item]");
    if (!items.length) { return; }

    var activeCat = "all";

    function apply() {
      var q = search ? search.value.trim().toLowerCase() : "";
      var shown = 0;
      items.forEach(function (item) {
        var text = (item.getAttribute("data-search") || item.textContent).toLowerCase();
        var cat = item.getAttribute("data-cat") || "";
        var okQ = !q || text.indexOf(q) !== -1;
        var okC = activeCat === "all" || cat === activeCat;
        var show = okQ && okC;
        item.hidden = !show;
        if (show) { shown++; }
      });

      /* Hide a whole group when none of its items match */
      document.querySelectorAll("[data-menu-group]").forEach(function (g) {
        var any = g.querySelectorAll("[data-menu-item]:not([hidden])").length;
        g.hidden = any === 0;
      });

      var empty = document.getElementById("menu-empty");
      if (empty) { empty.hidden = shown !== 0; }
    }

    if (search) {
      search.addEventListener("input", apply);
      search.addEventListener("keydown", function (e) {
        if (e.key === "Escape") { search.value = ""; apply(); }
      });
    }
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        activeCat = chip.getAttribute("data-filter");
        chips.forEach(function (c) {
          c.setAttribute("aria-pressed", c === chip ? "true" : "false");
        });
        apply();
      });
    });
  }

  /* ------------------------------------------------------------------
     6. Gallery filters + lightbox
     ------------------------------------------------------------------ */
  function initGallery() {
    var items = Array.prototype.slice.call(document.querySelectorAll("[data-gallery-item]"));
    if (!items.length) { return; }

    document.querySelectorAll("[data-gallery-filter]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var cat = chip.getAttribute("data-gallery-filter");
        document.querySelectorAll("[data-gallery-filter]").forEach(function (c) {
          c.setAttribute("aria-pressed", c === chip ? "true" : "false");
        });
        items.forEach(function (it) {
          it.hidden = !(cat === "all" || it.getAttribute("data-cat") === cat);
        });
      });
    });

    /* --- Lightbox --- */
    var box = document.getElementById("lightbox");
    if (!box) { return; }
    var boxImg = box.querySelector(".lightbox__img");
    var boxCap = box.querySelector(".lightbox__cap");
    var index = 0;
    var lastFocus = null;

    function visible() {
      return items.filter(function (i) { return !i.hidden; });
    }
    function show(i) {
      var list = visible();
      if (!list.length) { return; }
      index = (i + list.length) % list.length;
      var el = list[index];
      var img = el.querySelector("img");
      var cap = el.getAttribute("data-caption") || (img ? img.alt : "");
      boxImg.src = img.getAttribute("data-full") || img.src;
      boxImg.alt = img.alt;
      boxCap.textContent = cap + "  (" + (index + 1) + " / " + list.length + ")";
    }
    function open(el) {
      lastFocus = document.activeElement;
      box.classList.add("is-open");
      box.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      show(visible().indexOf(el));
      box.querySelector(".lightbox__close").focus();
    }
    function close() {
      box.classList.remove("is-open");
      box.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocus) { lastFocus.focus(); }
    }

    items.forEach(function (el) {
      el.addEventListener("click", function () { open(el); });
    });
    box.querySelector(".lightbox__close").addEventListener("click", close);
    box.querySelector(".lightbox__prev").addEventListener("click", function (e) { e.stopPropagation(); show(index - 1); });
    box.querySelector(".lightbox__next").addEventListener("click", function (e) { e.stopPropagation(); show(index + 1); });
    box.addEventListener("click", function (e) { if (e.target === box) { close(); } });

    document.addEventListener("keydown", function (e) {
      if (!box.classList.contains("is-open")) { return; }
      if (e.key === "Escape") { close(); }
      if (e.key === "ArrowLeft") { show(index - 1); }
      if (e.key === "ArrowRight") { show(index + 1); }
      /* simple focus trap */
      if (e.key === "Tab") {
        var f = box.querySelectorAll("button");
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ------------------------------------------------------------------
     7. Daily specials — rendered from specials-data.js
     ------------------------------------------------------------------ */
  function initSpecials() {
    var data = window.LERCYS_SPECIALS;
    if (!data) { return; }

    var todayKey = DAY_KEYS[centralNow().day];

    /* Homepage "Today on the line" strip */
    var todayEl = document.getElementById("today-line");
    if (todayEl) {
      var t = data.days[todayKey];
      var head = document.getElementById("today-label");
      var list = document.getElementById("today-entrees");
      if (head) {
        head.textContent = t && t.label ? t.label : "";
      }
      if (list) {
        list.innerHTML = "";
        if (!t || t.closed || !t.entrees.length) {
          list.innerHTML = "<li>We're closed on Saturdays. See you Monday at 10:30 AM.</li>";
        } else {
          t.entrees.forEach(function (e) {
            var li = document.createElement("li");
            li.textContent = e;
            list.appendChild(li);
          });
        }
      }
    }

    /* /specials page — render every day */
    var weekEl = document.getElementById("week-specials");
    if (weekEl) {
      weekEl.innerHTML = "";
      DAY_KEYS.forEach(function (key) {
        var d = data.days[key];
        if (!d) { return; }
        var card = document.createElement("article");
        card.className = "card reveal" + (key === todayKey ? " is-in" : "");

        var body = document.createElement("div");
        body.className = "card__body";

        var h = document.createElement("h3");
        h.textContent = d.label;
        if (key === todayKey) {
          var badge = document.createElement("span");
          badge.className = "note-inline";
          badge.style.marginLeft = ".5rem";
          badge.textContent = "Today";
          h.appendChild(badge);
        }
        body.appendChild(h);

        if (d.closed) {
          var p = document.createElement("p");
          p.textContent = "Closed — we'll see you Monday at 10:30 AM.";
          body.appendChild(p);
        } else {
          var ul = document.createElement("ul");
          ul.className = "timeline";
          ul.style.marginTop = ".5rem";
          d.entrees.forEach(function (e) {
            var li = document.createElement("li");
            li.textContent = e;
            ul.appendChild(li);
          });
          body.appendChild(ul);
        }

        card.appendChild(body);
        weekEl.appendChild(card);
      });
    }
  }

  /* ------------------------------------------------------------------
     8. Scroll reveal
     ------------------------------------------------------------------ */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) { return; }
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (e) { e.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ------------------------------------------------------------------
     9. Click-to-copy address
     ------------------------------------------------------------------ */
  function initCopy() {
    document.querySelectorAll("[data-copy]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var text = btn.getAttribute("data-copy");
        var done = function () {
          var old = btn.textContent;
          btn.textContent = "Copied!";
          setTimeout(function () { btn.textContent = old; }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(function () {});
        } else {
          var ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand("copy"); done(); } catch (e) {}
          document.body.removeChild(ta);
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     10. Contact form — no backend wired yet
     ------------------------------------------------------------------ */
  function initForm() {
    var form = document.getElementById("contact-form");
    if (!form) { return; }
    var note = document.getElementById("form-note");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      /* VERIFY: no recipient address is confirmed. This deliberately does
         NOT pretend the message was sent. */
      if (note) {
        note.hidden = false;
        note.textContent =
          "This form is not connected to an inbox yet. Please call (409) 229-7037 — " +
          "that's the fastest way to reach us.";
      }
    });
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  function boot() {
    initHeader();
    initStatus();
    initTabs();
    initMenuTools();
    initGallery();
    initSpecials();
    initReveal();
    initCopy();
    initForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
