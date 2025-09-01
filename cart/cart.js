// cart.js

// Make sure cart exists in localStorage
if (!localStorage.getItem('cart')) {
  localStorage.setItem('cart', JSON.stringify([]));
}

function loadCartItems() {
  const cartContainer = document.getElementById('cart-items');
  const totalDisplay = document.getElementById('cart-total');
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  cartContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    totalDisplay.textContent = "Total: $0.00";
    return;
  }

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const itemElement = document.createElement("div");
    itemElement.className = "cart-item";
    itemElement.innerHTML = `
      <div class="item-info">
        <p><strong>${item.name}</strong></p>
        <p>Price: $${item.price.toFixed(2)}</p>
      </div>
      <div class="quantity-adjust">
        <button class="qty-btn" data-index="${index}" data-change="-1">−</button>
        <span>${item.quantity}</span>
        <button class="qty-btn" data-index="${index}" data-change="1">+</button>
      </div>
      <div class="item-total">$${itemTotal.toFixed(2)}</div>
      <button class="remove-btn" data-index="${index}">Remove</button>
    `;
    cartContainer.appendChild(itemElement);
  });

  totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
  
  // Add event listeners to all dynamic buttons
  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.dataset.index);
      const change = parseInt(this.dataset.change);
      changeQuantity(index, change);
    });
  });
  
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.dataset.index);
      removeFromCart(index);
    });
  });
}

function changeQuantity(index, change) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (index >= 0 && index < cart.length) {
    cart[index].quantity += change;
    if (cart[index].quantity < 1) cart[index].quantity = 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCartItems();
    updateCartCount();
  }
}

function removeFromCart(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCartItems();
    updateCartCount();
  }
}

function clearCart() {
  if (confirm("Are you sure you want to clear the entire cart?")) {
    localStorage.setItem("cart", JSON.stringify([]));
    loadCartItems();
    updateCartCount();
  }
}

function goToCheckout() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty. Add items before checking out.");
    return;
  }
  window.location.href = "../checkout/checkout.html";
}



// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  loadCartItems();
  updateCartCount();
});
function calculateTotal() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}