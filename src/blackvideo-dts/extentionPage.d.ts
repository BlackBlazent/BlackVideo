export interface ExtensionPlugin {
    id: string;
    title: string;
    description: string;
    type: 'Extension' | 'Plugin';
    category: 'Enhancement' | 'Utility' | 'Theme' | 'Effect';
    developerName: string;
    developerAvatar: string;
    isSubscription: boolean;
    likes: number;
    installs: number;
    rating: number;
    lastUpdated: string;
}