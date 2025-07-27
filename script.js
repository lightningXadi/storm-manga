document.addEventListener("DOMContentLoaded", async function() {
  // Hamburger Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      menuToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
    });
  }

  // Chapter Loading Functionality
  const container = document.getElementById("manga-pages");
  const chapterTitle = document.getElementById("chapter-title") || document.querySelector(".chapter-title");
  const prevBtn = document.getElementById("prev-chapter");
  const nextBtn = document.getElementById("next-chapter");

  if (!container) return;

  // Get URL params - compatible with both "series" and "manga" parameters
  const urlParams = new URLSearchParams(window.location.search);
  const series = urlParams.get("series") || urlParams.get("manga");
  const chapter = urlParams.get("chapter");

  if (!series || !chapter) {
    container.innerHTML = "<p>Invalid chapter link</p>";
    return;
  }

  // Format title
  const displayName = series.replace(/-/g, " ");
  const chapterNum = chapter.startsWith('ch-') ? chapter.replace('ch-', '') : chapter;
  if (chapterTitle) {
    chapterTitle.textContent = `${displayName.toUpperCase()} - Chapter ${chapterNum}`;
  }

  // Image loading parameters
  const maxTryPages = 200;
  const maxMisses = 5;
  let missCount = 0;
  let currentPage = 1;
  let hasPages = false;

  // Function to check if image exists
  const checkImageExists = (url) => {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  // Load pages dynamically
  async function loadPages() {
    container.innerHTML = '<div class="loading">Loading pages...</div>';
    
    while (missCount < maxMisses && currentPage <= maxTryPages) {
      const pageNum = String(currentPage).padStart(4, "0");
      
      // Try both possible path formats
      let imgUrl = `manga/${series}/ch-${chapterNum}/Sololeveling_102_page-${pageNum}.jpg`;
      let exists = await checkImageExists(imgUrl);
      
      // Alternative path format if first one fails
      if (!exists) {
        imgUrl = `manga/${series}/${chapter}/Sololeveling_102_page-${pageNum}.jpg`;
        exists = await checkImageExists(imgUrl);
      }

      if (exists) {
        if (!hasPages) {
          container.innerHTML = '';
          hasPages = true;
        }
        
        const pageDiv = document.createElement("div");
        pageDiv.className = "manga-page";
        
        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = `Page ${currentPage}`;
        img.loading = "lazy";
        
        pageDiv.appendChild(img);
        container.appendChild(pageDiv);
        
        missCount = 0;
      } else {
        missCount++;
      }
      
      currentPage++;
    }

    if (!hasPages) {
      container.innerHTML = '<p>No pages found for this chapter.</p>';
    }
  }

  // Set up navigation
  function setupNavigation() {
    if (!prevBtn || !nextBtn) return;
    
    const currentChapterNum = parseInt(chapterNum);
    const prevChapterNum = currentChapterNum - 1;
    const nextChapterNum = currentChapterNum + 1;

    // Previous chapter
    if (prevChapterNum > 0) {
      prevBtn.href = `chapter.html?manga=${series}&chapter=ch-${prevChapterNum}`;
    } else {
      prevBtn.classList.add('disabled');
      prevBtn.textContent = "No Previous Chapter";
    }

    // Next chapter
    nextBtn.href = `chapter.html?manga=${series}&chapter=ch-${nextChapterNum}`;
  }

  // Initialize
  await loadPages();
  setupNavigation();
});
