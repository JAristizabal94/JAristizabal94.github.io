// Header Component
function loadHeader() {
  const headerHTML = `
    <header class="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center p-4 justify-between max-w-7xl mx-auto">
        <a href="index.html" class="flex items-center gap-3 group">
          <div class="w-1 h-12 bg-primary rounded-full"></div>
          <div>
            <h1 class="text-text-dark-gray dark:text-background-light text-xl font-black leading-tight group-hover:text-primary transition-colors">
              Jose Aristizabal
            </h1>
            <p class="text-gray-600 dark:text-gray-400 text-sm leading-tight">Solution Architect</p>
          </div>
        </a>
        <button id="menuBtn" aria-label="Open menu" class="text-text-dark-gray dark:text-background-light flex size-12 shrink-0 items-center justify-end">
          <span class="material-symbols-outlined text-3xl">menu</span>
        </button>
      </div>

      <!-- Mobile Menu -->
      <nav id="mobileMenu" class="hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div class="flex flex-col p-4 space-y-2">
          <a href="index.html" class="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Home</a>
          <!-- <a href="projects.html" class="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">All Projects</a>
          <a href="./blog/index.html" class="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Blog</a> -->
          <a href="contact.html" class="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Contact</a>
        </div>
      </nav>
    </header>
  `;

  // Insert header into the page
  const headerContainer = document.getElementById('header-container');
  if (headerContainer) {
    headerContainer.innerHTML = headerHTML;

    // Initialize mobile menu toggle
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });

      // Close menu when clicking on a link
      document.querySelectorAll('#mobileMenu a').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.add('hidden');
        });
      });
    }
  }
}

// Load header when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadHeader);
} else {
  loadHeader();
}
