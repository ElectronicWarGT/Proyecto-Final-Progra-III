
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Minus, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QueueItem {
  value: number;
  id: string;
}

const QueueVisualizer = () => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [lastOperation, setLastOperation] = useState<'enqueue' | 'dequeue' | null>(null);
  const [operationIndex, setOperationIndex] = useState<number | null>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const enqueue = (value: number) => {
    const newItem: QueueItem = {
      value,
      id: generateId()
    };
    
    setQueue(prev => [...prev, newItem]);
    setLastOperation('enqueue');
    setOperationIndex(queue.length);
    
    toast({
      title: "Enqueue realizado",
      description: `Se agregó ${value} al final de la cola`,
    });
    
    setTimeout(() => {
      setLastOperation(null);
      setOperationIndex(null);
    }, 1000);
  };

  const dequeue = () => {
    if (queue.length === 0) {
      toast({
        title: "Cola vacía",
        description: "No hay elementos para remover",
        variant: "destructive"
      });
      return;
    }

    const dequeuedItem = queue[0];
    setQueue(prev => prev.slice(1));
    setLastOperation('dequeue');
    setOperationIndex(0);
    
    toast({
      title: "Dequeue realizado",
      description: `Se removió ${dequeuedItem.value} del frente de la cola`,
    });
    
    setTimeout(() => {
      setLastOperation(null);
      setOperationIndex(null);
    }, 1000);
  };

  const handleEnqueue = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast({
        title: "Error",
        description: "Por favor ingresa un número válido",
        variant: "destructive"
      });
      return;
    }
    enqueue(value);
    setInputValue('');
  };

  const front = () => {
    if (queue.length === 0) {
      toast({
        title: "Cola vacía",
        description: "No hay elementos en la cola",
        variant: "destructive"
      });
      return;
    }
    
    const frontItem = queue[0];
    toast({
      title: "Front",
      description: `El elemento al frente es: ${frontItem.value}`,
    });
  };

  const renderQueue = () => {
    if (queue.length === 0) {
      return (
        <div className="flex items-center justify-center h-32 text-gray-500">
          Cola vacía - Agrega algunos elementos
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center space-x-4 p-6">
        {/* Front indicator */}
        <div className="text-xs text-gray-500 writing-mode-vertical">
          FRONT
        </div>
        
        {queue.map((item, index) => {
          const isFront = index === 0;
          const isRear = index === queue.length - 1;
          const isAnimated = lastOperation && operationIndex === index;
          
          return (
            <div key={item.id} className="flex items-center">
              <div
                className={`
                  w-16 h-16 bg-red-500 border-2 border-red-600 rounded-lg
                  flex items-center justify-center text-white font-bold
                  transition-all duration-500 transform relative
                  ${isAnimated 
                    ? (lastOperation === 'enqueue' 
                        ? 'animate-bounce scale-110' 
                        : 'animate-pulse scale-90 opacity-50')
                    : 'hover:scale-105'
                  }
                  ${isFront ? 'shadow-lg ring-2 ring-blue-300' : ''}
                  ${isRear ? 'shadow-lg ring-2 ring-green-300' : ''}
                `}
              >
                {item.value}
                
                {isFront && (
                  <div className="absolute -top-8 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    FRONT
                  </div>
                )}
                
                {isRear && (
                  <div className="absolute -bottom-8 text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                    REAR
                  </div>
                )}
              </div>
              
              {index < queue.length - 1 && (
                <ArrowRight className="mx-2 text-gray-600 h-6 w-6" />
              )}
            </div>
          );
        })}
        
        {/* Rear indicator */}
        <div className="text-xs text-gray-500 writing-mode-vertical">
          REAR
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
              <Button onClick={handleEnqueue} size="sm">
                Enqueue
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button onClick={dequeue} variant="destructive" className="flex-1">
                <Minus className="h-4 w-4 mr-2" />
                Dequeue
              </Button>
              <Button onClick={front} variant="outline" className="flex-1">
                Front
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado de la Cola</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div><strong>Tamaño:</strong> {queue.length}</div>
              <div><strong>Frente:</strong> {queue.length > 0 ? queue[0].value : 'N/A'}</div>
              <div><strong>Final:</strong> {queue.length > 0 ? queue[queue.length - 1].value : 'N/A'}</div>
              <div><strong>Vacía:</strong> {queue.length === 0 ? 'Sí' : 'No'}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Cola (Queue) - FIFO</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-32 bg-gray-50 rounded-lg">
            {renderQueue()}
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
              <strong>Enqueue:</strong> O(1) - Agregar al final
            </div>
            <div>
              <strong>Dequeue:</strong> O(1) - Remover del frente
            </div>
            <div>
              <strong>Principio:</strong> FIFO (First In, First Out)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QueueVisualizer;
