declare global {
  interface Window {
    triggerSearch: (query: string) => void;
  }
}
export {};