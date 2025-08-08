import React from 'react';
import './ToggleCircle.css';



const ToggleCircle = ({ checked, onChange }) => {
  return (
    <div
      className={`toggle-circle-wrapper ${checked ? 'checked' : ''}`}
      onClick={onChange}
    >
      <div className={`toggle-circle ${checked ? 'checked' : ''}`}></div>
    </div>
  );
};

export default ToggleCircle;