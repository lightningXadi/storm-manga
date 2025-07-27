// 🍔 Mobile nav menu toggle
document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("nav-menu");

  toggle.addEventListener("click", () => {
    menu.classList.toggle("active");
  });

  // 📖 Manga image loader
  const container = document.getElementById("manga-pages");
  const maxTryPages = 200; // Max upper limit (to avoid infinite loop)
  const maxMisses = 5; // Stop if 5 images in a row are missing
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
      missCount = 0; // Reset if image loaded
      i++;
      loadNextImage(); // Try next
    };
    testImg.onerror = function () {
      console.warn(`Missing: ${imgUrl}`);
      missCount++;
      i++;
      loadNextImage(); // Still try next, maybe next exists
    };
    testImg.src = imgUrl;
  }

  loadNextImage(); // Start loading
});
