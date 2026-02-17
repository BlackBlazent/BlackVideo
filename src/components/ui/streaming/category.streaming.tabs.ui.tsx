/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import React from 'react';
import { ChevronDown } from 'lucide-react';

const CATEGORIES = ['TV Shows', 'Genre', 'Country', 'Year', 'Rating', 'Quality', 'Recently Updated'];

const CategoryStreamingTabs: React.FC = () => {
  return (
    <div className="filter-row">
      {CATEGORIES.map((filter, index) => (
        <button 
          key={filter} 
          className={`filter-tag ${index === 0 ? 'active' : ''}`}
        >
          {filter} <ChevronDown size={14} style={{ opacity: 0.7 }} />
        </button>
      ))}
    </div>
  );
};

export default CategoryStreamingTabs;