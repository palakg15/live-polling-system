import React from 'react';

function IntervuePollTag() {
  return (
    // The className comes from your global index.css file
    <span className="intervuePollTag">
      {/* 👇 This SVG code creates the custom four-pointed star icon */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
      >
        <path d="M12 0L13.845 10.155L24 12L13.845 13.845L12 24L10.155 13.845L0 12L10.155 10.155L12 0Z" />
      </svg>
      Intervue Poll
    </span>
  );
}

export default IntervuePollTag;