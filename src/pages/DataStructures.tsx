
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Link, Binary, Layers, ListOrdered } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LinkedListVisualizer from '@/components/structures/LinkedListVisualizer';
import DoublyLinkedListVisualizer from '@/components/structures/DoublyLinkedListVisualizer';
import BinaryTreeVisualizer from '@/components/structures/BinaryTreeVisualizer';
import StackVisualizer from '@/components/structures/StackVisualizer';
import QueueVisualizer from '@/components/structures/QueueVisualizer';

const DataStructures = () => {
  const navigate = useNavigate();
  const [selectedStructure, setSelectedStructure] = useState<string | null>(null);

  const structures = [
    {
      id: 'linked-list',
      icon: Link,
      title: 'Lista Enlazada',
      description: 'Estructura lineal donde cada elemento apunta al siguiente',
      component: LinkedListVisualizer,
      color: 'bg-blue-500'
    },
    {
      id: 'doubly-linked-list',
      icon: ListOrdered,
      title: 'Lista Doblemente Enlazada',
      description: 'Lista donde cada nodo tiene referencias al anterior y siguiente',
      component: DoublyLinkedListVisualizer,
      color: 'bg-green-500'
    },
    {
      id: 'binary-tree',
      icon: Binary,
      title: 'Árbol Binario',
      description: 'Estructura jerárquica donde cada nodo tiene máximo dos hijos',
      component: BinaryTreeVisualizer,
      color: 'bg-purple-500'
    },
    {
      id: 'stack',
      icon: Layers,
      title: 'Pila (Stack)',
      description: 'Estructura LIFO - Último en entrar, primero en salir',
      component: StackVisualizer,
      color: 'bg-orange-500'
    },
    {
      id: 'queue',
      icon: ListOrdered,
      title: 'Cola (Queue)',
      description: 'Estructura FIFO - Primero en entrar, primero en salir',
      component: QueueVisualizer,
      color: 'bg-red-500'
    }
  ];

  if (selectedStructure) {
    const structure = structures.find(s => s.id === selectedStructure);
    if (structure) {
      const Component = structure.component;
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center mb-6">
              <Button 
                onClick={() => setSelectedStructure(null)} 
                variant="outline" 
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">{structure.title}</h1>
            </div>
            <Component />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
          <h1 className="text-3xl font-bold text-gray-900">Estructuras de Datos</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {structures.map((structure, index) => (
            <Card 
              key={structure.id}
              className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedStructure(structure.id)}
            >
              <CardHeader className="text-center">
                <div className={`${structure.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <structure.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">{structure.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {structure.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataStructures;
