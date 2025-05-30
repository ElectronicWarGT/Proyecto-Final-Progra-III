
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface StackItem {
  value: number;
  id: string;
}

const StackVisualizer = () => {
  const [stack, setStack] = useState<StackItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [lastOperation, setLastOperation] = useState<'push' | 'pop' | null>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const push = (value: number) => {
    const newItem: StackItem = {
      value,
      id: generateId()
    };
    
    setStack(prev => [...prev, newItem]);
    setLastOperation('push');
    
    toast({
      title: "Push realizado",
      description: `Se agregó ${value} al tope de la pila`,
    });
    
    setTimeout(() => setLastOperation(null), 1000);
  };

  const pop = () => {
    if (stack.length === 0) {
      toast({
        title: "Pila vacía",
        description: "No hay elementos para remover",
        variant: "destructive"
      });
      return;
    }

    const poppedItem = stack[stack.length - 1];
    setStack(prev => prev.slice(0, -1));
    setLastOperation('pop');
    
    toast({
      title: "Pop realizado",
      description: `Se removió ${poppedItem.value} del tope de la pila`,
    });
    
    setTimeout(() => setLastOperation(null), 1000);
  };

  const handlePush = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast({
        title: "Error",
        description: "Por favor ingresa un número válido",
        variant: "destructive"
      });
      return;
    }
    push(value);
    setInputValue('');
  };

  const peek = () => {
    if (stack.length === 0) {
      toast({
        title: "Pila vacía",
        description: "No hay elementos en la pila",
        variant: "destructive"
      });
      return;
    }
    
    const topItem = stack[stack.length - 1];
    toast({
      title: "Peek",
      description: `El elemento en el tope es: ${topItem.value}`,
    });
  };

  const renderStack = () => {
    if (stack.length === 0) {
      return (
        <div className="flex items-center justify-center h-32 text-gray-500">
          Pila vacía - Agrega algunos elementos
        </div>
      );
    }

    return (
      <div className="flex flex-col-reverse items-center space-y-reverse space-y-2 p-6">
        {stack.map((item, index) => {
          const isTop = index === stack.length - 1;
          const isAnimated = lastOperation && isTop;
          
          return (
            <div
              key={item.id}
              className={`
                w-24 h-12 bg-orange-500 border-2 border-orange-600 rounded-lg
                flex items-center justify-center text-white font-bold
                transition-all duration-500 transform
                ${isAnimated 
                  ? (lastOperation === 'push' 
                      ? 'animate-bounce scale-110' 
                      : 'animate-pulse scale-90 opacity-50')
                  : 'hover:scale-105'
                }
                ${isTop ? 'shadow-lg ring-2 ring-yellow-300' : ''}
              `}
            >
              {item.value}
              {isTop && (
                <div className="absolute -right-16 text-xs text-gray-600 bg-white px-2 py-1 rounded shadow">
                  TOP
                </div>
              )}
            </div>
          );
        })}
        
        {/* Base of the stack */}
        <div className="w-32 h-2 bg-gray-800 rounded-full mt-2"></div>
        <div className="text-xs text-gray-500">Base</div>
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
              <Button onClick={handlePush} size="sm">
                Push
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button onClick={pop} variant="destructive" className="flex-1">
                <Minus className="h-4 w-4 mr-2" />
                Pop
              </Button>
              <Button onClick={peek} variant="outline" className="flex-1">
                Peek
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado de la Pila</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div><strong>Tamaño:</strong> {stack.length}</div>
              <div><strong>Tope:</strong> {stack.length > 0 ? stack[stack.length - 1].value : 'N/A'}</div>
              <div><strong>Vacía:</strong> {stack.length === 0 ? 'Sí' : 'No'}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Pila (Stack) - LIFO</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-64 bg-gray-50 rounded-lg relative">
            {renderStack()}
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
              <strong>Push:</strong> O(1) - Agregar al tope
            </div>
            <div>
              <strong>Pop:</strong> O(1) - Remover del tope
            </div>
            <div>
              <strong>Principio:</strong> LIFO (Last In, First Out)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StackVisualizer;
