
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Search, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DoublyListNode {
  value: number;
  next?: DoublyListNode;
  prev?: DoublyListNode;
  id: string;
}

const DoublyLinkedListVisualizer = () => {
  const [head, setHead] = useState<DoublyListNode | null>(null);
  const [tail, setTail] = useState<DoublyListNode | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [currentHighlight, setCurrentHighlight] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addNode = (value: number) => {
    const newNode: DoublyListNode = {
      value,
      id: generateId()
    };

    if (!head) {
      setHead(newNode);
      setTail(newNode);
    } else {
      newNode.prev = tail;
      if (tail) {
        tail.next = newNode;
      }
      setTail(newNode);
    }
    
    toast({
      title: "Nodo agregado",
      description: `Se agregó el valor ${value} al final de la lista`,
    });
  };

  const removeNode = (value: number) => {
    if (!head) return;

    let current = head;
    
    while (current && current.value !== value) {
      current = current.next!;
    }

    if (!current) {
      toast({
        title: "Valor no encontrado",
        description: `El valor ${value} no existe en la lista`,
        variant: "destructive"
      });
      return;
    }

    if (current.prev) {
      current.prev.next = current.next;
    } else {
      setHead(current.next || null);
    }

    if (current.next) {
      current.next.prev = current.prev;
    } else {
      setTail(current.prev || null);
    }

    toast({
      title: "Nodo eliminado",
      description: `Se eliminó el valor ${value} de la lista`,
    });
  };

  const searchNode = async (value: number) => {
    if (!head) {
      toast({
        title: "Lista vacía",
        description: "No hay elementos para buscar",
        variant: "destructive"
      });
      return;
    }

    setIsAnimating(true);
    let current = head;
    let index = 0;

    while (current) {
      setCurrentHighlight(current.id);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (current.value === value) {
        toast({
          title: "¡Encontrado!",
          description: `El valor ${value} está en la posición ${index}`,
        });
        setIsAnimating(false);
        setTimeout(() => setCurrentHighlight(null), 1000);
        return;
      }
      
      current = current.next!;
      index++;
    }

    setCurrentHighlight(null);
    setIsAnimating(false);
    toast({
      title: "No encontrado",
      description: `El valor ${value} no existe en la lista`,
      variant: "destructive"
    });
  };

  const handleAdd = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast({
        title: "Error",
        description: "Por favor ingresa un número válido",
        variant: "destructive"
      });
      return;
    }
    addNode(value);
    setInputValue('');
  };

  const handleRemove = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast({
        title: "Error",
        description: "Por favor ingresa un número válido",
        variant: "destructive"
      });
      return;
    }
    removeNode(value);
    setInputValue('');
  };

  const handleSearch = () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) {
      toast({
        title: "Error",
        description: "Por favor ingresa un número válido",
        variant: "destructive"
      });
      return;
    }
    searchNode(value);
    setSearchValue('');
  };

  const renderList = () => {
    if (!head) {
      return (
        <div className="flex items-center justify-center h-32 text-gray-500">
          Lista vacía - Agrega algunos elementos
        </div>
      );
    }

    const nodes = [];
    let current: DoublyListNode | undefined = head;
    
    while (current) {
      const isHighlighted = currentHighlight === current.id;
      nodes.push(
        <div key={current.id} className="flex flex-col items-center">
          {/* Backward arrow */}
          <div className="h-6 flex items-center">
            {current.prev && (
              <ArrowLeft className="text-gray-400 h-4 w-4" />
            )}
          </div>
          
          {/* Node */}
          <div 
            className={`
              w-16 h-16 rounded-lg border-2 flex items-center justify-center text-white font-bold
              transition-all duration-500 transform
              ${isHighlighted 
                ? 'bg-yellow-500 border-yellow-600 scale-110 shadow-lg' 
                : 'bg-green-500 border-green-600 hover:scale-105'
              }
            `}
          >
            {current.value}
          </div>
          
          {/* Forward arrow */}
          <div className="h-6 flex items-center">
            {current.next && (
              <ArrowRight className="text-gray-600 h-4 w-4" />
            )}
          </div>
        </div>
      );
      current = current.next;
    }

    return (
      <div className="flex items-center justify-center flex-wrap gap-4 p-6">
        <div className="w-8 h-8 border-2 border-gray-400 border-dashed rounded flex items-center justify-center text-gray-400">
          ∅
        </div>
        {nodes}
        <div className="w-8 h-8 border-2 border-gray-400 border-dashed rounded flex items-center justify-center text-gray-400">
          ∅
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Operaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Ingresa un valor"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                type="number"
              />
              <Button onClick={handleAdd} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
              <Button onClick={handleRemove} variant="destructive" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                placeholder="Buscar valor"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                type="number"
              />
              <Button 
                onClick={handleSearch} 
                disabled={isAnimating}
                size="sm"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Lista Doblemente Enlazada</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-32 bg-gray-50 rounded-lg p-4">
            {renderList()}
          </div>
        </CardContent>
      </Card>

      {/* Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>Ventaja:</strong> Navegación bidireccional
            </div>
            <div>
              <strong>Inserción al final:</strong> O(1)
            </div>
            <div>
              <strong>Búsqueda:</strong> O(n)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoublyLinkedListVisualizer;
