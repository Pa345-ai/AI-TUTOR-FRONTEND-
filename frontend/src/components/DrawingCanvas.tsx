"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Palette, 
  Eraser, 
  Undo, 
  Redo, 
  Download, 
  Trash2, 
  Circle, 
  Square, 
  Minus, 
  Pen,
  MousePointer,
  Type,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DrawingCanvasProps {
  width?: number;
  height?: number;
  onDrawingChange?: (dataUrl: string) => void;
  initialImage?: string;
  className?: string;
}

interface Point {
  x: number;
  y: number;
}

interface DrawingPath {
  points: Point[];
  color: string;
  width: number;
  tool: 'pen' | 'eraser' | 'line' | 'circle' | 'rectangle' | 'text';
  text?: string;
}

export function DrawingCanvas({ 
  width = 800, 
  height = 600, 
  onDrawingChange,
  initialImage,
  className = ""
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<DrawingPath | null>(null);
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [history, setHistory] = useState<DrawingPath[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser' | 'line' | 'circle' | 'rectangle' | 'text'>('pen');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentWidth, setCurrentWidth] = useState(2);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [textPosition, setTextPosition] = useState<Point | null>(null);

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB'
  ];

  const tools = [
    { id: 'pen', icon: Pen, label: 'Pen' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    { id: 'line', icon: Minus, label: 'Line' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'text', icon: Type, label: 'Text' }
  ];

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Set default styles
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Load initial image if provided
    if (initialImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
      };
      img.src = initialImage;
    }

    // Clear canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  }, [width, height, initialImage]);

  // Redraw all paths
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Redraw all paths
    paths.forEach(path => {
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.width;
      ctx.globalAlpha = path.tool === 'eraser' ? 0.1 : 1;

      if (path.tool === 'pen' || path.tool === 'eraser') {
        if (path.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(path.points[0].x, path.points[0].y);
          for (let i = 1; i < path.points.length; i++) {
            ctx.lineTo(path.points[i].x, path.points[i].y);
          }
          ctx.stroke();
        }
      } else if (path.tool === 'line' && path.points.length === 2) {
        ctx.beginPath();
        ctx.moveTo(path.points[0].x, path.points[0].y);
        ctx.lineTo(path.points[1].x, path.points[1].y);
        ctx.stroke();
      } else if (path.tool === 'circle' && path.points.length === 2) {
        const start = path.points[0];
        const end = path.points[1];
        const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        ctx.beginPath();
        ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (path.tool === 'rectangle' && path.points.length === 2) {
        const start = path.points[0];
        const end = path.points[1];
        ctx.beginPath();
        ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y);
        ctx.stroke();
      } else if (path.tool === 'text' && path.text) {
        ctx.fillStyle = path.color;
        ctx.font = `${path.width * 10}px Arial`;
        ctx.fillText(path.text, path.points[0].x, path.points[0].y);
      }
    });

    // Draw current path being drawn
    if (currentPath && currentPath.points.length > 0) {
      ctx.strokeStyle = currentPath.color;
      ctx.lineWidth = currentPath.width;
      ctx.globalAlpha = currentPath.tool === 'eraser' ? 0.1 : 1;

      if (currentPath.tool === 'pen' || currentPath.tool === 'eraser') {
        if (currentPath.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(currentPath.points[0].x, currentPath.points[0].y);
          for (let i = 1; i < currentPath.points.length; i++) {
            ctx.lineTo(currentPath.points[i].x, currentPath.points[i].y);
          }
          ctx.stroke();
        }
      }
    }
  }, [paths, currentPath, width, height]);

  // Redraw when paths change
  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Get mouse position relative to canvas
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  // Start drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === 'text') {
      const pos = getMousePos(e);
      setTextPosition(pos);
      setShowTextInput(true);
      return;
    }

    const pos = getMousePos(e);
    setIsDrawing(true);
    setStartPoint(pos);
    
    const newPath: DrawingPath = {
      points: [pos],
      color: currentColor,
      width: currentWidth,
      tool: currentTool
    };
    
    setCurrentPath(newPath);
  };

  // Draw
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentPath) return;

    const pos = getMousePos(e);
    
    if (currentTool === 'pen' || currentTool === 'eraser') {
      setCurrentPath(prev => prev ? {
        ...prev,
        points: [...prev.points, pos]
      } : null);
    } else if (currentTool === 'line' || currentTool === 'circle' || currentTool === 'rectangle') {
      setCurrentPath(prev => prev ? {
        ...prev,
        points: [prev.points[0], pos]
      } : null);
    }
  };

  // Stop drawing
  const stopDrawing = () => {
    if (!isDrawing || !currentPath) return;

    setIsDrawing(false);
    
    if (currentPath.points.length > 0) {
      // Save to history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push([...paths, currentPath]);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      
      // Add to paths
      setPaths(prev => [...prev, currentPath]);
    }
    
    setCurrentPath(null);
    setStartPoint(null);
  };

  // Add text
  const addText = () => {
    if (!textInput || !textPosition) return;

    const newPath: DrawingPath = {
      points: [textPosition],
      color: currentColor,
      width: currentWidth,
      tool: 'text',
      text: textInput
    };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...paths, newPath]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    setPaths(prev => [...prev, newPath]);
    setTextInput('');
    setShowTextInput(false);
    setTextPosition(null);
  };

  // Undo
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setPaths(history[historyIndex - 1]);
    }
  };

  // Redo
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setPaths(history[historyIndex + 1]);
    }
  };

  // Clear canvas
  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath(null);
    const newHistory = [...history, []];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Download canvas
  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  // Notify parent of changes
  useEffect(() => {
    if (onDrawingChange) {
      const canvas = canvasRef.current;
      if (canvas) {
        onDrawingChange(canvas.toDataURL());
      }
    }
  }, [paths, onDrawingChange]);

  return (
    <div className={`drawing-canvas-container ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-100 border-b">
        {/* Tools */}
        <div className="flex items-center gap-1">
          {tools.map(tool => {
            const Icon = tool.icon;
            return (
              <Button
                key={tool.id}
                variant={currentTool === tool.id ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentTool(tool.id as any)}
                title={tool.label}
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}
        </div>

        {/* Colors */}
        <div className="flex items-center gap-1">
          {colors.map(color => (
            <button
              key={color}
              className={`w-6 h-6 rounded-full border-2 ${
                currentColor === color ? 'border-gray-800' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setCurrentColor(color)}
            />
          ))}
        </div>

        {/* Brush size */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Size:</label>
          <input
            type="range"
            min="1"
            max="20"
            value={currentWidth}
            onChange={(e) => setCurrentWidth(Number(e.target.value))}
            className="w-20"
          />
          <span className="text-sm text-gray-600">{currentWidth}px</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={historyIndex <= 0}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearCanvas}
            title="Clear"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadCanvas}
            title="Download"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border border-gray-300 cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        
        {/* Text input overlay */}
        {showTextInput && textPosition && (
          <div
            className="absolute bg-white border border-gray-300 rounded p-2 shadow-lg"
            style={{
              left: textPosition.x,
              top: textPosition.y - 40
            }}
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addText()}
              onBlur={addText}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
              placeholder="Enter text..."
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  );
}