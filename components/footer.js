// Footer Component
function loadFooter() {
  const footerHTML = `
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p class="text-gray-500 dark:text-gray-400 text-sm">© 2025 Jose Aristizabal. All Rights Reserved.</p>
      </div>
    </footer>
  `;

  // Insert footer into the page
  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) {
    footerContainer.innerHTML = footerHTML;
  }
}

// Load footer when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadFooter);
} else {
  loadFooter();
}
