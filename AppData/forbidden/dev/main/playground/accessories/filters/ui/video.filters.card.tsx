import React from 'react';

const filters = [
  { id: 1, name: 'Robust', img: 'https://img.freepik.com/free-psd/glow-photo-effect_23-2151464273.jpg?uid=R224914971&ga=GA1.1.304407073.1764758472&semt=ais_hybrid&w=740&q=80' },
  { id: 2, name: 'Salt', img: 'https://img.freepik.com/free-photo/medium-shot-smiley-woman-posing-outside_23-2149557038.jpg?uid=R224914971&ga=GA1.1.304407073.1764758472&semt=ais_hybrid&w=740&q=80' },
  { id: 3, name: 'Metal', img: 'https://img.freepik.com/premium-psd/old-ferruginous-metal-photo-effect_614253-440.jpg?uid=R224914971&ga=GA1.1.304407073.1764758472&semt=ais_hybrid&w=740&q=80' },
  { id: 4, name: 'Gray', img: 'https://img.freepik.com/free-psd/front-view-teenager-holding-guitar_23-2149946175.jpg?uid=R224914971&ga=GA1.1.304407073.1764758472&semt=ais_hybrid&w=740&q=80' },
  { id: 5, name: 'Shadow', img: 'https://img.freepik.com/free-psd/sunblind-photo-effect_23-2150756673.jpg?uid=R224914971&ga=GA1.1.304407073.1764758472&semt=ais_hybrid&w=740&q=80' },
  { id: 6, name: 'Milky Green', img: 'https://img.freepik.com/free-psd/vintage-photo-effect_23-2151325308.jpg?uid=R224914971&ga=GA1.1.304407073.1764758472&semt=ais_hybrid&w=740&q=80' },
];

export const VideoFiltersCard = () => {
  return (
    <div className="filter-grid">
      {filters.map((filter) => (
        <div key={filter.id} className="filter-card-item">
          <div className="filter-thumb-wrapper">
            <img src={filter.img} alt={filter.name} />
          </div>
          <span className="filter-name">{filter.name}</span>
        </div>
      ))}
    </div>
  );
};