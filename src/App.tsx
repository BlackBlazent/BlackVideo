/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import Playground from './components/pages/Playground';
import Folder from './components/pages/Folder';
import Library from './components/pages/Library';
import Toolkits from './components/pages/Toolkits';
import Settings from './components/pages/Settings';
import Extensions from './components/pages/Extensions';
import Streaming from './components/pages/Streaming';
import About from './components/pages/About';

import LanguagePopup from '../AppData/forbidden/dev/global/modals/locale/languages';
import { languages } from '../AppData/forbidden/dev/global/modals/locale/langauge.select';
import { initUserPopup} from "../AppData/forbidden/dev/global/modals/auth/user.create.account";
import UserAccountPopup from '../AppData/forbidden/dev/global/modals/auth/auth.portal';
import { initSearchPopupMechanism } from '../AppData/forbidden/dev/global/modals/search/search.script';
import SearchPreviewPopup from '../AppData/forbidden/dev/global/modals/search/search.context.ui';
import { MenuPopup } from "../AppData/forbidden/dev/global/modals/menu/menu.ui";
import { initMenuPopupMechanism } from "../AppData/forbidden/dev/global/modals/menu/menu.script";
import { initLogoPopupMechanism } from "../AppData/forbidden/dev/global/modals/logo/logo.script";
import { BlackVideoThirdPartyServices } from "../AppData/forbidden/dev/global/modals/logo/logo.ui";
import { updateAppCopyrightYear } from "../AppData/forbidden/dev/footer/copyright.deployer";
import { updateDaysPlayedDuration } from "../AppData/forbidden/dev/footer/days.displayer";
import { updateTemperatureUI } from "../AppData/forbidden/dev/footer/temperature.script";
import { updateUserLocationDetails } from "../AppData/forbidden/dev/footer/countryDetails";
import { startTimeSpentTracker } from "../AppData/forbidden/dev/footer/time.spent";
import { updateScriptureCarousel } from "../AppData/forbidden/dev/footer/holyBible";
import { getUserDisplayName, getUserNameClasses, User } from "../AppData/forbidden/dev/footer/user.signature.name";
import { animateCpuUsage } from '../AppData/forbidden/dev/footer/cpu.percentage';
import { VideoTerminal } from '../AppData/forbidden/dev/footer/components/ui/terminal.ui';

import { GlobalNotifier } from './components/ui/global.notifier';

import './styles/terminal.css'
import './styles/modals/setting.shortcut.css'
import { GlobalSearchResult } from './components/pages/globalSearch.Result';
import SettingsShortcut from '../AppData/forbidden/dev/global/modals/settings/settings.shortcut.ui';

function App() {


  const [user, setUser] = useState<User | null>(null);

  // Initialize menu popup mechanism after DOM is ready
  useEffect(() => {
    // Ensure DOM is ready before initializing
    const timer = setTimeout(() => {
      initMenuPopupMechanism();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // User Signature Name
  useEffect(() => {
    // Replace this with your actual authentication logic
    const checkAuthStatus = () => {
      // Example: Check if user is logged in (localStorage, API call, etc.)
      const isLoggedIn = false; // Replace with your auth check
      
      if (isLoggedIn) {
        const loggedInUser: User = {
          username: 'KendrahJohnson', // From your auth system
          firstName: 'Kendrah', // Optional: if available directly
          isLoggedIn: true
        };
        setUser(loggedInUser);
      } else {
        setUser({ isLoggedIn: false });
      }
    };

    checkAuthStatus();
  }, [user]);

// Language Regional-Translation
const { i18n } = useTranslation(); // 👈 Add useTranslation here to trigger re-render
// Find the language item based on the current i18n language code
  const currentLangCode = i18n.language;
  const currentLang = languages.find(l => l.code === currentLangCode) || languages.find(l => l.code === 'en')!;
  
  // NOTE: If you are using `useTranslation` higher up in the component tree,
  // this component *should* re-render already. If App.tsx is your root, 
  // ensure it is wrapped in an <I18nextProvider> or similar.

  // You will likely need state to manage the visibility of the popup here, 
  // or a wrapper component, but for simplicity, let's keep the button logic simple.


  // Settings Shortcut
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

useEffect(() => {
  const handleToggle = () => setIsSettingsOpen(prev => !prev);
  window.addEventListener('toggle-settings-shortcut', handleToggle);
  return () => window.removeEventListener('toggle-settings-shortcut', handleToggle);
}, []);

  // Search Result Page
const [isResultOpen, setIsResultOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState("");

// We pass the setter to a global window object so the script can trigger it
window.triggerSearch = (query: string) => {
    setSearchQuery(query);
    setIsResultOpen(true);
};

  // CPU Usage
  useEffect(() => {
    let usage = 0;

    const interval = setInterval(() => {
      usage = Math.floor(Math.random() * 100); // Simulated CPU usage
      animateCpuUsage(".cpu-usage", usage);
    }, 1000); // update every 1s

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    initLogoPopupMechanism();
    // initMenuPopupMechanism();
    initSearchPopupMechanism();
    initUserPopup();
    updateAppCopyrightYear();
    updateDaysPlayedDuration();
    updateUserLocationDetails();
    startTimeSpentTracker();
    updateScriptureCarousel(10000); // change every 10 seconds

    updateTemperatureUI(); // initial call
    const interval = setInterval(updateTemperatureUI, 60000); // update every minute
    return () => clearInterval(interval);

  }, []);

  useEffect(() => {
    // Initialize page display based on current URL
    const path = window.location.pathname;
    const allPages = [
      'PlaygroundArsenal', 'FolderArsenal', 'LibraryArsenal', 
      'ToolkitsArsenal', 'SettingsArsenal', 'ExtensionsArsenal', 
      'StreamingArsenal', 'AboutArsenal'
    ];
    
    // Hide all pages first
    allPages.forEach(id => {
      const element = document.getElementById(id);
      if (element) element.style.display = 'none';
    });

    // Show the appropriate page based on URL
    let pageToShow = 'PlaygroundArsenal'; // default
    switch(path) {
      case '/folder': pageToShow = 'FolderArsenal'; break;
      case '/library': pageToShow = 'LibraryArsenal'; break;
      case '/toolkits': pageToShow = 'ToolkitsArsenal'; break;
      case '/settings': pageToShow = 'SettingsArsenal'; break;
      case '/extensions': pageToShow = 'ExtensionsArsenal'; break;
      case '/streaming': pageToShow = 'StreamingArsenal'; break;
      case '/about': pageToShow = 'AboutArsenal'; break;
    }

    const selectedPage = document.getElementById(pageToShow);
    if (selectedPage) selectedPage.style.display = 'block';
  }, []);

  return (
    <>
      <Router>
        <header id="blackvideoTopNavigation" className="blackvideo-top-navigation">
          <div className="top-left">
            <img 
              className="blackvideo-logo" 
              src="/assets/BlackVideo.png" 
              alt="BlackVideo Logo" 
              style={{ cursor: "pointer" }} 
              width="24" 
              height="24"
              onClick={(e) => e.stopPropagation()} // Ensure React's event system doesn't interfere
            />
            <BlackVideoThirdPartyServices />
            <button aria-label="Menu" className="menu-btn">
              <i id="menuAction-btn" className="action-toggle-icons"><img id="menuAction-icon" className="menu-bar-icon" src="/assets/others/menu.png" alt="Menu"/></i>
            </button>
            <MenuPopup />
            {/* Language Selection */}
            {/*  
            <div className="lang-select">
              <button aria-haspopup="listbox" aria-expanded="false">
                <img className="language-icon" src="/assets/others/languages.png" alt="Language"/>
                <span id="languagePreview" className="language-preview" role="text">English</span>
                <i id="languageToggle-icon" className="language-toggle-icon action-toggle-icons"><img id="languageToggle-dropdown-icon" className="dropdown-language-icon" src="/assets/others/dropdown-arrow.png" alt="Select Language"/></i>
              </button>
              // Render only the popup near the button
            <LanguagePopup />
            </div>
            */}
        <div className="lang-select">
        <button aria-haspopup="listbox" aria-expanded={false}>
          <img className="language-icon" src="/assets/others/languages.png" alt="Language"/>
          
          {/* 🟢 CRITICAL FIX: Display the language name dynamically based on state/i18n */}
          <span className="language-preview" role="text">
            {currentLang.name}
          </span>
          
          <i id="languageToggle-icon" className="language-toggle-icon action-toggle-icons">
            <img id="languageToggle-dropdown-icon" className="dropdown-language-icon" src="/assets/others/dropdown-arrow.png" alt="Select Language"/>
          </i>
        </button>
        {/* Render only the popup near the button */}
        <LanguagePopup />
      </div>
          </div>
          <div className="top-center">
            <input type="search" placeholder="Search" aria-label="Search" />
            <button aria-label="Search" className="search-btn">
              <i id="globalSearch-btn" className="global-search-action">
                <img id="global-search-icon" className="search-bvideo-query action-toggle-icons" src="/assets/others/search.png" alt="Search"/>
              </i>
            </button>
            <SearchPreviewPopup />
          </div>
          <div className="top-right">
            <button 
              id="userProfile-btn"
              aria-label="User profile" 
              className="user-profile-action"
            >
              <img 
                id="userProfile-icon" 
                className="user-profile-icon action-toggle-icons" 
                src="/assets/others/user-temp.png" 
                alt="User Profile"
              />
            </button>
            <UserAccountPopup isLoggedIn={user?.isLoggedIn || false} />
            <button className="settings-btn-wrapper" aria-label="Settings" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
              <i id="settings-btn" className="settings-action">
                <img id="settings-icon" className="settings-icon action-toggle-icons" src="/assets/others/settings.png" alt="Settings"/>
              </i>
            </button>
            <SettingsShortcut 
              isVisible={isSettingsOpen} 
              onClose={() => setIsSettingsOpen(false)} 
              />
          </div>
        </header>
        <div className="main-pages-container">
          <div id="PlaygroundArsenal"><Playground /></div>
          <div id="FolderArsenal"><Folder /></div>
          <div id="LibraryArsenal"><Library /></div>
          <div id="ToolkitsArsenal"><Toolkits /></div>
          <div id="SettingsArsenal"><Settings /></div>
          <div id="ExtensionsArsenal"><Extensions /></div>
          <div id="StreamingArsenal"><Streaming /></div>
          <div id="AboutArsenal"><About /></div>
        </div>
        {/* Search input is here */}
       <GlobalSearchResult 
         query={searchQuery} 
         isVisible={isResultOpen} 
         onClose={() => setIsResultOpen(false)} 
       />
        {/*Terminal CLI*/}
        <VideoTerminal />
        {/*Global Notifier*/}
        <GlobalNotifier />
        {/* Video Footer */}
        <footer>
          <div className="footer-left">
          <div id="appCopyright" className="appCopyright"></div>
          <div id="daysPlayedDuration" className="dislayed-duration">69 days / 365 days</div>
          <div className="temperature">Temperature 34 °C | ℉</div>
          <div className="user-continental-location" style={{color:'6cc24a'}}>EUROPE</div>
          <div className="continental-number-code-and-country-code" style={{color:'6cc24a'}}>+7 RU</div>
          <div className="apiIpAddress">000.000.000</div>
          <div className="time-spent">Time spent: 00:00:00</div>
          <div className="scripture" style={{cursor: 'pointer', color: '#6cc24a'}}></div>
          <div className={getUserNameClasses(user)}>{getUserDisplayName(user)}</div>
          </div>
          <div className="cpu-usage">
            <span>CPU</span>
            <div className="cpu-bars" aria-label="CPU usage bars">
          {[...Array(10)].map((_, i) => (
            <div className="cpu-bar-indicator" key={i}></div>
          ))}
        </div>
            <span className="cpu-usage-percentage">60%</span>
          </div>
          <div id="userLegacyBadge" className="zephyra-badge-installer-pill">
            <span className="badge-count">67</span>
          </div>
          <div className="active-extension-port"></div>
          <div className="leds-ports-container" aria-label="Status LEDs">
            <div id="extensions-windows-port" className="extensions-led-port"></div>
          </div>
        </footer>
      </Router>
    </>
  );
}

export default App;
