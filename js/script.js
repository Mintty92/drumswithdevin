// js/script.js

// --- Dynamic Year in Footer ---
const currentYear = new Date().getFullYear();
const yearSpan = document.getElementById("currentYear");
if (yearSpan) {
  yearSpan.textContent = currentYear;
}

// --- Smooth Scrolling for Navbar Links ---
document.querySelectorAll('a.nav-link[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault(); // Prevent default anchor jump

    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      // Calculate offset if needed (e.g., for fixed navbar height)
      const navbarHeight = document.querySelector(".navbar").offsetHeight || 60; // Get actual height or fallback
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth", // Smooth scroll animation
      });

      // Optional: Close mobile navbar after clicking a link
      const navbarCollapse = document.querySelector(".navbar-collapse");
      if (navbarCollapse.classList.contains("show")) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
          toggle: false, // Make sure not to re-toggle
        });
        bsCollapse.hide();
      }
    }
  });
});

// --- Optional: Highlight Active Nav Link on Scroll ---
// (More advanced: Uses Intersection Observer API)
const sections = document.querySelectorAll("section[id]");
const navLi = document.querySelectorAll(
  '.navbar-nav .nav-item .nav-link[href^="#"]'
);

const observerOptions = {
  root: null, // relative to document viewport
  rootMargin: "-50% 0px -50% 0px", // trigger when section is in middle 50% of viewport
  threshold: 0, // trigger as soon as even one pixel is visible
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute("id");
      navLi.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${id}`) {
          link.classList.add("active");
        }
      });
    }
  });
}, observerOptions);

sections.forEach(section => {
  observer.observe(section);
});

// Make "Home" active initially if no hash is present
if (!window.location.hash || window.location.hash === "#home") {
  document.querySelector('.nav-link[href="#home"]')?.classList.add("active");
}

console.log("Custom script loaded."); // For checking if the file is linked correctly

// --- YouTube IFrame Player API Code ---

// 1. Variable to hold the player object
let player;
const youtubePlaylistId = "PLMvlptYZpoL6DBsavRcFcuvMxD1PbGb2Z"; // <-- VERY IMPORTANT: REPLACE WITH YOUR ACTUAL PLAYLIST ID

// 2. This function creates an <iframe> (and YouTube player)
//    after the API code downloads. It MUST be global.
function onYouTubeIframeAPIReady() {
  console.log("YouTube API Ready");
  const playerContainer = document.getElementById("youtube-playlist-player");

  // Get container width for potential responsive player sizing
  // Note: This runs once on load. More complex resizing might need event listeners.
  const containerWidth = playerContainer.offsetWidth;
  // Calculate height based on 16:9 ratio, or set fixed dimensions
  const playerHeight = containerWidth * (9 / 16);
  const playerWidth = containerWidth; // Use container width

  player = new YT.Player("youtube-playlist-player", {
    // Set height and width explicitly - adjust if needed
    // You can make this more dynamic based on container size if required
    height: playerHeight, //'360',
    width: playerWidth, //'640',
    playerVars: {
      playsinline: 1, // Important for mobile playback
      modestbranding: 1, // Less YouTube branding
      // --- Playlist Configuration ---
      listType: "playlist",
      list: youtubePlaylistId,
      // Add other parameters like 'autoplay': 0, 'controls': 1 etc. if needed
      // See: https://developers.google.com/youtube/player_parameters
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange, // Optional: useful for debugging or advanced features
    },
  });
}

// 3. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  console.log("Player Ready");
  // You could potentially enable the buttons here if they start disabled
  // event.target references the player object (same as the global 'player')
  // Example: Auto-play first video (use with caution, often blocked by browsers)
  // event.target.playVideo();

  // --- Add Event Listeners for Custom Controls ---
  const prevButton = document.getElementById("prev-video");
  const nextButton = document.getElementById("next-video");

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      if (player && typeof player.previousVideo === "function") {
        player.previousVideo();
      } else {
        console.error("Player not ready or previousVideo function missing.");
      }
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      if (player && typeof player.nextVideo === "function") {
        player.nextVideo();
      } else {
        console.error("Player not ready or nextVideo function missing.");
      }
    });
  }
}

// 4. The API calls this function when the player's state changes.
//    Optional: You can use this to know when a video ends, plays, pauses etc.
function onPlayerStateChange(event) {
  /* // Example States:
     if (event.data == YT.PlayerState.PLAYING) { console.log('Video Playing'); }
     if (event.data == YT.PlayerState.PAUSED) { console.log('Video Paused'); }
     if (event.data == YT.PlayerState.ENDED) { console.log('Video Ended - good place to maybe automatically play next?'); }
  */
  console.log("Player State Changed:", event.data);
}

// --- Dynamically load the YouTube IFrame API ---
// This avoids blocking page rendering
if (document.getElementById("youtube-playlist-player")) {
  // Only load if the player div exists
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  console.log("YouTube API script requested.");
}

// --- End YouTube IFrame Player API Code ---
