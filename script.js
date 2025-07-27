document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("nav-menu");

  toggle.addEventListener("click", () => {
    menu.classList.toggle("active");
  });
});
const container = document.getElementById('manga-pages');
const totalPages = 100;

for (let i = 1; i <= totalPages; i++) {
  const pageNum = String(i).padStart(4, '0');
  const imgUrl = `manga/solo-level/Sololeveling_102_page-${pageNum}.jpg`;
  
  // Create test image to verify loading
  const testImg = new Image();
  testImg.onload = function() {
    container.innerHTML += `
      <div class="manga-page">
        <img src="${imgUrl}" alt="Page ${i}" loading="lazy">
      </div>
    `;
  };
  testImg.onerror = function() {
    console.error("Missing:", imgUrl); // This will show in browser console (F12)
    container.innerHTML += `
      <div class="manga-page error">
        [Missing Page ${i}]
      </div>
    `;
  };
  testImg.src = imgUrl;
}
