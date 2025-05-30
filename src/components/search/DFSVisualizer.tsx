
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface GraphNode {
  id: number;
  x: number;
  y: number;
  label: string;
  neighbors: number[];
  visited: boolean;
  inStack: boolean;
  current: boolean;
}

const DFSVisualizer = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([
    { id: 0, x: 200, y: 100, label: 'A', neighbors: [1, 2], visited: false, inStack: false, current: false },
    { id: 1, x: 100, y: 200, label: 'B', neighbors: [0, 3, 4], visited: false, inStack: false, current: false },
    { id: 2, x: 300, y: 200, label: 'C', neighbors: [0, 5], visited: false, inStack: false, current: false },
    { id: 3, x: 50, y: 300, label: 'D', neighbors: [1], visited: false, inStack: false, current: false },
    { id: 4, x: 150, y: 300, label: 'E', neighbors: [1, 5], visited: false, inStack: false, current: false },
    { id: 5, x: 250, y: 300, label: 'F', neighbors: [2, 4], visited: false, inStack: false, current: false }
  ]);
  
  const [startNode, setStartNode] = useState('0');
  const [isRunning, setIsRunning] = useState(false);
  const [stack, setStack] = useState<number[]>([]);
  const [visitOrder, setVisitOrder] = useState<string[]>([]);

  const resetVisualization = () => {
    setNodes(prev => prev.map(node => ({
      ...node,
      visited: false,
      inStack: false,
      current: false
    })));
    setStack([]);
    setVisitOrder([]);
    setIsRunning(false);
  };

  const runDFS = async () => {
    if (isRunning) return;
    
    resetVisualization();
    setIsRunning(true);
    
    const start = parseInt(startNode);
    const newStack = [start];
    const newVisitOrder: string[] = [];
    const visited = new Set<number>();
    
    setStack(newStack);
    setNodes(prev => prev.map(node => 
      node.id === start 
        ? { ...node, inStack: true }
        : node
    ));
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    while (newStack.length > 0) {
      const currentNodeId = newStack.pop()!;
      
      if (visited.has(currentNodeId)) continue;
      
      // Marcar nodo actual
      setNodes(prev => prev.map(node => ({
        ...node,
        current: node.id === currentNodeId,
        inStack: false
      })));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Marcar como visitado
      visited.add(currentNodeId);
      setNodes(prev => prev.map(node => 
        node.id === currentNodeId 
          ? { ...node, visited: true, current: false }
          : node
      ));
      
      const currentNode = nodes.find(n => n.id === currentNodeId);
      if (currentNode) {
        newVisitOrder.push(currentNode.label);
        setVisitOrder([...newVisitOrder]);
        
        // Agregar vecinos no visitados al stack (en orden reverso para DFS)
        const unvisitedNeighbors = currentNode.neighbors
          .filter(neighborId => !visited.has(neighborId))
          .reverse();
        
        for (const neighborId of unvisitedNeighbors) {
          if (!newStack.includes(neighborId)) {
            newStack.push(neighborId);
            setNodes(prev => prev.map(node => 
              node.id === neighborId 
                ? { ...node, inStack: true }
                : node
            ));
          }
        }
        
        setStack([...newStack]);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    setIsRunning(false);
    toast({
      title: "DFS Completado",
      description: `Orden de visita: ${newVisitOrder.join(' → ')}`,
    });
  };

  const getNodeColor = (node: GraphNode) => {
    if (node.current) return 'bg-yellow-500';
    if (node.visited) return 'bg-green-500';
    if (node.inStack) return 'bg-red-500';
    return 'bg-gray-300';
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Play className="mr-2 h-5 w-5" />
              Controles DFS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nodo inicial</label>
              <Input
                value={startNode}
                onChange={(e) => setStartNode(e.target.value)}
                placeholder="ID del nodo (0-5)"
                type="number"
                min="0"
                max="5"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={runDFS} disabled={isRunning}>
                <Play className="h-4 w-4 mr-2" />
                Ejecutar DFS
              </Button>
              <Button onClick={resetVisualization} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado del Algoritmo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Pila actual:</label>
              <div className="p-2 bg-gray-100 rounded min-h-8">
                {stack.length > 0 ? (
                  stack.map(nodeId => {
                    const node = nodes.find(n => n.id === nodeId);
                    return node ? node.label : nodeId;
                  }).join(' → ')
                ) : 'Vacía'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Orden de visita:</label>
              <div className="p-2 bg-gray-100 rounded min-h-8">
                {visitOrder.join(' → ') || 'Ninguno'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graph Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Visualización del Grafo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gray-50 rounded-lg h-96 overflow-hidden">
            <svg width="100%" height="100%" className="absolute inset-0">
              {/* Edges */}
              {nodes.map(node => 
                node.neighbors.map(neighborId => {
                  const neighbor = nodes.find(n => n.id === neighborId);
                  if (neighbor && node.id < neighborId) {
                    return (
                      <line
                        key={`${node.id}-${neighborId}`}
                        x1={node.x}
                        y1={node.y}
                        x2={neighbor.x}
                        y2={neighbor.y}
                        stroke="#6b7280"
                        strokeWidth="2"
                      />
                    );
                  }
                  return null;
                })
              )}
              
              {/* Nodes */}
              {nodes.map(node => (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="20"
                    className={`${getNodeColor(node)} transition-all duration-500`}
                    stroke="#374151"
                    strokeWidth="2"
                  />
                  <text
                    x={node.x}
                    y={node.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="text-white font-bold"
                    fill="white"
                  >
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          
          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
              No visitado
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              En pila
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
              Actual
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              Visitado
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información sobre DFS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>Complejidad temporal:</strong> O(V + E)
            </div>
            <div>
              <strong>Complejidad espacial:</strong> O(V)
            </div>
            <div>
              <strong>Uso:</strong> Detección de ciclos, componentes conexos
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DFSVisualizer;
