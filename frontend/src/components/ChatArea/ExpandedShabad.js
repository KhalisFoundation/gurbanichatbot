import React from 'react';
import crossicon from '../../assets/images/cross.png';

const ExpandedShabad = ({ shabad, onClose }) => {
  return (
    <div className="expanded-shabad">
      <div className="cross-icon-container" onClick={onClose}>
        <img src={crossicon} alt="Close" className="cross-icon-img" />
      </div>

      {shabad.verses.map((verse, index) => (
        <div key={index}>
          <p className="gurbani-verse">{verse.verse}</p>
          <p className="gurbani-translation">{verse.translation}</p>
        </div>
      ))}
    </div>
  );
};

export default ExpandedShabad;
