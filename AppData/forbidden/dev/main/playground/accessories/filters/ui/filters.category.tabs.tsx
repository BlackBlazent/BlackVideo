import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react'; // If you want the dropdown arrow from the image

import '../../../../../../../../src/styles/modals/video.filter.css';

const categories = ['All', 'Life', 'Food', 'Movies', 'Night', 'Scenery'];

export const FiltersCategoryTabs = () => {
  const [active, setActive] = useState('Life');

  return (
    <div className="filter-tabs-wrapper">
      <div className="filter-tabs-container">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-tab-btn ${active === cat ? 'active' : ''}`}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <button className="tabs-more-btn">
        <ChevronDown size={14} />
      </button>
    </div>
  );
};