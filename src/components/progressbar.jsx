import React from 'react';

const ProgressBar = ({ bgcolor, completed, label }) => {
  return (
    <div className="w-full mt-2">
      {label && <p className="text-xs mb-1 font-bold" style={{ color: bgcolor }}>{label}</p>}
      <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
          style={{ 
            width: `${completed}%`, 
            backgroundColor: bgcolor 
          }}
        >
          <span className="text-[10px] text-white font-bold">{`${completed}%`}</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;