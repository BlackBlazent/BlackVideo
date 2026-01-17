// dependencies-checker-loader.ts
import { runFullAppWarmup } from './dependencies.checker';

const launchDependenciesCheck = async (): Promise<void> => {
    try {
        // Wait for the UI/DOM to exist before showing popups
        if (document.readyState === 'loading') {
            await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
        }

        console.log('📦 BlackVideo Dependency Loader Active');
        
        // Simulate a small delay like a real app splash screen
        setTimeout(async () => {
            await runFullAppWarmup();
        }, 1000);

    } catch (error) {
        console.error('Critical failure during warmup:', error);
    }
};

// Auto-execute on load
launchDependenciesCheck();

export default launchDependenciesCheck;