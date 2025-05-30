
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, GitBranch, Route, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BFSVisualizer from "@/components/search/BFSVisualizer";
import DFSVisualizer from "@/components/search/DFSVisualizer";
import DijkstraVisualizer from "@/components/search/DijkstraVisualizer";

const SearchAlgorithms = () => {
  const navigate = useNavigate();
  const [selectedAlgorithm, setSelectedAlgorithm] = React.useState<string | null>(null);

  const algorithms = [
    {
      id: 'bfs',
      title: 'Búsqueda en Anchura (BFS)',
      description: 'Explora nivel por nivel, encuentra el camino más corto en grafos no ponderados',
      icon: GitBranch,
      component: BFSVisualizer
    },
    {
      id: 'dfs',
      title: 'Búsqueda en Profundidad (DFS)',
      description: 'Explora tan profundo como sea posible antes de retroceder',
      icon: Search,
      component: DFSVisualizer
    },
    {
      id: 'dijkstra',
      title: 'Algoritmo de Dijkstra',
      description: 'Encuentra el camino más corto en grafos con pesos positivos',
      icon: Route,
      component: DijkstraVisualizer
    }
  ];

  const selectedAlgorithmData = algorithms.find(alg => alg.id === selectedAlgorithm);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="p-2 bg-purple-600 rounded-lg">
                <Search className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Algoritmos de Búsqueda</h1>
                <p className="text-gray-600">Visualiza algoritmos de búsqueda y recorrido de grafos</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedAlgorithm ? (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Selecciona un Algoritmo de Búsqueda
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explora diferentes algoritmos de búsqueda y recorrido. Cada uno tiene características 
                únicas y casos de uso específicos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {algorithms.map((algorithm) => (
                <Card 
                  key={algorithm.id}
                  className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => setSelectedAlgorithm(algorithm.id)}
                >
                  <CardHeader className="text-center">
                    <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <algorithm.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{algorithm.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {algorithm.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedAlgorithm(null)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedAlgorithmData?.title}
                </h2>
              </div>
            </div>
            
            {selectedAlgorithmData && (
              <selectedAlgorithmData.component />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAlgorithms;
