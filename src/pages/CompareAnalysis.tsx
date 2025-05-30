
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Clock, ArrowLeft, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const CompareAnalysis = () => {
  const navigate = useNavigate();
  const [algorithm1, setAlgorithm1] = useState<string>('');
  const [algorithm2, setAlgorithm2] = useState<string>('');
  const [dataSize, setDataSize] = useState<string>('1000');
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResults, setComparisonResults] = useState<any>(null);

  const algorithms = [
    { value: 'quicksort', label: 'Quick Sort', complexity: 'O(n log n)' },
    { value: 'mergesort', label: 'Merge Sort', complexity: 'O(n log n)' },
    { value: 'bubblesort', label: 'Bubble Sort', complexity: 'O(n²)' },
    { value: 'bfs', label: 'BFS', complexity: 'O(V + E)' },
    { value: 'dfs', label: 'DFS', complexity: 'O(V + E)' },
    { value: 'dijkstra', label: 'Dijkstra', complexity: 'O((V + E) log V)' }
  ];

  const performanceData = [
    { size: 100, quicksort: 0.1, mergesort: 0.15, bubblesort: 1.2 },
    { size: 500, quicksort: 0.8, mergesort: 1.1, bubblesort: 15.5 },
    { size: 1000, quicksort: 1.8, mergesort: 2.4, bubblesort: 62.3 },
    { size: 5000, quicksort: 12.1, mergesort: 15.8, bubblesort: 1250 },
    { size: 10000, quicksort: 28.5, mergesort: 35.2, bubblesort: 5000 }
  ];

  const complexityData = [
    { n: 10, 'O(n)': 10, 'O(n log n)': 33, 'O(n²)': 100 },
    { n: 100, 'O(n)': 100, 'O(n log n)': 664, 'O(n²)': 10000 },
    { n: 1000, 'O(n)': 1000, 'O(n log n)': 9966, 'O(n²)': 1000000 },
    { n: 10000, 'O(n)': 10000, 'O(n log n)': 132877, 'O(n²)': 100000000 }
  ];

  const handleCompare = () => {
    setIsComparing(true);
    
    // Simular comparación
    setTimeout(() => {
      const alg1 = algorithms.find(a => a.value === algorithm1);
      const alg2 = algorithms.find(a => a.value === algorithm2);
      
      setComparisonResults({
        algorithm1: alg1,
        algorithm2: alg2,
        winner: Math.random() > 0.5 ? alg1 : alg2,
        time1: (Math.random() * 100).toFixed(2),
        time2: (Math.random() * 100).toFixed(2),
        memory1: (Math.random() * 50).toFixed(1),
        memory2: (Math.random() * 50).toFixed(1)
      });
      
      setIsComparing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
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
              <div className="p-2 bg-orange-600 rounded-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Comparador & Análisis</h1>
                <p className="text-gray-600">Compara algoritmos y analiza su rendimiento</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Comparator Tool */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Comparador de Algoritmos
            </CardTitle>
            <CardDescription>
              Selecciona dos algoritmos para comparar su rendimiento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Algoritmo 1</label>
                <Select value={algorithm1} onValueChange={setAlgorithm1}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar algoritmo" />
                  </SelectTrigger>
                  <SelectContent>
                    {algorithms.map((alg) => (
                      <SelectItem key={alg.value} value={alg.value}>
                        {alg.label} - {alg.complexity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Algoritmo 2</label>
                <Select value={algorithm2} onValueChange={setAlgorithm2}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar algoritmo" />
                  </SelectTrigger>
                  <SelectContent>
                    {algorithms.map((alg) => (
                      <SelectItem key={alg.value} value={alg.value}>
                        {alg.label} - {alg.complexity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tamaño de datos</label>
                <Select value={dataSize} onValueChange={setDataSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100 elementos</SelectItem>
                    <SelectItem value="1000">1,000 elementos</SelectItem>
                    <SelectItem value="10000">10,000 elementos</SelectItem>
                    <SelectItem value="100000">100,000 elementos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              onClick={handleCompare} 
              disabled={!algorithm1 || !algorithm2 || isComparing}
              className="w-full"
            >
              {isComparing ? (
                <>Comparando...</>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Comparar Algoritmos
                </>
              )}
            </Button>
            
            {comparisonResults && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-4">Resultados de la Comparación</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded">
                    <h4 className="font-medium">{comparisonResults.algorithm1.label}</h4>
                    <p className="text-sm text-gray-600">Tiempo: {comparisonResults.time1}ms</p>
                    <p className="text-sm text-gray-600">Memoria: {comparisonResults.memory1}MB</p>
                  </div>
                  <div className="bg-white p-4 rounded">
                    <h4 className="font-medium">{comparisonResults.algorithm2.label}</h4>
                    <p className="text-sm text-gray-600">Tiempo: {comparisonResults.time2}ms</p>
                    <p className="text-sm text-gray-600">Memoria: {comparisonResults.memory2}MB</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-100 rounded">
                  <p className="text-green-800 font-medium">
                    Ganador: {comparisonResults.winner.label}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento por Algoritmo</CardTitle>
              <CardDescription>Tiempo de ejecución vs tamaño de entrada</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="size" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="quicksort" stroke="#8884d8" name="Quick Sort" />
                  <Line type="monotone" dataKey="mergesort" stroke="#82ca9d" name="Merge Sort" />
                  <Line type="monotone" dataKey="bubblesort" stroke="#ffc658" name="Bubble Sort" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Análisis de Complejidad</CardTitle>
              <CardDescription>Comparación de diferentes complejidades temporales</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={complexityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="n" />
                  <YAxis scale="log" domain={['dataMin', 'dataMax']} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="O(n)" stroke="#8884d8" />
                  <Line type="monotone" dataKey="O(n log n)" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="O(n²)" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Algorithm Complexity Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Referencia de Complejidades</CardTitle>
            <CardDescription>Complejidad temporal y espacial de algoritmos comunes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Algoritmo</th>
                    <th className="text-left p-2">Mejor Caso</th>
                    <th className="text-left p-2">Caso Promedio</th>
                    <th className="text-left p-2">Peor Caso</th>
                    <th className="text-left p-2">Espacio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Quick Sort</td>
                    <td className="p-2">O(n log n)</td>
                    <td className="p-2">O(n log n)</td>
                    <td className="p-2">O(n²)</td>
                    <td className="p-2">O(log n)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Merge Sort</td>
                    <td className="p-2">O(n log n)</td>
                    <td className="p-2">O(n log n)</td>
                    <td className="p-2">O(n log n)</td>
                    <td className="p-2">O(n)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">BFS</td>
                    <td className="p-2">O(V + E)</td>
                    <td className="p-2">O(V + E)</td>
                    <td className="p-2">O(V + E)</td>
                    <td className="p-2">O(V)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">DFS</td>
                    <td className="p-2">O(V + E)</td>
                    <td className="p-2">O(V + E)</td>
                    <td className="p-2">O(V + E)</td>
                    <td className="p-2">O(V)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Dijkstra</td>
                    <td className="p-2">O((V + E) log V)</td>
                    <td className="p-2">O((V + E) log V)</td>
                    <td className="p-2">O((V + E) log V)</td>
                    <td className="p-2">O(V)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompareAnalysis;
