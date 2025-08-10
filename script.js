document.addEventListener("DOMContentLoaded", async function () {
  // Hamburger Menu Toggle (updated)
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (menuToggle && navMenu) {
    const closeMenu = () => {
      navMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
      menuToggle.textContent = '☰';
    };

    const openMenu = () => {
      navMenu.classList.add('active');
      document.body.classList.add('menu-open');
      menuToggle.textContent = '✕';
    };

    menuToggle.addEventListener('click', function () {
      const willOpen = !navMenu.classList.contains('active');
      if (willOpen) openMenu();
      else closeMenu();
    });

    // Close menu when clicking a nav link
    navMenu.querySelectorAll('a').forEach((anchor) => {
      anchor.addEventListener('click', () => closeMenu());
    });

    // Close menu on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    // Close if resizing to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  // Chapter Loader - Optimized Version
  const container = document.getElementById("manga-pages");
  const chapterTitle = document.getElementById("chapter-title");
  const prevBtn = document.getElementById("prev-chapter");
  const nextBtn = document.getElementById("next-chapter");

  if (!container) return;

  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const manga = urlParams.get("manga");
  const chapter = urlParams.get("chapter");

  if (!manga || !chapter) {
    container.innerHTML = "<p>Invalid chapter link</p>";
    return;
  }

  // Format title
  const chapterNum = chapter.startsWith('ch-') ? chapter.replace('ch-', '') : chapter;
  const fileSafeManga = manga.toLowerCase().replace(/\s+/g, '-');
  if (chapterTitle) {
    chapterTitle.textContent = `${manga.replace(/-/g, ' ').toUpperCase()} - Chapter ${chapterNum}`;
  }

  // Preload optimization
  let currentPage = 1;
  let hasPages = false;
  const maxTryPages = 200;
  const maxMisses = 5;
  let missCount = 0;

  container.innerHTML = '<div class="loading">Loading pages...</div>';

  function createImageElement(src, pageNum) {
    const pageDiv = document.createElement("div");
    pageDiv.className = "manga-page";

    const img = new Image();
    img.src = src;
    img.alt = `Page ${pageNum}`;
    img.loading = "eager";
    img.decoding = "async";

    pageDiv.appendChild(img);
    return pageDiv;
  }

  async function loadImageBatch(startPage, batchSize = 5) {
    const batchPromises = [];

    for (let i = 0; i < batchSize; i++) {
      const pageNum = startPage + i;
      const formattedPage = String(pageNum).padStart(4, "0");
      const imgUrl = `manga/${manga}/ch-${chapterNum}/${fileSafeManga}_page-${formattedPage}.jpg`;

      batchPromises.push(
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ exists: true, url: imgUrl, pageNum });
          img.onerror = () => resolve({ exists: false });
          img.src = imgUrl;
        })
      );
    }

    const results = await Promise.all(batchPromises);
    return results.filter(result => result.exists);
  }

  async function loadPages() {
    while (missCount < maxMisses && currentPage <= maxTryPages) {
      const batchResults = await loadImageBatch(currentPage);

      if (batchResults.length > 0) {
        if (!hasPages) {
          container.innerHTML = '';
          hasPages = true;
        }

        const fragment = document.createDocumentFragment();
        batchResults.forEach(({ url, pageNum }) => {
          fragment.appendChild(createImageElement(url, pageNum));
        });

        container.appendChild(fragment);
        missCount = 0;
        currentPage += batchResults.length;
      } else {
        missCount++;
        currentPage += 5;
      }
    }

    if (!hasPages) {
      container.innerHTML = '<p>No pages found for this chapter.</p>';
    }
  }

  function setupNavigation() {
    if (!prevBtn || !nextBtn) return;

    const currentChapterNum = parseInt(chapterNum);
    const prevChapterNum = currentChapterNum - 1;
    const nextChapterNum = currentChapterNum + 1;

    if (prevChapterNum > 0) {
      prevBtn.href = `chapter.html?manga=${manga}&chapter=ch-${prevChapterNum}`;
    } else {
      prevBtn.classList.add('disabled');
      prevBtn.textContent = "No Previous Chapter";
    }

    nextBtn.href = `chapter.html?manga=${manga}&chapter=ch-${nextChapterNum}`;
  }

  await loadPages();
  setupNavigation();

  // Preload next chapter
  if (nextBtn && !nextBtn.classList.contains('disabled')) {
    const nextChapterNum = parseInt(chapterNum) + 1;
    const nextChapterUrl = `manga/${manga}/ch-${nextChapterNum}/${fileSafeManga}_page-0001.jpg`;
    new Image().src = nextChapterUrl;
  }
});
