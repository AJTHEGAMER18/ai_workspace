// script.js - Dark mode toggle
const toggle = document.getElementById('darkModeToggle');
const body = document.body;

// Load preference
if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark');
    toggle.textContent = '☀️';
}

toggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    toggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('darkMode', isDark);
});
