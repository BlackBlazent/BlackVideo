/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import { useEffect, useRef } from 'react';

export default function UserAccountPopup({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updatePosition = () => {
            const button = document.getElementById("userProfile-btn");
            const popup = popupRef.current;

            if (!button || !popup) return;

            const rect = button.getBoundingClientRect();
            const popupWidth = popup.offsetWidth;

            popup.style.position = "absolute";
            popup.style.top = `${rect.bottom + window.scrollY + 8}px`;

            // Place to the left if it would overflow on the right
            let left = rect.left + window.scrollX;
            if (left + popupWidth > window.innerWidth) {
                left = window.innerWidth - popupWidth - 16;
            }

            popup.style.left = `${left}px`;
            popup.style.zIndex = "999";
        };

        const togglePopup = () => {
            const popup = popupRef.current;
            if (!popup) return;

            const isVisible = popup.style.display === "block";
            popup.style.display = isVisible ? "none" : "block";
            if (!isVisible) updatePosition();
        };

        const handleClickOutside = (e: MouseEvent) => {
            const popup = popupRef.current;
            const button = document.getElementById("userProfile-btn");
            
            if (popup && button && 
                !popup.contains(e.target as Node) && 
                !button.contains(e.target as Node)) {
                popup.style.display = "none";
            }
        };

        const button = document.getElementById("userProfile-btn");
        if (button) {
            button.addEventListener("click", togglePopup);
        }

        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            if (button) {
                button.removeEventListener("click", togglePopup);
            }
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={popupRef} id="user-popup-portal" className="user-popup-container" style={{ display: "none" }}>
            {!isLoggedIn ? (
                <div className="user-popup-auth">
                    <div className="create-variants">
                        <button className="user-popup-btn-primary">Create Account</button>
                        <button className="user-popup-btn-primary">Login</button>
                    </div>
                    <div className="user-popup-divider">or</div>
                    <div className="user-popup-socials">
                        <button className="user-popup-social google">
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAzFBMVEVHcEz////////+/v77+/vx8fL9/f309fX+/v739/f////09PXOz8/5+vr8/P3////////29vf///////84qlf8wAdGiPX8/PzsUUTqQjQsqFLrSj3S3/w6g/TqPCs0gPQgpUf85+bv9P+63sL62Nb+8ef4ycbw+PJkunkeePP81HXwgGv0jhzc5/3o9efX7N5Fr19Uj/WQy562zPr2trL94KDzoJrzoJv80Gjyl5H94qgyh9v7xzihsSp+wYV1sE5ZtXBmmvUynoWKrvzKDGT6AAAAE3RSTlMAW+TTeBLcHLMt1WsKzfUznkBIxSDAuAAAAUZJREFUKJFtktligkAMRUFZxKVuDMOAggpu1apVu+/t//9TkxBU1PsySQ4hlyGadpTd0fWOrV2R3eqyWhe80j1RpYCc7pmcI2tyaZimQw6bOTMplU9hpKIofJSUmgwtTCYq9EFhqKIJ5lbGdGIRAGhUQLNX6wRLOA2Y8vdpuvfVOJtaOjhdhL56yYrjU8cGFsRSLc4/x+DPfxBiSZN6LMlXUYXzVghBT8/7pPkdxFX28yzEO8HYI8U9dlQudMZx3AeInWWe+SrExxrhCLTre3E+M3P7FXznLn887z53a2PwGbjBLLvUP2jcYUC/FYdOA9d1g22SbN1fbizT9bUxXA+QguB4G2GlfbIFqw1i0GCzKmzDDQ1LZgPQLKHk5rAJpmSj0ykH0jxArW4V79yqF1bMkEckjYvFrTWIy0btApFsx7m68Ff1D4OdMHbngtKsAAAAAElFTkSuQmCC" alt="Google" />
                        </button>
                        <button className="user-popup-social github">
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAANlBMVEVHcEwYFhYYFhYYFhYYFhYYFhYYFhYYFhYYFhYYFhYYFhYYFhYYFhYYFhYYFhYYFhYYFhYXFhYuazAbAAAAEnRSTlMAI1NiRsL/szsx59mJd6WY9xEDceF6AAAA00lEQVR4AXXRURKDIAwE0BVgMShC73/ZygQrse370WElJILJ4rx3C34IkUNaYUnmZDPbdz6UO0v8cmCo/GHXzJGMUqd1iSS1LZ58L1CCSCgVQCHZMF7oYPirqTadYLrIgLAzg92LxTRuhvM4eAowdAJWxFHVWnlKGgoegobJTGJmOVD/N7TrN3zBeLFz47nByOwAbGQi23Ssb+yiNuYkf+5fNg4rdKsLd+lMFa/TG3xKXsODCmo1s4xQ5v8RY5nDFR9LJlnvMNu5yxQ2j6ewjCoBlzc7/gqauuy1OAAAAABJRU5ErkJggg==" alt="GitHub" />
                        </button>
                        <button className="user-popup-social facebook">
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAgVBMVEUAAAAQcP8IZf8IZ/8JZv8HZf8IZv8IZv8IaP8JZ/8HZv8IZv8FZf8YcP9FjP+TvP/g7P/////R4/9Vlf8QYP+Es/9kn/8IZv8nef8JZf8AYP/v9f/Q4v/B2P9GjP8HZv+yz//Q4/83g/8HZv/g6/+Dsv8HZf/n7//////////e6//ZLyHjAAAAK3RSTlMAEGCfz+//XyCQj98w/////////xD//6D/kBD/////7////8///5Cgz+/vONkvXQAAAPJJREFUeAF9kkUCwzAMBGVSGMrM3P//rxBaB+e6s0YREFJpw2y0cgS1cT3DQLmNWPjcwK/XA24RWIuEdg4j7OtHUX0NYedxko5+jCeZMc0En8FsVDDHSd1WDoFdIlogX46awopozWA+ythsd7s9ZxymJBkcs3wcMZC0YHDKhDNbKLowuGYC21zINIWUbQ7EwwJT7YogqgTTKaTY4tIp7HDIRadwwzVlKVyv11HG9cekFBxam8FbTInuQ4LCd3cL2Uzd+4UV/VkHfUIgMLRdQuBi7JsCxh5rQEAfrO9NYSWojruwBOOhDoR8PF+j0fuipNX+AmbCIviMIiwCAAAAAElFTkSuQmCC" alt="Facebook" />
                        </button>
                        <button className="user-popup-social vk">
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAaVBMVEUAd/8Adf8AcP8Acf8Ac/8/iv+lw/+iwf+Jsf9NkP+ArP9dmP////8Aav8Abf/g6v9jm/8Aa//N3f80hf/c5v8Abv/5+/+tyP8if//A1P8AXf+Otf/K2//o7/8AZv+zzP9Gjf9vo/8bff+hNhBOAAAAu0lEQVR4AWIYZgBQrVwcSBDDQBSVjAPVzAz5B7n2NIew/2JJzyyE9K8UgrdVXaaNtU7lyxrNxG9jP6eqL4CAKIyAWFGSAv7vFmcOiSnMPar3th0l8NcNCyoBW9CFEVAVP3zHzvKAroQFkPzQl4Z8Q64BmGRDlHVB98IGwKf16OuSOzLD1Q/AN468FndVGltxMU7umdVD62FDRWMORAHd42BJN2Tt3jfTI1UE67y6o9TzXG94j5m3x73/rj/osQtRmqtQ8QAAAABJRU5ErkJggg==" alt="VKontakte" />
                        </button>
                        <button className="user-popup-social ok">
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAARVBMVEVHcEz/dwD/dwD/dwD/dwD/dwD/dwD/dwD/dwD/dwD/dwD/dwD/cwD/awD/iDf/4dH/////mVv/+PP/vZj/7uT/q3z/0rokDIa0AAAADHRSTlMAOIfC7P79YP9hF+AdSUZhAAAA+klEQVR4AX2TBQLDIBAEo7gn9P9P7dJwR32rYU4Wm1jzsm672NZlnt4lN8Xa9AsyVr3ImqeK6kPzO3Mecq/UEAsxpRiIXpVtZzk9lDu1jWl1yZeUjiOl4vuABNxGYvY+j9TtySmGMeoAh6eF7aCq96jLlpZppUwPr+cJv55GVrSkVAcCrigRTQUxuKm3W/Wee+7Tzi1PYKCTmwqU5Y6pxFjS6LqxIfjsOjwbWthQww2xoWUsQqtcCtXsG7Ox3Wtt2ezWDgglYppKYaKUqseWudpsNtPV0ZZBpletNTgXau11zfMxcRB9Q/P/A/b/aLL086GWL4iug3i9DnfM5hk42ZLzJAAAAABJRU5ErkJggg==" alt="OK.ru" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="user-popup-profile">
                    <div className="user-popup-name">Hello, User Name</div>
                    <button className="user-popup-btn-primary">Account Settings</button>
                    <button className="user-popup-btn-secondary">Logout</button>
                </div>
            )}
        </div>
    );
}
