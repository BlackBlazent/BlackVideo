/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

/*
// Title bar headers
document.addEventListener("DOMContentLoaded", () => {
    const titles = [
        "1.1.01.001.0001-beta",
        "BlackRose",
        "Unofficial Release",
        "BlackMusic"
    ]; // List of titles
    let index = 0; // Start index

    // Function to update the title
    setInterval(() => {
        document.title = titles[index];
        index = (index + 1) % titles.length; // Cycle through the titles
    }, 10000); // Change title every 2 seconds
});

// Title bar icons

document.addEventListener("DOMContentLoaded", () => {
    const favicon = document.querySelector("link[rel='icon']");
    const originalIcon = new Image();
    originalIcon.src = favicon.href; // Use the current favicon
    let angle = 0; // Starting rotation angle

    const rotateFavicon = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas size to favicon size (32x32 or adjust as needed)
        canvas.width = 32;
        canvas.height = 32;

        // Clear canvas and apply rotation
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((angle * Math.PI) / 180); // Convert degrees to radians
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        ctx.drawImage(originalIcon, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        // Update favicon
        favicon.href = canvas.toDataURL("image/png");
        angle = (angle + 10) % 360; // Increment angle
    };

    setInterval(rotateFavicon, 20000); // Rotate every 200ms
});


document.addEventListener("DOMContentLoaded", () => {
    const favicon = document.querySelector("link[rel='icon']");
    const icons = [
        "../AppData/bmusic/assets/media/images/icons/drawable/ico_variants/ico_var2.png",
        "../AppData/bmusic/assets/media/images/icons/drawable/ico_variants/ico_var3.png",
    ];
    let index = 0;

    setInterval(() => {
        favicon.href = icons[index];
        index = (index + 1) % icons.length; // Cycle through icons
    }, 20000); // Change icon every 2 seconds
});
*/

// Title bar headers
document.addEventListener("DOMContentLoaded", () => {
    const titles = [
        "1.1.01.001.0001-beta",
        "zephyra",
        "Unofficial Release",
        "BlackVideo"
    ]; // List of titles
    let index = 0; // Start index

    // Function to update the title
    setInterval(() => {
        document.title = titles[index];
        index = (index + 1) % titles.length; // Cycle through the titles
    }, 10000); // Change title every 10 seconds
});

