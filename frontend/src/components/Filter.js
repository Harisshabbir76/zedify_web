import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { FaFilter } from 'react-icons/fa';

// Logo pink color palette
const logoColors = {
  primary: '#FF69B4', // Hot pink - main logo color
  secondary: '#FF1493', // Deep pink - darker shade
  light: '#FFB6C1', // Light pink - for accents
  dark: '#C71585', // Medium violet red - very dark pink
  background: '#FFF5F7', // Super light pink - almost white
  gradient: 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)', // Pink gradient from logo
  softGradient: 'linear-gradient(135deg, #FFF0F3 0%, #FFE4E8 100%)', // Very soft pink gradient
};

const FilterComponent = ({ sortOption, onSortChange }) => {
  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price-high-low', label: 'Price: High to Low' },
    { value: 'price-low-high', label: 'Price: Low to High' },
    { value: 'rating-high', label: 'Highest Rating' },
    { value: 'newest', label: 'Newest' }
  ];

  return (
    <div className="d-flex justify-content-end mb-3">
      <Dropdown>
        <Dropdown.Toggle
          variant="outline-secondary"
          id="dropdown-sort"
          style={{
            borderColor: logoColors.light,
            color: logoColors.dark,
            background: logoColors.softGradient,
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = logoColors.gradient;
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.borderColor = 'transparent';
            e.currentTarget.style.boxShadow = `0 4px 12px ${logoColors.primary}40`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = logoColors.softGradient;
            e.currentTarget.style.color = logoColors.dark;
            e.currentTarget.style.borderColor = logoColors.light;
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <FaFilter className="me-2" style={{ color: logoColors.primary }} />
          {sortOptions.find(opt => opt.value === sortOption)?.label || 'Sort By'}
        </Dropdown.Toggle>
        <Dropdown.Menu style={{
          borderRadius: '8px',
          border: `1px solid ${logoColors.light}`,
          boxShadow: `0 4px 12px rgba(0,0,0,0.1)`,
          padding: '0.5rem',
          minWidth: '200px'
        }}>
          {sortOptions.map((option) => (
            <Dropdown.Item
              key={option.value}
              active={sortOption === option.value}
              onClick={() => onSortChange(option.value)}
              style={{
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                transition: 'all 0.2s ease',
                backgroundColor: sortOption === option.value ? logoColors.softGradient : 'transparent',
                color: sortOption === option.value ? logoColors.dark : '#4A5568',
                fontWeight: sortOption === option.value ? '600' : '400'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = logoColors.softGradient;
                e.currentTarget.style.color = logoColors.dark;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = sortOption === option.value ? logoColors.softGradient : 'transparent';
                e.currentTarget.style.color = sortOption === option.value ? logoColors.dark : '#4A5568';
              }}
            >
              {option.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default FilterComponent;