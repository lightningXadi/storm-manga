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
// 🌐 Dynamic Chapter Loader
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("manga-pages");
  const chapterTitle = document.querySelector(".chapter-title");
  const prevBtn = document.getElementById("prev-chapter");
  const nextBtn = document.getElementById("next-chapter");

  if (!container || !chapterTitle) return;

  // ⛓️ Get URL params
  const urlParams = new URLSearchParams(window.location.search);
  const series = urlParams.get("series"); // e.g., "solo-level"
  const chapter = urlParams.get("chapter"); // e.g., "102"

  if (!series || !chapter) {
    container.innerHTML = "<p>Invalid chapter link</p>";
    return;
  }

  chapterTitle.textContent = `${series.replace(/-/g, " ")} - Chapter ${chapter}`;

  const basePath = `manga/${series}`;
  const filePrefix = `${series.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("")}_${chapter}_page-`;

  let currentPage = 1;
  let maxConfirmedPage = 0;
  const maxAttempts = 5;

  const loadPages = async () => {
    while (true) {
      const pageNum = String(currentPage).padStart(4, "0");
      const imgUrl = `${basePath}/${filePrefix}${pageNum}.jpg`;

      const exists = await checkImageExists(imgUrl);

      if (exists) {
        container.innerHTML += `
          <div class="manga-page">
            <img src="${imgUrl}" alt="Page ${currentPage}" loading="lazy">
          </div>
        `;
        maxConfirmedPage = currentPage;
        currentPage++;
      } else {
        if (currentPage > maxConfirmedPage + maxAttempts) break;
        currentPage++;
      }
    }
  };

  const checkImageExists = (url) => {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  loadPages();

  // Navigation links
  prevBtn.href = `chapter.html?series=${series}&chapter=${parseInt(chapter) - 1}`;
  nextBtn.href = `chapter.html?series=${series}&chapter=${parseInt(chapter) + 1}`;
});
