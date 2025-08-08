import React from 'react';
import './CustomDropdown.css';

const YearDropdown = ({ selectedYear, onChange, years }) => {
  return (
    <select
      className="custom-dropdown"
      value={selectedYear}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );
};

export default YearDropdown;
