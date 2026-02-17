// Define types for your JS utility
declare module '*/utils/ip-utils' {
  export const fetchPublicIP: () => Promise<{
    ip: string;
    countryCode: string;
    countryName: string;
  } | null>;
}

// Define types for your server-side logic
declare module '*/AppData/app/database/server/country-block' {
  export const checkIsCountryBanned: (countryCode: string) => boolean;
}