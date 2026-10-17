/* ============================================================
   AJ MERCER — Landing Page Interactions
   Theme toggle · Scroll reveals · Active nav · Clock · Menu
   ============================================================ */
"use strict";

const root = document.documentElement;

/* ---------- Theme toggle ----------
   The <head> inline script already set data-theme before paint.
   Here we wire up the toggle + persistence + system sync. */
const themeToggle = document.getElementById("themeToggle");

function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try {
        localStorage.setItem("theme", theme);
    } catch (_) { /* storage unavailable — ignore */ }
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        setTheme(next);
    });
}

// Follow OS changes live (only if user hasn't picked explicitly).
const mq = window.matchMedia("(prefers-color-scheme: dark)");
mq.addEventListener("change", (e) => {
    let stored = null;
    try { stored = localStorage.getItem("theme"); } catch (_) {}
    if (!stored) setTheme(e.matches ? "dark" : "light");
});

/* ---------- Scroll reveals ---------- */
const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in");
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
} else {
    // Fallback: show everything immediately.
    revealEls.forEach((el) => el.classList.add("in"));
}

/* ---------- Active nav link ---------- */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav__link[data-section]");

if ("IntersectionObserver" in window && sections.length) {
    const navObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach((link) => {
                        link.classList.toggle("active", link.dataset.section === id);
                    });
                }
            });
        },
        { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((sec) => navObserver.observe(sec));
}

/* ---------- Mobile menu ---------- */
const burger = document.getElementById("navBurger");
const mobileMenu = document.getElementById("mobileMenu");

function closeMenu() {
    if (!burger || !mobileMenu) return;
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

if (burger && mobileMenu) {
    burger.addEventListener("click", () => {
        const isOpen = burger.getAttribute("aria-expanded") === "true";
        if (isOpen) {
            closeMenu();
        } else {
            burger.setAttribute("aria-expanded", "true");
            burger.setAttribute("aria-label", "Close menu");
            mobileMenu.classList.add("open");
            mobileMenu.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
        }
    });

    // Close when a menu link is tapped or Esc is pressed.
    mobileMenu.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", closeMenu)
    );
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeMenu();
    });
}

/* ---------- Footer clock & year ---------- */
const clockEl = document.getElementById("clock");
const yearEl = document.getElementById("year");

function tick() {
    if (!clockEl) return;
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

if (clockEl) {
    tick();
    setInterval(tick, 1000);
}

if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
}

/* ---------- Magnetic hover (pointer devices only) ---------- */
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

if (finePointer.matches) {
    document.querySelectorAll(".magnetic").forEach((el) => {
        const strength = 0.28;

        el.addEventListener("mousemove", (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });

        el.addEventListener("mouseleave", () => {
            el.style.transition = "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)";
            el.style.transform = "translate(0, 0)";
            // Remove inline transition after it settles so CSS hover anims resume.
            el.addEventListener(
                "transitionend",
                () => (el.style.transition = ""),
                { once: true }
            );
        });
    });
}
