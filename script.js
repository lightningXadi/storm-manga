document.addEventListener("DOMContentLoaded", function () {
  // 🍔 Mobile nav menu toggle (only if elements exist)
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("nav-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      menu.classList.toggle("active");
    });
  }

  // 📖 Manga image loader
  const container = document.getElementById("manga-pages");
  if (container) {
    const maxTryPages = 200;
    const maxMisses = 5;
    let missCount = 0;
    let i = 1;

    function loadNextImage() {
      if (i > maxTryPages || missCount >= maxMisses) return;

      const pageNum = String(i).padStart(4, "0");
      const imgUrl = `manga/solo-level/Sololeveling_102_page-${pageNum}.jpg`;

      const testImg = new Image();
      testImg.onload = function () {
        container.innerHTML += `
          <div class="manga-page">
            <img src="${imgUrl}" alt="Page ${i}" loading="lazy">
          </div>
        `;
        missCount = 0;
        i++;
        loadNextImage();
      };
      testImg.onerror = function () {
        console.warn(`Missing: ${imgUrl}`);
        missCount++;
        i++;
        loadNextImage();
      };
      testImg.src = imgUrl;
    }

    loadNextImage();
  }
});
