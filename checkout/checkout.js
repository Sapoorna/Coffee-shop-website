document.addEventListener("DOMContentLoaded", () => {
  // Check cart
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty. Please add items before checkout.");
    window.location.href = "../menu/menu.html";
    return;
  }

  // Elements
  const orderTypeRadios = document.getElementsByName("orderType");
  const addressField = document.getElementById("address-field");
  const checkoutForm = document.getElementById("checkout-form");
  const orderPreview = document.getElementById("order-preview");
  const orderSummary = document.getElementById("order-summary");
  const paymentTabs = document.querySelectorAll('.payment-tab');
  const paymentContents = document.querySelectorAll('.payment-content');

  // Initialize visibility
  checkoutForm.style.display = "block";
  orderPreview.style.display = "none";
  orderSummary.style.display = "none";
  addressField.style.display = "none";

  // Form submission handling
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) return;

    // Show order preview
    showOrderPreview();
  });

  // Preview confirm button (move this OUTSIDE the submit handler)
  const previewConfirmBtn = document.getElementById("preview-confirm-order-btn");
  if (previewConfirmBtn) {
    previewConfirmBtn.addEventListener("click", (e) => {
      e.preventDefault();

      // Disable button and show loading state
      previewConfirmBtn.disabled = true;
      previewConfirmBtn.textContent = 'Processing...';

      // Complete the order
      completeOrder();
    });
  }

  // Back button (move this OUTSIDE the submit handler)
  const backToFormBtn = document.getElementById("back-to-form-btn");
  if (backToFormBtn) {
    backToFormBtn.addEventListener("click", (e) => {
      e.preventDefault();
      checkoutForm.style.display = 'block';
      orderPreview.style.display = 'none';

      // Reset submit button
      const submitBtn = document.getElementById('submit-order-btn');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirm Order';
      }
    });
  }

  // Delivery/Pickup toggle
  orderTypeRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      addressField.style.display = radio.value === "delivery" ? "block" : "none";
      document.getElementById("address").toggleAttribute("required", radio.value === "delivery");
    });
  });

  // Payment tabs handler
  paymentTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and contents
      paymentTabs.forEach(t => t.classList.remove('active'));
      paymentContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      tab.classList.add('active');
      document.getElementById(`${tab.dataset.method}-fields`).classList.add('active');
    });
  });

  // Set min date to tomorrow
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  document.getElementById("order-date").min = tomorrow.toISOString().split("T")[0];

  // Set default time to next available hour
  const nextHour = today.getHours() + 1;
  document.getElementById("order-time").min = `${nextHour.toString().padStart(2, '0')}:00`;

  // Update cart count
  updateCartCount();
});

function showOrderPreview() {
  // Get form data
  const formData = {
    customer: document.getElementById("name").value,
    contact: document.getElementById("contact").value,
    type: document.querySelector("input[name='orderType']:checked").value,
    address: document.getElementById("address")?.value || 'N/A',
    date: document.getElementById("order-date").value,
    time: document.getElementById("order-time").value,
    payment: document.querySelector('.payment-tab.active').dataset.method,
    items: JSON.parse(localStorage.getItem("cart")),
    total: calculateTotal()
  };

  // Display order items
  const orderItemsList = document.getElementById("order-items-list");
  orderItemsList.innerHTML = formData.items.map(item => `
    <div class="order-item">
      <span>${item.quantity} × ${item.name}</span>
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
    </div>
  `).join('');

  // Display payment details
  const paymentDetailsPreview = document.getElementById("payment-details-preview");
  if (formData.payment === "credit-card") {
    const cardNumber = document.getElementById("card-number").value;
    paymentDetailsPreview.innerHTML = `
      <div class="payment-details">
        <p><strong>Payment Method:</strong> Credit Card ending with ${cardNumber.slice(-4)}</p>
      </div>
    `;
  } else {
    paymentDetailsPreview.innerHTML = `
      <div class="payment-details">
        <p><strong>Payment Method:</strong> ${formData.payment.charAt(0).toUpperCase() + formData.payment.slice(1)}</p>
      </div>
    `;
  }

  // Store form data temporarily
  localStorage.setItem("tempFormData", JSON.stringify(formData));

  // Show preview and hide form
  document.getElementById("checkout-form").style.display = "none";
  document.getElementById("order-preview").style.display = "block";
}

function completeOrder() {
  setTimeout(() => {
    try {
      const tempFormData = JSON.parse(localStorage.getItem("tempFormData"));
      const order = {
        number: 'BB-' + Date.now().toString().slice(-6),
        customer: tempFormData.customer,
        contact: tempFormData.contact,
        type: tempFormData.type,
        address: tempFormData.address,
        payment: tempFormData.payment,
        items: tempFormData.items,
        total: tempFormData.total,
        date: new Date().toLocaleString(),
        scheduled: `${tempFormData.date} at ${tempFormData.time}`
      };

      // Hide preview, show summary
      document.getElementById("order-preview").style.display = "none";
      document.getElementById("order-summary").style.display = "block";

      // Fill summary fields
      document.getElementById("order-number").textContent = order.number;
      document.getElementById("customer-name").textContent = order.customer;
      document.getElementById("customer-contact").textContent = order.contact;
      document.getElementById("order-type").textContent = order.type.charAt(0).toUpperCase() + order.type.slice(1);
      document.getElementById("payment-method-summary").textContent = order.payment.charAt(0).toUpperCase() + order.payment.slice(1);
      document.getElementById("scheduled-date-time").textContent = order.scheduled;
      document.getElementById("order-total").textContent = "$" + order.total.toFixed(2);

      // Show ordered items
      const confirmedItems = order.items.map(item => `
        <div class="order-item">
          <span>${item.quantity} × ${item.name}</span>
          <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      `).join('');
      document.getElementById("confirmed-order-items").innerHTML = confirmedItems;

      // Optionally clear cart
      localStorage.removeItem("cart");
      updateCartCount();

    } catch (error) {
      alert("There was an error confirming your order. Please try again.");
      window.location.reload();
    }
  }, 1500);
}

function calculateTotal() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function validateForm() {
  // Basic validation
  const name = document.getElementById("name").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const orderType = document.querySelector("input[name='orderType']:checked");
  const address = document.getElementById("address")?.value.trim();
  const paymentMethod = document.querySelector('.payment-tab.active').dataset.method;

  if (!name) {
    alert("Please enter your name");
    return false;
  }

  if (!/^\d{10}$/.test(contact)) {
    alert("Please enter a valid 10-digit phone number");
    return false;
  }

  if (!orderType) {
    alert("Please select delivery or pickup");
    return false;
  }

  if (orderType.value === "delivery" && !address) {
    alert("Please enter delivery address");
    return false;
  }

  // Payment validation
  if (paymentMethod === "credit-card") {
    const cardNumber = document.getElementById("card-number");
    const cardName = document.getElementById("card-name");
    const cardExpiry = document.getElementById("card-expiry");
    const cardCvv = document.getElementById("card-cvv");
    const terms = document.getElementById("terms");

    if (!cardNumber.checkValidity()) {
      alert("Please enter a valid 16-digit card number");
      cardNumber.focus();
      return false;
    }

    if (!cardName.value.trim()) {
      alert("Please enter cardholder name");
      cardName.focus();
      return false;
    }

    if (!cardExpiry.checkValidity()) {
      alert("Please enter expiry date in MM/YY format");
      cardExpiry.focus();
      return false;
    }

    if (!cardCvv.checkValidity()) {
      alert("Please enter valid 3-digit CVV");
      cardCvv.focus();
      return false;
    }

    if (!terms.checked) {
      alert('Please accept the terms and conditions');
      return false;
    }
  }

  return true;
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'inline-block' : 'none';
  });
}