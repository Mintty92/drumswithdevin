// Custom JavaScript for Drum Lessons Website

// --- Dynamic Year in Footer ---
const currentYear = new Date().getFullYear();
const yearSpan = document.getElementById("currentYear");
if (yearSpan) {
  yearSpan.textContent = currentYear;
}

// --- Smooth Scrolling for Navbar Links ---
document.querySelectorAll('a.nav-link[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      const navbarHeight =
        document.querySelector(".navbar")?.offsetHeight || 60;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      const navbarCollapseElement = document.querySelector(
        ".navbar-collapse.show"
      );
      if (navbarCollapseElement) {
        const bsCollapse =
          bootstrap.Collapse.getInstance(navbarCollapseElement) ||
          new bootstrap.Collapse(navbarCollapseElement, { toggle: false });
        bsCollapse.hide();
      }
    }
  });
});

// --- Highlight Active Nav Link on Scroll ---
const sections = document.querySelectorAll("section[id]");
const navLi = document.querySelectorAll(
  '.navbar-nav .nav-item .nav-link[href^="#"]'
);

const observerOptions = {
  root: null,
  rootMargin: "-50% 0px -50% 0px",
  threshold: 0,
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

if (!window.location.hash || window.location.hash === "#home") {
  document.querySelector('.nav-link[href="#home"]')?.classList.add("active");
}

// --- YouTube IFrame Player API Code ---
let player;
// USER ACTION: VERY IMPORTANT - REPLACE WITH YOUR ACTUAL YOUTUBE PLAYLIST ID
const youtubePlaylistId = "PLj-MZqjjF7IJhQdcIcYjqQL7ZNceGHL6l";

window.onYouTubeIframeAPIReady = function () {
  const playerContainer = document.getElementById("youtube-playlist-player");
  if (!playerContainer) return;

  const containerWidth = playerContainer.offsetWidth;
  // Calculate height based on 16:9 ratio, or set fixed dimensions
  const playerHeight = containerWidth > 0 ? containerWidth * (9 / 16) : 360; // Default height if width is 0
  const playerWidth = containerWidth > 0 ? containerWidth : 640; // Default width

  player = new YT.Player("youtube-playlist-player", {
    height: String(Math.round(playerHeight)),
    width: String(Math.round(playerWidth)),
    playerVars: {
      playsinline: 1,
      modestbranding: 1,
      listType: "playlist",
      list: youtubePlaylistId,
      // 'autoplay': 0, // Autoplay is often blocked
      // 'controls': 1
    },
    events: {
      onReady: onPlayerReady,
      // onStateChange: onPlayerStateChange // Optional: for debugging or advanced features
    },
  });
};

function onPlayerReady(event) {
  // Player is ready
  const prevButton = document.getElementById("prev-video");
  const nextButton = document.getElementById("next-video");

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      if (player && typeof player.previousVideo === "function") {
        player.previousVideo();
      }
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      if (player && typeof player.nextVideo === "function") {
        player.nextVideo();
      }
    });
  }
}

// Optional: function onPlayerStateChange(event) { /* console.log("Player State Changed:", event.data); */ }

// Dynamically load the YouTube IFrame API
if (document.getElementById("youtube-playlist-player")) {
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api"; // Corrected API URL
  const firstScriptTag = document.getElementsByTagName("script")[0];
  if (firstScriptTag && firstScriptTag.parentNode) {
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  } else {
    document.head.appendChild(tag); // Fallback if no script tags found
  }
}

// --- Testimonial Carousel Dynamic Font Sizing ---
const testimonialCarouselElement = document.getElementById(
  "testimonialCarousel"
);
if (testimonialCarouselElement) {
  const adjustParagraphFontSize = (paragraphElement, maxParagraphHeight) => {
    if (!paragraphElement || maxParagraphHeight <= 0) return;

    paragraphElement.style.fontSize = ""; // Clear previous inline style
    paragraphElement.style.overflowY = "visible"; // Ensure scrollHeight is not clipped

    let initialFontSize = parseFloat(
      window.getComputedStyle(paragraphElement).fontSize
    );
    if (isNaN(initialFontSize) || initialFontSize <= 0) initialFontSize = 16; // Default fallback

    let currentFontSize = initialFontSize;
    paragraphElement.style.fontSize = currentFontSize + "px";

    const minFontSize = 9; // Minimum readable font size in px (adjust as needed)
    const step = 0.5; // Decrease by 0.5px at a time
    let attempts = 0;
    const maxAttempts = 100; // Safety break for the loop

    // Iteratively reduce font size until content fits or min font size is reached
    while (
      paragraphElement.scrollHeight > maxParagraphHeight &&
      currentFontSize > minFontSize &&
      attempts < maxAttempts
    ) {
      currentFontSize -= step;
      paragraphElement.style.fontSize = currentFontSize + "px";
      attempts++;
    }

    // Final overflow handling
    paragraphElement.style.overflowY = "hidden"; // Always hide scrollbar after adjustment
  };

  const processCarouselItem = carouselItem => {
    const blockquote = carouselItem.querySelector(".blockquote");
    const paragraph = carouselItem.querySelector(".blockquote p");

    if (blockquote && paragraph) {
      // The blockquote is sized by flexbox to fill available space in the figure.
      // Its clientHeight will be the target height for the paragraph.
      const maxParagraphHeight = blockquote.clientHeight;

      if (maxParagraphHeight > 20) {
        // Ensure blockquote has a sensible calculated height
        adjustParagraphFontSize(paragraph, maxParagraphHeight);
      } else {
        // Fallback if blockquote height is not correctly determined (e.g., display: none)
        paragraph.style.fontSize = "9px"; // Set to a minimum
        paragraph.style.overflowY = "hidden";
      }
    }
  };

  // Initial adjustment for the active item
  const activeItem = testimonialCarouselElement.querySelector(
    ".carousel-item.active"
  );
  if (activeItem) {
    // Use requestAnimationFrame to ensure layout is complete before calculations
    requestAnimationFrame(() => {
      processCarouselItem(activeItem);
    });
  }

  // Adjust font size when a new slide is shown
  testimonialCarouselElement.addEventListener(
    "slid.bs.carousel",
    function (event) {
      requestAnimationFrame(() => {
        processCarouselItem(event.relatedTarget);
      });
    }
  );

  // Optional: Re-adjust on window resize, as available height might change.
  // Consider adding a debounce function if you enable this for performance.
  // let resizeTimeout;
  // window.addEventListener('resize', () => {
  //     clearTimeout(resizeTimeout);
  //     resizeTimeout = setTimeout(() => {
  //         const currentActiveItem = testimonialCarouselElement.querySelector('.carousel-item.active');
  //         if (currentActiveItem) {
  //             processCarouselItem(currentActiveItem);
  //         }
  //     }, 250); // Debounce delay
  // });
}

// document.addEventListener("DOMContentLoaded", event => {
//   // Select the video element
//   const video = document.getElementById("myVideo");

//   // Set the playback speed (e.g., 0.5 for half speed)
//   if (video) {
//     video.playbackRate = 0.5; // Adjust this value as needed
//   }
// });

document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");
  const successModalElement = document.getElementById("successModal");
  let successModal;

  if (successModalElement) {
    successModal = new bootstrap.Modal(successModalElement);
  }

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent the default page refresh

      // --- Backend Submission (Cloudflare Worker / PHP) would happen here ---
      // For now, we'll simulate a successful submission.
      // In a real scenario, you would use fetch() to send data to your backend.
      // Example with fetch to a Cloudflare Worker (you'll build this later):
      /*
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            fetch('/api/submit-form', { // Replace with your Cloudflare Worker endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => {
                if (!response.ok) {
                    // Handle server errors (e.g., show an error message)
                    // For now, we'll assume success even if the server fails,
                    // but in a real app, you'd want robust error handling.
                    console.error('Form submission error:', response.statusText);
                    // Potentially show a different modal for errors
                    throw new Error('Network response was not ok.');
                }
                return response.json(); // Or response.text() depending on what your worker returns
            })
            .then(result => {
                console.log('Success:', result); // Log success response from server

                // Clear the form fields
                contactForm.reset();

                // Show the success modal
                if (successModal) {
                    successModal.show();
                }
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                // Optionally, display an error message to the user in a different modal or an alert
                alert('There was an error sending your message. Please try again.');
            });
            */

      // --- Simulation for now ---
      console.log("Form submitted (simulated)");
      // Clear the form fields
      contactForm.reset();
      // Show the success modal
      if (successModal) {
        successModal.show();
      }
      // --- End Simulation ---
    });
  }

  // Optional: Set current year in footer
  const currentYearSpan = document.getElementById("currentYear");
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // Your existing YouTube player and other JS can remain here
  // For example:
  // var player;
  // var playlistVideos = ['VIDEO_ID_1', 'VIDEO_ID_2', 'VIDEO_ID_3']; // Replace with your video IDs
  // ... (rest of your YouTube JS)
});
