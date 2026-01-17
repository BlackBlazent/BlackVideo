
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Create a container for our custom tooltips
    const tooltipContainer = document.createElement('div');
    tooltipContainer.id = 'custom-tooltip-container';
    tooltipContainer.style.cssText = `
        position: absolute;
        z-index: 10000;
        pointer-events: none;
        display: none;
        background-color: black;
        color: #ffffff;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 14px;
        max-width: 250px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    `;
    document.body.appendChild(tooltipContainer);

    // Find all elements with title attributes
    const elementsWithTitle = document.querySelectorAll('[title]');

    // Add event listeners to each element with a title
    elementsWithTitle.forEach(element => {
        // Store the original title
        const originalTitle = element.getAttribute('title');

        // Remove the original title to prevent the native tooltip
        element.removeAttribute('title');

        // Store the title as a custom data attribute
        element.dataset.customTooltip = originalTitle;

        // Mouse enter event to show tooltip
        element.addEventListener('mouseenter', (e) => {
            showTooltip(e, element.dataset.customTooltip);
        });

        // Mouse move event to reposition tooltip
        element.addEventListener('mousemove', (e) => {
            positionTooltip(e);
        });

        // Mouse leave event to hide tooltip
        element.addEventListener('mouseleave', () => {
            hideTooltip();
        });
    });

    // Typing animation variables
    let typingInterval;
    let currentText = '';
    let fullText = '';
    let currentIndex = 0;

    // Show tooltip with typing animation
    function showTooltip(event, tooltipText) {
        // Reset animation variables
        fullText = tooltipText;
        currentText = '';
        currentIndex = 0;

        // Make tooltip visible
        tooltipContainer.style.display = 'block';
        tooltipContainer.textContent = '';

        // Position tooltip initially
        positionTooltip(event);

        // Clear any existing interval
        clearInterval(typingInterval);

        // Start the typing animation
        typingInterval = setInterval(() => {
            if (currentIndex < fullText.length) {
                currentText += fullText.charAt(currentIndex);
                tooltipContainer.textContent = currentText;
                currentIndex++;
            } else {
                clearInterval(typingInterval);
            }
        }, 30); // Adjust typing speed here
    }

    // Position tooltip near the cursor
    function positionTooltip(event) {
        const offset = 15; // Distance from cursor

        // Calculate position (with offset)
        let left = event.clientX + offset;
        let top = event.clientY + offset;

        // Check if tooltip would go off-screen and adjust if needed
        const tooltipRect = tooltipContainer.getBoundingClientRect();
        const maxX = window.innerWidth - tooltipRect.width - 10;
        const maxY = window.innerHeight - tooltipRect.height - 10;

        if (left > maxX) left = maxX;
        if (top > maxY) top = maxY;

        // Set position
        tooltipContainer.style.left = `${left}px`;
        tooltipContainer.style.top = `${top}px`;
    }

    // Hide tooltip
    function hideTooltip() {
        tooltipContainer.style.display = 'none';
        clearInterval(typingInterval);
    }

    // Handle dynamically added elements with titles
    // Observe DOM changes to catch new elements with title attributes
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        // Check if the added node has a title
                        if (node.hasAttribute && node.hasAttribute('title')) {
                            processNewElement(node);
                        }

                        // Check children of the added node
                        const childrenWithTitle = node.querySelectorAll ?
                            node.querySelectorAll('[title]') : [];
                        childrenWithTitle.forEach(child => {
                            processNewElement(child);
                        });
                    }
                });
            }
        });
    });

    // Function to process newly added elements with title
    function processNewElement(element) {
        const originalTitle = element.getAttribute('title');
        element.removeAttribute('title');
        element.dataset.customTooltip = originalTitle;

        element.addEventListener('mouseenter', (e) => {
            showTooltip(e, element.dataset.customTooltip);
        });

        element.addEventListener('mousemove', (e) => {
            positionTooltip(e);
        });

        element.addEventListener('mouseleave', () => {
            hideTooltip();
        });
    }

    // Start observing the document
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});
