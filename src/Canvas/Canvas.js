import React, { useRef, useState } from 'react';
import './Canvas.css';
import SizeControl from '../SizeControl/SizeControl';

const Canvas = () => {
  const canvas = useRef(null);
  const image = useRef(null);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [affectedCoordinates, setAffectedCoordinates] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageUpload = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setUploadedImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const cropImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const downloadingImage = image.current;
    const width = endPoint.x - startPoint.x;
    const height = endPoint.y - startPoint.y;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(downloadingImage, startPoint.x, startPoint.y, width, height, 0, 0, width, height);
    const dataURL = canvas.toDataURL('image/jpeg');
    downloadingImage.src = dataURL;
    setStartPoint(null);
    setUploadedImage(dataURL);
  };

  const handleMouseDown = e => {
    const canvasCoordinates = canvas.current.getBoundingClientRect();
    setStartPoint({
      x: e.clientX - canvasCoordinates.left,
      y: e.clientY - canvasCoordinates.top,
    });
    setEndPoint({
      x: e.clientX - canvasCoordinates.left,
      y: e.clientY - canvasCoordinates.top,
    });
    setIsDrawing(true);
  };

  const handleMouseMove = e => {
    if (isDrawing && startPoint) {
      const canvasCoordinates = canvas.current.getBoundingClientRect();
      setEndPoint({
        x: Math.abs(e.clientX - canvasCoordinates.left),
        y: Math.abs(e.clientY - canvasCoordinates.top),
      });
    }
  };

  const handleMouseUp = () => {
    if (startPoint) {
      setIsDrawing(false);
    }
  };

  const handleStartDragging = (e, x1, x2, y1, y2) => {
    setIsDragging(true);
    setAffectedCoordinates({
      x1,
      x2,
      y1,
      y2,
    });
  };

  const handleControlDrag = e => {
    const canvasCoordinates = canvas.current.getBoundingClientRect();
    e.persist();
    setStartPoint({
      x: affectedCoordinates.x1 ? Math.abs(e.clientX - canvasCoordinates.left) : startPoint.x,
      y: affectedCoordinates.y1 ? Math.abs(e.clientY - canvasCoordinates.top) : startPoint.y,
    });
    setEndPoint({
      x: affectedCoordinates.x2 ? Math.abs(e.clientX - canvasCoordinates.left) : endPoint.x,
      y: affectedCoordinates.y2 ? Math.abs(e.clientY - canvasCoordinates.top) : endPoint.y,
    });
  };

  const handleStopDragging = () => {
    setIsDragging(false);
  };

  const canvasWidth = canvas.current && canvas.current.offsetWidth;
  const canvasHeight = canvas.current && canvas.current.offsetHeight;

  const leftTopControl = startPoint
    ? {
        top: `${startPoint.y}px`,
        left: `${startPoint.x}px`,
        transform: `translate(${-50}%, ${-50}%)`,
        display: `block`,
        cursor: `nwse-resize`,
      }
    : null;

  const rightBottomControl = startPoint
    ? {
        top: `${endPoint.y}px`,
        left: `${endPoint.x}px`,
        transform: `translate(${-50}%, ${-50}%)`,
        display: `block`,
        cursor: `nwse-resize`,
      }
    : null;

  const leftBottomControl = startPoint
    ? {
        top: `${endPoint.y}px`,
        left: `${startPoint.x}px`,
        transform: `translate(${-50}%, ${-50}%)`,
        display: `block`,
        cursor: `nesw-resize`,
      }
    : null;

  const rightTopControl = startPoint
    ? {
        top: `${startPoint.y}px`,
        left: `${endPoint.x}px`,
        transform: `translate(${-50}%, ${-50}%)`,
        display: `block`,
        cursor: `nesw-resize`,
      }
    : null;

  const leftControl = startPoint
    ? {
        top: `${(startPoint.y + endPoint.y) / 2}px`,
        left: `${startPoint.x}px`,
        transform: `translate(${-50}%, ${-50}%)`,
        display: `block`,
      }
    : null;

  const bottomControl = startPoint
    ? {
        top: `${endPoint.y}px`,
        left: `${(startPoint.x + endPoint.x) / 2}px`,
        transform: `translate(${-50}%, ${-50}%)`,
        display: `block`,
        cursor: `ns-resize`,
      }
    : null;

  const topControl = startPoint
    ? {
        top: `${startPoint.y}px`,
        left: `${(startPoint.x + endPoint.x) / 2}px`,
        transform: `translate(${-50}%, ${-50}%)`,
        display: `block`,
        cursor: `ns-resize`,
      }
    : null;

  const rightControl = startPoint
    ? {
        top: `${(startPoint.y + endPoint.y) / 2}px`,
        left: `${endPoint.x}px`,
        transform: `translate(${-50}%, ${-50}%)`,
        display: `block`,
      }
    : null;

  const topRectangleStyle = startPoint
    ? {
        height: endPoint.y < startPoint.y ? `${endPoint.y}px` : `${startPoint.y}px`,
        width: `${Math.abs(endPoint.x - startPoint.x)}px`,
        left: endPoint.x < startPoint.x ? `${endPoint.x}px` : `${startPoint.x}px`,
      }
    : null;

  const bottomRectangleStyle = startPoint
    ? {
        left: endPoint.x < startPoint.x ? `${endPoint.x}px` : `${startPoint.x}px`,
        width: `${Math.abs(endPoint.x - startPoint.x)}px`,
        height:
          endPoint.y < startPoint.y
            ? `${canvasHeight - startPoint.y}px`
            : `${canvasHeight - endPoint.y}px`,
        top: endPoint.y < startPoint.y ? `${startPoint.y}px` : `${endPoint.y}px`,
      }
    : null;

  const leftRectangleStyle = startPoint
    ? {
        width: endPoint.x < startPoint.x ? `${endPoint.x}px` : `${startPoint.x}px`,
      }
    : null;

  const rightRectangleStyle = startPoint
    ? {
        width:
          endPoint.x < startPoint.x
            ? `${canvasWidth - startPoint.x}px`
            : `${canvasWidth - endPoint.x}px`,
        left: endPoint.x < startPoint.x ? `${startPoint.x}px` : `${endPoint.x}px`,
      }
    : null;

  const coord = {
    x1: 'x1',
    x2: 'x2',
    y1: 'y1',
    y2: 'y2',
  };

  const canvasStyle = {
    width: canvasWidth,
    height: canvasHeight,
  };

  return (
    <div className="wrapper">
      <input type="file" onChange={handleImageUpload} />
      <a href={uploadedImage} download>
        Download
      </a>
      <button type="button" className="crop" onClick={cropImage}>
        Crop
      </button>
      <div
        className="canvas"
        ref={canvas}
        onMouseDown={handleMouseDown}
        onMouseMove={isDragging ? handleControlDrag : handleMouseMove}
        onMouseUp={isDragging ? handleStopDragging : handleMouseUp}
      >
        <img ref={image} src={uploadedImage} alt="" />
        <SizeControl
          className="draggable-rect-hor"
          style={leftTopControl}
          isDragging={isDragging}
          onStartDragging={handleStartDragging}
          coordinates={{ x1: coord.x1, x2: null, y1: coord.y1, y2: null }}
        />
        <SizeControl
          className="draggable-rect-hor"
          style={rightBottomControl}
          isDragging={isDragging}
          onStartDragging={handleStartDragging}
          coordinates={{ x1: null, x2: coord.x2, y1: null, y2: coord.y2 }}
        />
        <SizeControl
          className="draggable-rect-hor"
          style={rightTopControl}
          isDragging={isDragging}
          onStartDragging={handleStartDragging}
          coordinates={{ x1: null, x2: coord.x2, y1: coord.y1, y2: null }}
        />
        <SizeControl
          className="draggable-rect-hor"
          style={leftBottomControl}
          isDragging={isDragging}
          onStartDragging={handleStartDragging}
          coordinates={{ x1: coord.x1, x2: null, y1: null, y2: coord.y2 }}
        />
        <SizeControl
          className="draggable-rect-hor"
          style={topControl}
          isDragging={isDragging}
          onStartDragging={handleStartDragging}
          coordinates={{ x1: null, x2: null, y1: coord.y1, y2: null }}
        />
        <SizeControl
          className="draggable-rect-hor"
          style={bottomControl}
          isDragging={isDragging}
          onStartDragging={handleStartDragging}
          coordinates={{ x1: null, x2: null, y1: null, y2: coord.y2 }}
        />
        <SizeControl
          className="draggable-rect-hor"
          style={leftControl}
          isDragging={isDragging}
          onStartDragging={handleStartDragging}
          coordinates={{ x1: coord.x1, x2: null, y1: null, y2: null }}
        />
        <SizeControl
          className="draggable-rect-hor"
          style={rightControl}
          isDragging={isDragging}
          onStartDragging={handleStartDragging}
          coordinates={{ x1: null, x2: coord.x2, y1: null, y2: null }}
        />

        <div className="dimness dimness-right" style={rightRectangleStyle} />
        <div className="dimness dimness-top" style={topRectangleStyle} />
        <div className="dimness dimness-left" style={leftRectangleStyle} />
        <div className="dimness dimness-bottom" style={bottomRectangleStyle} />
      </div>
    </div>
  );
};
export default Canvas;
