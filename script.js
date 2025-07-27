document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("manga-pages");
  if (!container) return;

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

    console.log("Checking image:", imgUrl); // Debug
    testImg.src = imgUrl;
  }

  loadNextImage();
});
