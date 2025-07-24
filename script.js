// This runs when the page loads
window.addEventListener('DOMContentLoaded', () => {
  console.log("Storm Manga loaded!");
  
  // Example: Button click message
  const btn = document.querySelector('.btn');
  if (btn) {
    btn.addEventListener('click', () => {
      alert("Enjoy the manga ride! 🚀");
    });
  }
});
