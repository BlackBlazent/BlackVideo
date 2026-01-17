// logo.ui.tsx
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
export const BlackVideoThirdPartyServices = () => {
  const services = [
    { name: "BlackVideo (Main Account)", icon: "/assets/BlackVideo.png" },
    { name: "YouTube", icon: "/assets/services/youtube.png" },
    { name: "Vimeo", icon: "/assets/services/vimeo.png" },
    { name: "TikTok", icon: "/assets/services/tiktok.png" },
    { name: "Daily Motion", icon: "/assets/services/daily.motion.png" },
    { name: "Twitch", icon: "/assets/services/twitch.png" },
    { name: "Facebook", icon: "/assets/services/facebook.png" },
    { name: "Brightcove", icon: "/assets/services/brightcove.png" },
    { name: "Instagram", icon: "/assets/services/instagram.png" },
  ];

  return (
    <div id="blackvideo-third-party-services" className="third-party-services-popup" style={{ display: "none" }}>
      {services.map((service, index) => (
        <div key={index} className="third-party-service-item">
          <div className="service-info">
            <img src={service.icon} alt={`${service.name} logo`} className="service-icon" />
            <span className="service-name">{service.name}</span>
          </div>
          <button className="authorize-btn">Authorize</button>
        </div>
      ))}
    </div>
  );
};
