"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  TrendingUp, 
  Activity, 
  Target,
  Play,
  Pause,
  RotateCcw,
  Download,
  Settings,
  Plus,
  Minus,
  Edit3,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DiagramData {
  id: string;
  type: 'bar' | 'pie' | 'line' | 'scatter' | 'flowchart' | 'mindmap';
  title: string;
  data: any;
  config: any;
  createdAt: Date;
}

interface FlowchartNode {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'start' | 'process' | 'decision' | 'end';
  connections: string[];
}

interface MindMapNode {
  id: string;
  label: string;
  x: number;
  y: number;
  level: number;
  parent?: string;
  children: string[];
  color: string;
}

export function InteractiveDiagrams() {
  const [diagrams, setDiagrams] = useState<DiagramData[]>([]);
  const [selectedDiagram, setSelectedDiagram] = useState<DiagramData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newDiagramType, setNewDiagramType] = useState<DiagramData['type']>('bar');
  const [isAnimating, setIsAnimating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [flowchartNodes, setFlowchartNodes] = useState<FlowchartNode[]>([]);
  const [mindMapNodes, setMindMapNodes] = useState<MindMapNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Sample data for different diagram types
  const sampleData = {
    bar: {
      labels: ['Math', 'Science', 'English', 'History', 'Art'],
      datasets: [{
        label: 'Test Scores',
        data: [85, 92, 78, 88, 95],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
      }]
    },
    pie: {
      labels: ['Correct', 'Incorrect', 'Skipped'],
      datasets: [{
        data: [75, 20, 5],
        backgroundColor: ['#4BC0C0', '#FF6384', '#FFCE56']
      }]
    },
    line: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
      datasets: [{
        label: 'Progress',
        data: [60, 65, 70, 75, 80],
        borderColor: '#36A2EB',
        fill: false
      }]
    },
    scatter: {
      datasets: [{
        label: 'Study Time vs Score',
        data: [
          { x: 2, y: 65 },
          { x: 4, y: 75 },
          { x: 6, y: 85 },
          { x: 8, y: 90 },
          { x: 10, y: 95 }
        ],
        backgroundColor: '#36A2EB'
      }]
    }
  };

  // Create new diagram
  const createDiagram = (type: DiagramData['type']) => {
    const newDiagram: DiagramData = {
      id: Date.now().toString(),
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
      data: (sampleData as any)[type] || {},
      config: {
        responsive: true,
        animation: {
          duration: 1000
        }
      },
      createdAt: new Date()
    };

    setDiagrams(prev => [...prev, newDiagram]);
    setSelectedDiagram(newDiagram);
    setIsCreating(false);
  };

  // Delete diagram
  const deleteDiagram = (id: string) => {
    setDiagrams(prev => prev.filter(d => d.id !== id));
    if (selectedDiagram?.id === id) {
      setSelectedDiagram(null);
    }
  };

  // Update diagram data
  const updateDiagramData = (id: string, newData: any) => {
    setDiagrams(prev => prev.map(d => 
      d.id === id ? { ...d, data: newData } : d
    ));
  };

  // Render bar chart
  const renderBarChart = (canvas: HTMLCanvasElement, data: any) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { labels, datasets } = data;
    const maxValue = Math.max(...datasets[0].data);
    const chartWidth = canvas.width - 100;
    const chartHeight = canvas.height - 100;
    const barWidth = chartWidth / labels.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(50, chartHeight + 50);
    ctx.lineTo(chartWidth + 50, chartHeight + 50);
    ctx.stroke();

    // Draw bars
    labels.forEach((label: string, index: number) => {
      const value = datasets[0].data[index];
      const barHeight = (value / maxValue) * chartHeight;
      const x = 50 + index * barWidth + 10;
      const y = chartHeight + 50 - barHeight;

      ctx.fillStyle = datasets[0].backgroundColor[index] || '#36A2EB';
      ctx.fillRect(x, y, barWidth - 20, barHeight);

      // Draw label
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(label, x + (barWidth - 20) / 2, chartHeight + 70);
    });
  };

  // Render pie chart
  const renderPieChart = (canvas: HTMLCanvasElement, data: any) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { datasets } = data;
    const total = datasets[0].data.reduce((a: number, b: number) => a + b, 0);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 50;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let currentAngle = 0;
    datasets[0].data.forEach((value: number, index: number) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = datasets[0].backgroundColor[index] || '#36A2EB';
      ctx.fill();
      
      currentAngle += sliceAngle;
    });
  };

  // Render line chart
  const renderLineChart = (canvas: HTMLCanvasElement, data: any) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { labels, datasets } = data;
    const maxValue = Math.max(...datasets[0].data);
    const chartWidth = canvas.width - 100;
    const chartHeight = canvas.height - 100;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(50, chartHeight + 50);
    ctx.lineTo(chartWidth + 50, chartHeight + 50);
    ctx.stroke();

    // Draw line
    ctx.strokeStyle = datasets[0].borderColor || '#36A2EB';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    labels.forEach((label: string, index: number) => {
      const value = datasets[0].data[index];
      const x = 50 + (index / (labels.length - 1)) * chartWidth;
      const y = chartHeight + 50 - (value / maxValue) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw points
    ctx.fillStyle = datasets[0].borderColor || '#36A2EB';
    labels.forEach((label: string, index: number) => {
      const value = datasets[0].data[index];
      const x = 50 + (index / (labels.length - 1)) * chartWidth;
      const y = chartHeight + 50 - (value / maxValue) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  // Render flowchart
  const renderFlowchart = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    flowchartNodes.forEach(node => {
      // Draw node
      ctx.fillStyle = node.type === 'start' ? '#4CAF50' : 
                     node.type === 'end' ? '#F44336' : 
                     node.type === 'decision' ? '#FF9800' : '#2196F3';
      ctx.fillRect(node.x - 50, node.y - 20, 100, 40);

      // Draw label
      ctx.fillStyle = 'white';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + 5);

      // Draw connections
      node.connections.forEach(connectionId => {
        const targetNode = flowchartNodes.find(n => n.id === connectionId);
        if (targetNode) {
          ctx.strokeStyle = '#333';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y + 20);
          ctx.lineTo(targetNode.x, targetNode.y - 20);
          ctx.stroke();
        }
      });
    });
  };

  // Render mind map
  const renderMindMap = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    mindMapNodes.forEach(node => {
      // Draw node
      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 30, 0, 2 * Math.PI);
      ctx.fill();

      // Draw label
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + 4);

      // Draw connections to children
      node.children.forEach(childId => {
        const childNode = mindMapNodes.find(n => n.id === childId);
        if (childNode) {
          ctx.strokeStyle = '#333';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(childNode.x, childNode.y);
          ctx.stroke();
        }
      });
    });
  };

  // Render selected diagram
  const renderDiagram = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedDiagram) return;

    switch (selectedDiagram.type) {
      case 'bar':
        renderBarChart(canvas, selectedDiagram.data);
        break;
      case 'pie':
        renderPieChart(canvas, selectedDiagram.data);
        break;
      case 'line':
        renderLineChart(canvas, selectedDiagram.data);
        break;
      case 'flowchart':
        renderFlowchart(canvas);
        break;
      case 'mindmap':
        renderMindMap(canvas);
        break;
    }
  }, [selectedDiagram, flowchartNodes, mindMapNodes]);

  // Render diagram when selected diagram changes
  useEffect(() => {
    renderDiagram();
  }, [renderDiagram]);

  // Add flowchart node
  const addFlowchartNode = (type: FlowchartNode['type']) => {
    const newNode: FlowchartNode = {
      id: Date.now().toString(),
      label: `Node ${flowchartNodes.length + 1}`,
      x: 200 + flowchartNodes.length * 50,
      y: 100 + flowchartNodes.length * 50,
      type,
      connections: []
    };
    setFlowchartNodes(prev => [...prev, newNode]);
  };

  // Add mind map node
  const addMindMapNode = (parentId?: string) => {
    const parent = parentId ? mindMapNodes.find(n => n.id === parentId) : null;
    const newNode: MindMapNode = {
      id: Date.now().toString(),
      label: `Node ${mindMapNodes.length + 1}`,
      x: parent ? parent.x + 100 : 400,
      y: parent ? parent.y + 100 : 300,
      level: parent ? parent.level + 1 : 0,
      parent: parentId,
      children: [],
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    };
    
    setMindMapNodes(prev => [...prev, newNode]);
    
    if (parent) {
      setMindMapNodes(prev => prev.map(n => 
        n.id === parentId ? { ...n, children: [...n.children, newNode.id] } : n
      ));
    }
  };

  // Download diagram
  const downloadDiagram = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `${selectedDiagram?.title || 'diagram'}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="interactive-diagrams-container h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <h2 className="text-xl font-semibold">Interactive Diagrams</h2>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Diagram
          </Button>
          {selectedDiagram && (
            <>
              <Button
                variant="outline"
                onClick={downloadDiagram}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAnimating(!isAnimating)}
                className="flex items-center gap-2"
              >
                {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isAnimating ? 'Pause' : 'Animate'}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 border-r p-4">
          <h3 className="font-semibold mb-4">Diagrams</h3>
          <div className="space-y-2">
            {diagrams.map(diagram => (
              <div
                key={diagram.id}
                className={`p-3 rounded-lg cursor-pointer border ${
                  selectedDiagram?.id === diagram.id 
                    ? 'bg-blue-100 border-blue-300' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedDiagram(diagram)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm">{diagram.title}</h4>
                    <p className="text-xs text-gray-500 capitalize">{diagram.type}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDiagram(diagram.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Diagram type specific controls */}
          {selectedDiagram?.type === 'flowchart' && (
            <div className="mt-6">
              <h4 className="font-medium mb-2">Add Nodes</h4>
              <div className="space-y-2">
                <Button
                  size="sm"
                  onClick={() => addFlowchartNode('start')}
                  className="w-full justify-start"
                >
                  Start
                </Button>
                <Button
                  size="sm"
                  onClick={() => addFlowchartNode('process')}
                  className="w-full justify-start"
                >
                  Process
                </Button>
                <Button
                  size="sm"
                  onClick={() => addFlowchartNode('decision')}
                  className="w-full justify-start"
                >
                  Decision
                </Button>
                <Button
                  size="sm"
                  onClick={() => addFlowchartNode('end')}
                  className="w-full justify-start"
                >
                  End
                </Button>
              </div>
            </div>
          )}

          {selectedDiagram?.type === 'mindmap' && (
            <div className="mt-6">
              <h4 className="font-medium mb-2">Add Nodes</h4>
              <Button
                size="sm"
                onClick={() => addMindMapNode()}
                className="w-full justify-start"
              >
                Root Node
              </Button>
              <Button
                size="sm"
                onClick={() => addMindMapNode(selectedNode || undefined)}
                className="w-full justify-start"
                disabled={!selectedNode}
              >
                Child Node
              </Button>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 p-4">
          {selectedDiagram ? (
            <div className="h-full">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">{selectedDiagram.title}</h3>
                <p className="text-sm text-gray-600">
                  Created: {selectedDiagram.createdAt.toLocaleDateString()}
                </p>
              </div>
              
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="w-full h-full"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Select a diagram to view or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create diagram modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Create New Diagram</h3>
            <div className="space-y-3">
              {(['bar', 'pie', 'line', 'scatter', 'flowchart', 'mindmap'] as const).map(type => (
                <Button
                  key={type}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => createDiagram(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)} Chart
                </Button>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}