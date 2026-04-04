import React from 'react';
import PropTypes from 'prop-types';

const starColor = '#fe7e8b'; // gold/orange like in screenshot

const RatingStars = ({ rating = 0, reviewCount = 0, size = 'small', className = '' }) => {
  const fontSize = size === 'small' ? '0.75rem' : '1rem';
  const textSize = size === 'small' ? '0.7rem' : '0.85rem';

  return (
    <div className={`d-flex align-items-center gap-1 ${className}`}>
      <span style={{ color: starColor, fontSize }}>★</span>
      <small style={{ color: '#4A5568', fontSize: textSize, fontWeight: '500' }}>
        {Number(rating).toFixed(1)}
      </small>
    </div>
  );
};

RatingStars.propTypes = {
  rating: PropTypes.number,
  reviewCount: PropTypes.number,
  size: PropTypes.oneOf(['small', 'medium']),
  className: PropTypes.string,
};

export default RatingStars;