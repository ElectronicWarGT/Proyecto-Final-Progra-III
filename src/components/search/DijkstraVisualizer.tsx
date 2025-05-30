
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface GraphNode {
  id: number;
  x: number;
  y: number;
  label: string;
  neighbors: { id: number; weight: number }[];
  distance: number;
  previous: number | null;
  visited: boolean;
  current: boolean;
}

const DijkstraVisualizer = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([
    { id: 0, x: 200, y: 100, label: 'A', neighbors: [{id: 1, weight: 4}, {id: 2, weight: 2}], distance: Infinity, previous: null, visited: false, current: false },
    { id: 1, x: 100, y: 200, label: 'B', neighbors: [{id: 0, weight: 4}, {id: 3, weight: 3}, {id: 4, weight: 1}], distance: Infinity, previous: null, visited: false, current: false },
    { id: 2, x: 300, y: 200, label: 'C', neighbors: [{id: 0, weight: 2}, {id: 4, weight: 7}, {id: 5, weight: 1}], distance: Infinity, previous: null, visited: false, current: false },
    { id: 3, x: 50, y: 300, label: 'D', neighbors: [{id: 1, weight: 3}], distance: Infinity, previous: null, visited: false, current: false },
    { id: 4, x: 150, y: 300, label: 'E', neighbors: [{id: 1, weight: 1}, {id: 2, weight: 7}, {id: 5, weight: 2}], distance: Infinity, previous: null, visited: false, current: false },
    { id: 5, x: 250, y: 300, label: 'F', neighbors: [{id: 2, weight: 1}, {id: 4, weight: 2}], distance: Infinity, previous: null, visited: false, current: false }
  ]);
  
  const [startNode, setStartNode] = useState('0');
  const [endNode, setEndNode] = useState('5');
  const [isRunning, setIsRunning] = useState(false);
  const [shortestPath, setShortestPath] = useState<number[]>([]);

  const resetVisualization = () => {
    setNodes(prev => prev.map(node => ({
      ...node,
      distance: Infinity,
      previous: null,
      visited: false,
      current: false
    })));
    setShortestPath([]);
    setIsRunning(false);
  };

  const runDijkstra = async () => {
    if (isRunning) return;
    
    resetVisualization();
    setIsRunning(true);
    
    const start = parseInt(startNode);
    const end = parseInt(endNode);
    
    // Inicializar distancias
    const updatedNodes = nodes.map(node => ({
      ...node,
      distance: node.id === start ? 0 : Infinity,
      previous: null,
      visited: false,
      current: false
    }));
    
    setNodes(updatedNodes);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const unvisited = new Set(updatedNodes.map(n => n.id));
    
    while (unvisited.size > 0) {
      // Encontrar nodo no visitado con menor distancia
      let currentId = -1;
      let minDistance = Infinity;
      
      for (const nodeId of unvisited) {
        const node = updatedNodes.find(n => n.id === nodeId);
        if (node && node.distance < minDistance) {
          minDistance = node.distance;
          currentId = nodeId;
        }
      }
      
      if (currentId === -1 || minDistance === Infinity) break;
      
      // Marcar como actual
      setNodes(prev => prev.map(node => ({
        ...node,
        current: node.id === currentId
      })));
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const currentNode = updatedNodes.find(n => n.id === currentId)!;
      
      // Actualizar distancias de vecinos
      for (const neighbor of currentNode.neighbors) {
        const neighborNode = updatedNodes.find(n => n.id === neighbor.id);
        if (neighborNode && unvisited.has(neighbor.id)) {
          const newDistance = currentNode.distance + neighbor.weight;
          
          if (newDistance < neighborNode.distance) {
            neighborNode.distance = newDistance;
            neighborNode.previous = currentId;
          }
        }
      }
      
      // Marcar como visitado
      currentNode.visited = true;
      currentNode.current = false;
      unvisited.delete(currentId);
      
      setNodes([...updatedNodes]);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Construir camino más corto
    const path: number[] = [];
    let current = end;
    
    while (current !== null) {
      const node = updatedNodes.find(n => n.id === current);
      if (node) {
        path.unshift(current);
        current = node.previous;
      } else {
        break;
      }
    }
    
    if (path[0] === start) {
      setShortestPath(path);
      const pathLabels = path.map(id => {
        const node = updatedNodes.find(n => n.id === id);
        return node ? node.label : id;
      });
      
      const finalDistance = updatedNodes.find(n => n.id === end)?.distance;
      
      toast({
        title: "Dijkstra Completado",
        description: `Camino más corto: ${pathLabels.join(' → ')} (Distancia: ${finalDistance})`,
      });
    } else {
      toast({
        title: "No hay camino",
        description: "No existe un camino entre los nodos seleccionados",
        variant: "destructive"
      });
    }
    
    setIsRunning(false);
  };

  const getNodeColor = (node: GraphNode) => {
    if (node.current) return 'bg-yellow-500';
    if (node.visited) return 'bg-green-500';
    if (shortestPath.includes(node.id)) return 'bg-blue-500';
    return 'bg-gray-300';
  };

  const isEdgeInPath = (nodeId1: number, nodeId2: number) => {
    const index1 = shortestPath.indexOf(nodeId1);
    const index2 = shortestPath.indexOf(nodeId2);
    return index1 !== -1 && index2 !== -1 && Math.abs(index1 - index2) === 1;
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Play className="mr-2 h-5 w-5" />
              Controles Dijkstra
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-2">Nodo inicial</label>
                <Input
                  value={startNode}
                  onChange={(e) => setStartNode(e.target.value)}
                  type="number"
                  min="0"
                  max="5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nodo final</label>
                <Input
                  value={endNode}
                  onChange={(e) => setEndNode(e.target.value)}
                  type="number"
                  min="0"
                  max="5"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={runDijkstra} disabled={isRunning}>
                <Play className="h-4 w-4 mr-2" />
                Ejecutar Dijkstra
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
            <CardTitle>Distancias Actuales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {nodes.map(node => (
                <div key={node.id} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                  <span className="font-medium">{node.label}:</span>
                  <span className={`${node.visited ? 'text-green-600' : 'text-gray-600'}`}>
                    {node.distance === Infinity ? '∞' : node.distance}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graph Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Visualización del Grafo Ponderado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gray-50 rounded-lg h-96 overflow-hidden">
            <svg width="100%" height="100%" className="absolute inset-0">
              {/* Edges */}
              {nodes.map(node => 
                node.neighbors.map(neighbor => {
                  const neighborNode = nodes.find(n => n.id === neighbor.id);
                  if (neighborNode && node.id < neighbor.id) {
                    const isInPath = isEdgeInPath(node.id, neighbor.id);
                    const midX = (node.x + neighborNode.x) / 2;
                    const midY = (node.y + neighborNode.y) / 2;
                    
                    return (
                      <g key={`${node.id}-${neighbor.id}`}>
                        <line
                          x1={node.x}
                          y1={node.y}
                          x2={neighborNode.x}
                          y2={neighborNode.y}
                          stroke={isInPath ? "#3b82f6" : "#6b7280"}
                          strokeWidth={isInPath ? "4" : "2"}
                        />
                        <circle
                          cx={midX}
                          cy={midY}
                          r="12"
                          fill="white"
                          stroke="#374151"
                          strokeWidth="1"
                        />
                        <text
                          x={midX}
                          y={midY}
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="text-xs font-bold"
                        >
                          {neighbor.weight}
                        </text>
                      </g>
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
              <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
              Actual
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              Visitado
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              Camino más corto
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información sobre Dijkstra</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>Complejidad temporal:</strong> O((V + E) log V)
            </div>
            <div>
              <strong>Complejidad espacial:</strong> O(V)
            </div>
            <div>
              <strong>Uso:</strong> Camino más corto con pesos positivos
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DijkstraVisualizer;
