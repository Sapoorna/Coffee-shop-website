// menu.js
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  updateCartPreview();
}

function increaseQty(itemName) {
  const qtySpan = document.getElementById(`${itemName}-qty`);
  let qty = parseInt(qtySpan.innerText);
  qtySpan.innerText = qty + 1;
}

function decreaseQty(itemName) {
  const qtySpan = document.getElementById(`${itemName}-qty`);
  let qty = parseInt(qtySpan.innerText);
  if (qty > 1) {
    qtySpan.innerText = qty - 1;
    return true;
  }
  return false;
}

function addQtyToCart(itemName, price) {
  let qty = parseInt(document.getElementById(`${itemName}-qty`).innerText);

  // Fix: default quantity to 1 if qty is 0 or invalid
  if (!qty || qty <= 0) qty = 1;

  const existingItemIndex = cart.findIndex(item => item.name === itemName);

  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += qty;
  } else {
    cart.push({
      name: itemName,
      price: price,
      quantity: qty
    });
  }

  updateCartStorage();
  showCartNotification(`${qty} × ${itemName} added to cart!`);
  resetQuantity(itemName);
}

function resetQuantity(itemName) {
  document.getElementById(`${itemName}-qty`).innerText = '1';
}

function showCartNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 500);
  }, 2000);
}

// Initialize cart functionality
document.addEventListener('DOMContentLoaded', () => {
  // Update cart on page load
  updateCartCount();
  updateCartPreview();

  // Smooth scrolling for sidebar navigation
  document.querySelectorAll('.menu-sidebar a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          const headerOffset = 80;
          const elementPosition = targetElement.offsetTop;
          const offsetPosition = elementPosition - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          history.pushState(null, null, targetId);
        }
      }
    });
  });

  // Highlight active section in sidebar
  window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('.menu-section');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        const id = section.getAttribute('id');
        document.querySelectorAll('.menu-sidebar a').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
});
