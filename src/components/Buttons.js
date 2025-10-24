import React from 'react';

function MyButton({ label, onClick, className = '' }) {
  return (
    <button 
      className={`my-button ${className}`.trim()}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default MyButton;