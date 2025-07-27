document.addEventListener("DOMContentLoaded", async function() {
  // Hamburger Menu Toggle (unchanged)
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      menuToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
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
  if (chapterTitle) {
    chapterTitle.textContent = `${manga.replace(/-/g, ' ').toUpperCase()} - Chapter ${chapterNum}`;
  }

  // Preload optimization
  let preloadQueue = [];
  const concurrentPreloads = 3; // Number of images to preload simultaneously
  let activePreloads = 0;
  let currentPage = 1;
  let hasPages = false;
  const maxTryPages = 200;
  const maxMisses = 5;
  let missCount = 0;

  // Create loading placeholder
  container.innerHTML = '<div class="loading">Loading pages...</div>';

  // Function to create image element
  function createImageElement(src, pageNum) {
    const pageDiv = document.createElement("div");
    pageDiv.className = "manga-page";
    
    const img = new Image();
    img.src = src;
    img.alt = `Page ${pageNum}`;
    img.loading = "eager"; // Changed from lazy to eager for initial pages
    img.decoding = "async";
    
    pageDiv.appendChild(img);
    return pageDiv;
  }

  // Function to check and load images in batches
  async function loadImageBatch(startPage, batchSize = 5) {
    const batchPromises = [];
    
    for (let i = 0; i < batchSize; i++) {
      const pageNum = startPage + i;
      const formattedPage = String(pageNum).padStart(4, "0");
      const imgUrl = `manga/${manga}/ch-${chapterNum}/Sololeveling_102_page-${formattedPage}.jpg`;
      
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

  // Main loading function
  async function loadPages() {
    while (missCount < maxMisses && currentPage <= maxTryPages) {
      const batchResults = await loadImageBatch(currentPage);
      
      if (batchResults.length > 0) {
        if (!hasPages) {
          container.innerHTML = '';
          hasPages = true;
        }
        
        // Create document fragment for batch insertion
        const fragment = document.createDocumentFragment();
        batchResults.forEach(({ url, pageNum }) => {
          fragment.appendChild(createImageElement(url, pageNum));
        });
        
        container.appendChild(fragment);
        missCount = 0;
        currentPage += batchResults.length;
      } else {
        missCount++;
        currentPage += 5; // Skip ahead by batch size
      }
    }

    if (!hasPages) {
      container.innerHTML = '<p>No pages found for this chapter.</p>';
    }
  }

  // Set up navigation (unchanged)
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

  // Start loading
  await loadPages();
  setupNavigation();

  // Preload next chapter in background
  if (nextBtn && !nextBtn.classList.contains('disabled')) {
    const nextChapterNum = parseInt(chapterNum) + 1;
    const nextChapterUrl = `manga/${manga}/ch-${nextChapterNum}/Sololeveling_102_page-0001.jpg`;
    
    // Silent preload
    new Image().src = nextChapterUrl;
  }
});
