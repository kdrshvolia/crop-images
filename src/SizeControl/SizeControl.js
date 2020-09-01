import React, { useRef } from 'react';
import './SizeControl.css';

const SizeControl = ({ coordinates, onStartDragging, style }) => {
  const control = useRef(null);

  const handleMouseDown = e => {
    e.stopPropagation();
    onStartDragging(e, coordinates.x1, coordinates.x2, coordinates.y1, coordinates.y2);
  };

  return (
    <div ref={control} className="draggable-rect" style={style} onMouseDown={handleMouseDown} />
  );
};

export default SizeControl;
