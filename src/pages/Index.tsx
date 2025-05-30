
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Database, Zap, BarChart3, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Database,
      title: "Estructuras de Datos",
      description: "Explora listas enlazadas, árboles binarios, pilas y colas de manera visual",
      color: "bg-blue-500",
      path: "/structures"
    },
    {
      icon: Zap,
      title: "Algoritmos de Ordenamiento",
      description: "Visualiza Quick Sort, Merge Sort y otros algoritmos paso a paso",
      color: "bg-green-500",
      path: "/sorting"
    },
    {
      icon: BarChart3,
      title: "Algoritmos de Búsqueda",
      description: "Aprende BFS, DFS y algoritmos de grafos interactivamente",
      color: "bg-purple-500",
      path: "/search"
    },
    {
      icon: Brain,
      title: "Comparador & Análisis",
      description: "Compara eficiencia de algoritmos y analiza complejidad temporal",
      color: "bg-orange-500",
      path: "/compare"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AlgoViz</h1>
              <p className="text-gray-600">Plataforma Educativa de Algoritmos y Estructuras de Datos</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
            Aprende Algoritmos de Manera Visual
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in">
            Explora estructuras de datos y algoritmos fundamentales a través de visualizaciones 
            interactivas y animaciones que hacen fácil entender conceptos complejos.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => navigate(feature.path)}
            >
              <CardHeader className="text-center">
                <div className={`${feature.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Start Section */}
        <div className="bg-white rounded-lg shadow-md p-8 animate-fade-in">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Comenzar Ahora</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2">Selecciona un Tema</h4>
              <p className="text-gray-600 text-sm">Elige entre estructuras de datos o algoritmos</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2">Interactúa</h4>
              <p className="text-gray-600 text-sm">Manipula datos y observa los cambios</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2">Aprende</h4>
              <p className="text-gray-600 text-sm">Comprende conceptos complejos visualmente</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Button 
              onClick={() => navigate('/structures')} 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              Comenzar con Estructuras de Datos
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
