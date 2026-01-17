// extensionCardCaller.ts

let isInitialized = false;

export const initExtensionSystem = () => {
    // Prevent multiple listeners if init is called more than once
    if (isInitialized) return; 
    isInitialized = true;

    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const btn = target.closest('#pluginCard-port');

        if (btn) {
            const classList = Array.from(btn.classList);
            // Identify the unique dev class
            const devClass = classList.find(c => 
                c !== 'extension-card' && 
                c !== 'jednazLonestamp' && 
                c !== 'computer-vision' // Add any other global utility classes here
            ) || classList[1];

            const extTitle = btn.getAttribute('title') || 'Untitled Extension';
            
            // Check if the DOM already contains this specific extension to prevent duplicates
            const alreadyOpen = document.querySelector(`.extensionsPlaceholderBuff.${devClass}`);
            if (alreadyOpen) {
                console.log("Extension already open");
                return; 
            }

            const event = new CustomEvent('OPEN_EXTENSION', {
                detail: { 
                    id: `ext-${devClass}`, // Use devClass as ID to ensure uniqueness
                    devClass: devClass, 
                    title: extTitle 
                }
            });
            window.dispatchEvent(event);
        }
    });
};