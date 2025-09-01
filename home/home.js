// Enhanced welcome message with time-based greetings
function showWelcomeMessage() {
  const hour = new Date().getHours();
  let greeting = "Welcome to Bean & Bliss!";

  if (hour >= 5 && hour < 12) {
    greeting = "Good Morning! ☕ Start your day with joy.";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon! 🍰 Treat yourself today.";
  } else if (hour >= 17 && hour < 21) {
    greeting = "Good Evening! 🌙 Relax with dessert.";
  } else {
    greeting = "Late Night? 🌜 Try our decaf options!";
  }

  const notification = document.createElement('div');
  notification.className = 'welcome-notification';
  notification.textContent = greeting;
  document.body.prepend(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// REPLACE ALL CODE with just this:
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-theme');
  }
 
  
  updateCartCount(); // Initialize cart count
  showWelcomeMessage(); // Show welcome message
});
