
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap, BarChart3, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import QuickSortVisualizer from '@/components/sorting/QuickSortVisualizer';
import MergeSortVisualizer from '@/components/sorting/MergeSortVisualizer';

const SortingAlgorithms = () => {
  const navigate = useNavigate();
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);

  const algorithms = [
    {
      id: 'quick-sort',
      icon: Zap,
      title: 'Quick Sort',
      description: 'Algoritmo de ordenamiento eficiente que usa divide y vencerás',
      component: QuickSortVisualizer,
      color: 'bg-blue-500',
      complexity: 'O(n log n) promedio'
    },
    {
      id: 'merge-sort',
      icon: TrendingUp,
      title: 'Merge Sort',
      description: 'Algoritmo estable que divide el array y luego combina ordenadamente',
      component: MergeSortVisualizer,
      color: 'bg-green-500',
      complexity: 'O(n log n) siempre'
    }
  ];

  if (selectedAlgorithm) {
    const algorithm = algorithms.find(a => a.id === selectedAlgorithm);
    if (algorithm) {
      const Component = algorithm.component;
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center mb-6">
              <Button 
                onClick={() => setSelectedAlgorithm(null)} 
                variant="outline" 
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{algorithm.title}</h1>
                <p className="text-gray-600">Complejidad: {algorithm.complexity}</p>
              </div>
            </div>
            <Component />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center mb-8">
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Inicio
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Algoritmos de Ordenamiento</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {algorithms.map((algorithm, index) => (
            <Card 
              key={algorithm.id}
              className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedAlgorithm(algorithm.id)}
            >
              <CardHeader className="text-center">
                <div className={`${algorithm.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <algorithm.icon className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl">{algorithm.title}</CardTitle>
                <div className="bg-gray-100 rounded-md px-3 py-1 text-sm text-gray-600">
                  {algorithm.complexity}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  {algorithm.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SortingAlgorithms;
