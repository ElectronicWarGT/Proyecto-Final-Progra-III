
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipForward, RotateCcw, Shuffle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ArrayElement {
  value: number;
  state: 'normal' | 'pivot' | 'comparing' | 'swapping' | 'sorted';
  id: string;
}

const QuickSortVisualizer = () => {
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([500]);
  const [currentStep, setCurrentStep] = useState(0);
  const [sortingSteps, setSortingSteps] = useState<ArrayElement[][]>([]);
  const [inputArray, setInputArray] = useState('64,34,25,12,22,11,90');

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const createArrayFromInput = (input: string) => {
    try {
      const values = input.split(',').map(val => parseInt(val.trim())).filter(val => !isNaN(val));
      if (values.length === 0) {
        toast({
          title: "Error",
          description: "Ingresa números separados por comas",
          variant: "destructive"
        });
        return;
      }
      
      const newArray = values.map(value => ({
        value,
        state: 'normal' as const,
        id: generateId()
      }));
      
      setArray(newArray);
      setCurrentStep(0);
      setSortingSteps([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Formato inválido. Use números separados por comas",
        variant: "destructive"
      });
    }
  };

  const generateRandomArray = () => {
    const size = 8;
    const values = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    const newArray = values.map(value => ({
      value,
      state: 'normal' as const,
      id: generateId()
    }));
    
    setArray(newArray);
    setCurrentStep(0);
    setSortingSteps([]);
    setInputArray(values.join(','));
  };

  const quickSort = (arr: ArrayElement[]): ArrayElement[][] => {
    const steps: ArrayElement[][] = [];
    const workingArray = [...arr];
    
    const partition = (low: number, high: number): number => {
      const pivot = workingArray[high];
      pivot.state = 'pivot';
      steps.push([...workingArray]);
      
      let i = low - 1;
      
      for (let j = low; j < high; j++) {
        workingArray[j].state = 'comparing';
        steps.push([...workingArray]);
        
        if (workingArray[j].value < pivot.value) {
          i++;
          workingArray[i].state = 'swapping';
          workingArray[j].state = 'swapping';
          steps.push([...workingArray]);
          
          // Swap
          [workingArray[i], workingArray[j]] = [workingArray[j], workingArray[i]];
          steps.push([...workingArray]);
        }
        
        workingArray[j].state = 'normal';
      }
      
      workingArray[i + 1].state = 'swapping';
      pivot.state = 'swapping';
      steps.push([...workingArray]);
      
      // Final swap with pivot
      [workingArray[i + 1], workingArray[high]] = [workingArray[high], workingArray[i + 1]];
      workingArray[i + 1].state = 'sorted';
      steps.push([...workingArray]);
      
      return i + 1;
    };
    
    const quickSortRecursive = (low: number, high: number) => {
      if (low < high) {
        const pi = partition(low, high);
        
        quickSortRecursive(low, pi - 1);
        quickSortRecursive(pi + 1, high);
      }
    };
    
    quickSortRecursive(0, workingArray.length - 1);
    
    // Mark all as sorted at the end
    workingArray.forEach(elem => elem.state = 'sorted');
    steps.push([...workingArray]);
    
    return steps;
  };

  const startSorting = () => {
    if (array.length === 0) {
      toast({
        title: "Array vacío",
        description: "Primero ingresa algunos números",
        variant: "destructive"
      });
      return;
    }
    
    const steps = quickSort(array);
    setSortingSteps(steps);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const resetArray = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setSortingSteps([]);
    setArray(prev => prev.map(elem => ({ ...elem, state: 'normal' })));
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const nextStep = () => {
    if (currentStep < sortingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  useEffect(() => {
    createArrayFromInput(inputArray);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && sortingSteps.length > 0) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= sortingSteps.length - 1) {
            setIsPlaying(false);
            toast({
              title: "Ordenamiento completado",
              description: "Quick Sort ha terminado de ordenar el array",
            });
            return prev;
          }
          return prev + 1;
        });
      }, 1100 - speed[0]);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, sortingSteps, speed]);

  const displayArray = sortingSteps.length > 0 ? sortingSteps[currentStep] : array;

  const getElementColor = (state: string) => {
    switch (state) {
      case 'pivot': return 'bg-red-500 border-red-600';
      case 'comparing': return 'bg-yellow-500 border-yellow-600';
      case 'swapping': return 'bg-purple-500 border-purple-600';
      case 'sorted': return 'bg-green-500 border-green-600';
      default: return 'bg-blue-500 border-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Controles de Quick Sort</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Ej: 64,34,25,12,22,11,90"
              value={inputArray}
              onChange={(e) => setInputArray(e.target.value)}
              className="flex-1"
            />
            <Button onClick={() => createArrayFromInput(inputArray)}>
              Crear Array
            </Button>
            <Button onClick={generateRandomArray} variant="outline">
              <Shuffle className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button onClick={startSorting} disabled={isPlaying || array.length === 0}>
              Iniciar Quick Sort
            </Button>
            
            <Button 
              onClick={togglePlayPause} 
              disabled={sortingSteps.length === 0}
              variant="outline"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button 
              onClick={nextStep} 
              disabled={isPlaying || currentStep >= sortingSteps.length - 1}
              variant="outline"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            
            <Button onClick={resetArray} variant="outline">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Velocidad: {speed[0]}ms</label>
            <Slider
              value={speed}
              onValueChange={setSpeed}
              max={1000}
              min={100}
              step={50}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>
            Visualización Quick Sort 
            {sortingSteps.length > 0 && (
              <span className="text-sm font-normal ml-2">
                (Paso {currentStep + 1} de {sortingSteps.length})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-32 bg-gray-50 rounded-lg p-6">
            {displayArray.length > 0 ? (
              <div className="flex justify-center items-end space-x-2">
                {displayArray.map((element, index) => (
                  <div key={element.id} className="flex flex-col items-center">
                    <div className="text-xs mb-1">{index}</div>
                    <div
                      className={`
                        w-12 h-12 border-2 rounded flex items-center justify-center
                        text-white font-bold text-sm transition-all duration-300
                        ${getElementColor(element.state)}
                      `}
                      style={{
                        height: `${Math.max(24, element.value * 0.8)}px`,
                      }}
                    >
                      {element.value}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500">
                Ingresa un array para comenzar
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Leyenda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm">Normal</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm">Pivot</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm">Comparando</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span className="text-sm">Intercambiando</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm">Ordenado</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Algorithm Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Algoritmo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>Complejidad Promedio:</strong> O(n log n)
            </div>
            <div>
              <strong>Complejidad Peor Caso:</strong> O(n²)
            </div>
            <div>
              <strong>Espacio:</strong> O(log n)
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Quick Sort usa la estrategia "divide y vencerás", seleccionando un elemento como pivot
            y particionando el array alrededor de él.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickSortVisualizer;
