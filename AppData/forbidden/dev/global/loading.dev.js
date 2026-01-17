// HTML string (the structure of the loading container)
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
const loadingHTML = `
  <div id="loading-container">
    <div class="loading-content">
      <img id="loading-image" src="/assets/media/images/icons/general/common/resync/RELOAD.ico" alt="Loading"> <!-- Custom Image -->
      <!-- OR -->
      <!-- <span>🤣</span> --> <!-- Custom Emoji -->
    </div>
  </div>
`;

// CSS string (styling for the loading container)
const loadingCSS = `
  /* Loading Animation Styles */
  #loading-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;  /* Adjust height of the loading bar */
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.141);
    z-index: 9999;
    visibility: hidden; /* Initially hidden */
  }

  .loading-content {
    font-size: 24px;  /* Adjust emoji or text size */
  }

  .loading-content img {
    width: 30px;  /* Adjust custom image size */
    height: 30px; /* Adjust custom image size */
    transition: transform 0.9s ease-in-out; /* Transition to emoji switch */
  }

  /* Fast spin animation */
  @keyframes fast-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* Slow spin animation */
  @keyframes slow-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Inject the CSS into the <head> of the document
const style = document.createElement('style');
style.innerHTML = loadingCSS;
document.head.appendChild(style);

// Inject the HTML into the <body> of the document
document.body.insertAdjacentHTML('beforeend', loadingHTML);

// Function to show the loading animation and apply fast spinning
function showLoading() {
  const image = document.getElementById('loading-image');
  document.getElementById('loading-container').style.visibility = 'visible';

  // Apply fast spinning for the first 1.5 seconds
  image.style.animation = 'fast-spin 1.5s linear forwards';

  // After 1.5 seconds, apply slow spin for the next 7.4 seconds (total 9 seconds)
  setTimeout(function() {
    image.style.animation = 'slow-spin 7.4s linear forwards';
  }, 1500);
}

// Function to switch to an emoji after 0.9 seconds
function switchToEmoji() {
  const image = document.getElementById('loading-image');
  setTimeout(function() {
    image.style.transition = 'transform 0.9s ease-in-out'; // Make smooth transition
    image.style.transform = 'scale(0)'; // Shrink the image before switching to emoji
    setTimeout(function() {
      image.style.display = 'none'; // Hide the image
      const emoji = document.createElement('span');
      emoji.textContent = '🤣'; // Emoji to show
      document.querySelector('.loading-content').appendChild(emoji);
    }, 900); // Wait 0.9s to switch image
  }, 900); // Delay before the image starts shrinking
}

// Function to hide the loading animation
function hideLoading() {
  document.getElementById('loading-container').style.visibility = 'hidden';
}

// Example usage (simulate loading)
setTimeout(function() {
  showLoading();
  switchToEmoji();

  // Simulate some task (e.g., loading data)
  setTimeout(function() {
    hideLoading();
  }, 3000);  // Hide after 3 seconds
}, 1000); // Show loading after 1 second
