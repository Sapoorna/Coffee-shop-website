// global.js

// Theme function with localStorage persistence
function toggleTheme() {
  document.body.classList.toggle("dark-theme");
  localStorage.setItem('darkMode', document.body.classList.contains('dark-theme'));
}

// Initialize theme from user preference
function initTheme() {
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-theme');
  }
}

// Update cart counter display
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = totalItems;
    el.style.display = totalItems > 0 ? 'inline-block' : 'none';
  });
}

// Update cart preview display
function updateCartPreview() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const previewContainer = document.querySelector('.cart-preview-items');
  const totalElement = document.querySelector('.preview-total-amount');

  if (!previewContainer || !totalElement) return; // Safety check

  previewContainer.innerHTML = '';

  if (cart.length === 0) {
    previewContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    totalElement.textContent = '0.00';
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const itemElement = document.createElement('div');
    itemElement.className = 'cart-preview-item';
    itemElement.innerHTML = `
      <span>${item.name} × ${item.quantity}</span>
      <span>$${itemTotal.toFixed(2)}</span>
    `;
    previewContainer.appendChild(itemElement);
  });

  totalElement.textContent = total.toFixed(2);
}

// Load global layout (navbar + footer together) into the placeholder
function loadLayout() {
  const layoutContainer = document.getElementById("layout");
  if (!layoutContainer) return;

  // IMPORTANT: adjust this path to where your layout.html actually lives.
  // If layout.html sits next to global.js at project root, and this page is /home/home.html:
  // ../layout.html is correct.
  fetch("../layout.html")
    .then(res => res.text())
    .then(html => {
      layoutContainer.innerHTML = html;

      // Re-run important updates after navbar/footer injected
      updateCartCount();
      updateCartPreview();
      initTheme();

      // Highlight active nav link
      const currentPath = window.location.pathname.split("/").pop();
      document.querySelectorAll(".nav-links a").forEach(link => {
        if (link.getAttribute("href").includes(currentPath)) {
          link.classList.add("active");
        }
      });
    })
    .catch(err => console.error("Error loading layout:", err));
}

document.addEventListener("DOMContentLoaded", function() {
  initTheme();
  updateCartCount();
  updateCartPreview();
  loadLayout();

  // Update when cart changes (from other tabs/windows)
  window.addEventListener('storage', () => {
    updateCartCount();
    updateCartPreview();
  });
});
