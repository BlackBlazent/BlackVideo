/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

/**
 * Applies lazy loading to all images on a webpage
 * Handles both existing images and dynamically added ones
 */
(function() {
    let observer = null;
    let intervalId = null;
    let isInitialized = false;
  
    // Function to apply lazy loading to an image
    function applyLazyLoading(img) {
        // Skip if already has lazy loading
        if (img.getAttribute('loading') === 'lazy') {
            return false;
        }
        
        // Add loading="lazy" attribute
        img.setAttribute('loading', 'lazy');
        return true;
    }
  
    // Function to process all images on the page
    function processImages() {
        const images = document.querySelectorAll('img');
        let modifiedCount = 0;
        
        if (images.length === 0) {
            console.log("No images found on the page yet. Will continue monitoring...");
            return 0;
        }
        
        // Loop through each image
        images.forEach(img => {
            if (applyLazyLoading(img)) {
                modifiedCount++;
            }
        });
        
        if (modifiedCount > 0) {
            console.log(`Lazy loading applied to ${modifiedCount} images.`);
        }
        
        return modifiedCount;
    }
  
    // Function to safely start the MutationObserver
    function startObserver() {
        // Stop existing observer if any
        if (observer) {
            observer.disconnect();
        }
  
        // Only observe if document.body exists
        const targetNode = document.body || document.documentElement;
        if (!targetNode) {
            console.warn("Neither document.body nor document.documentElement available for observation");
            return;
        }
  
        observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    let newImages = 0;
                    
                    mutation.addedNodes.forEach(function(node) {
                        // Skip text nodes and other non-element nodes
                        if (node.nodeType !== Node.ELEMENT_NODE) {
                            return;
                        }
                        
                        // If the added node is an image, apply lazy loading
                        if (node.nodeName === 'IMG') {
                            if (applyLazyLoading(node)) {
                                newImages++;
                            }
                        }
                        
                        // If the added node contains images, process them
                        if (node.querySelectorAll) {
                            const childImages = node.querySelectorAll('img');
                            childImages.forEach(function(img) {
                                if (applyLazyLoading(img)) {
                                    newImages++;
                                }
                            });
                        }
                    });
                    
                    if (newImages > 0) {
                        console.log(`Lazy loading applied to ${newImages} newly added images.`);
                    }
                }
            });
        });
  
        // Start observing
        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });
    }
  
    // Function to initialize the lazy loading system
    function initialize() {
        if (isInitialized) {
            return;
        }
        
        console.log("Initializing image lazy loading deployer...");
        
        // Process existing images
        processImages();
        
        // Start the mutation observer
        startObserver();
        
        // Set up periodic checking (reduced frequency to be less aggressive)
        intervalId = setInterval(function() {
            const modified = processImages();
            // If we're not finding new images for a while, we could reduce frequency further
        }, 5000);
        
        isInitialized = true;
        console.log("Image lazy loading deployer initialized successfully.");
    }
  
    // Function to handle page load events
    function handlePageLoad() {
        console.log("Page loaded - re-checking images...");
        const modified = processImages();
        
        // Restart observer in case DOM structure changed significantly
        if (document.body && observer) {
            startObserver();
        }
    }
  
    // Initialize based on document ready state
    function start() {
        if (document.readyState === 'loading') {
            // DOM is still loading
            document.addEventListener('DOMContentLoaded', initialize);
        } else {
            // DOM is already loaded
            initialize();
        }
        
        // Also handle the window load event
        if (document.readyState !== 'complete') {
            window.addEventListener('load', handlePageLoad);
        } else {
            // Page is already fully loaded
            handlePageLoad();
        }
    }
  
    // Cleanup function (useful for testing or if you need to stop the observer)
    window.stopLazyLoadingDeployer = function() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        isInitialized = false;
        console.log("Lazy loading deployer stopped.");
    };
  
    // Start the system
    start();
  })();