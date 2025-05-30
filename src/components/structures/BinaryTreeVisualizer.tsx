
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
  id: string;
}

const BinaryTreeVisualizer = () => {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [currentHighlight, setCurrentHighlight] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const insertNode = (value: number) => {
    const newNode: TreeNode = {
      value,
      id: generateId()
    };

    if (!root) {
      setRoot(newNode);
      toast({
        title: "Nodo agregado",
        description: `Se agregó el valor ${value} como raíz`,
      });
      return;
    }

    const insert = (current: TreeNode): TreeNode => {
      if (value < current.value) {
        if (current.left) {
          current.left = insert(current.left);
        } else {
          current.left = newNode;
        }
      } else if (value > current.value) {
        if (current.right) {
          current.right = insert(current.right);
        } else {
          current.right = newNode;
        }
      }
      return current;
    };

    setRoot(insert(root));
    toast({
      title: "Nodo agregado",
      description: `Se agregó el valor ${value} al árbol`,
    });
  };

  const searchNode = async (value: number) => {
    if (!root) {
      toast({
        title: "Árbol vacío",
        description: "No hay elementos para buscar",
        variant: "destructive"
      });
      return;
    }

    setIsAnimating(true);
    
    const search = async (current: TreeNode | undefined): Promise<boolean> => {
      if (!current) return false;
      
      setCurrentHighlight(current.id);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (current.value === value) {
        toast({
          title: "¡Encontrado!",
          description: `El valor ${value} está en el árbol`,
        });
        return true;
      }
      
      if (value < current.value) {
        return await search(current.left);
      } else {
        return await search(current.right);
      }
    };

    const found = await search(root);
    
    if (!found) {
      toast({
        title: "No encontrado",
        description: `El valor ${value} no existe en el árbol`,
        variant: "destructive"
      });
    }
    
    setIsAnimating(false);
    setTimeout(() => setCurrentHighlight(null), 1000);
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
    insertNode(value);
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

  const renderTree = (node: TreeNode | undefined, level: number = 0): JSX.Element | null => {
    if (!node) return null;

    const isHighlighted = currentHighlight === node.id;
    
    return (
      <div className="flex flex-col items-center" key={node.id}>
        <div 
          className={
            isHighlighted 
              ? "w-12 h-12 rounded-full border-2 flex items-center justify-center text-white font-bold text-sm transition-all duration-500 transform bg-yellow-500 border-yellow-600 scale-125 shadow-lg"
              : "w-12 h-12 rounded-full border-2 flex items-center justify-center text-white font-bold text-sm transition-all duration-500 transform bg-purple-500 border-purple-600 hover:scale-110"
          }
        >
          {node.value}
        </div>
        
        {(node.left || node.right) && (
          <div className="mt-4 flex space-x-8">
            <div className="flex flex-col items-center">
              {node.left && (
                <>
                  <div className="w-px h-6 bg-gray-400"></div>
                  {renderTree(node.left, level + 1)}
                </>
              )}
            </div>
            <div className="flex flex-col items-center">
              {node.right && (
                <>
                  <div className="w-px h-6 bg-gray-400"></div>
                  {renderTree(node.right, level + 1)}
                </>
              )}
            </div>
          </div>
        )}
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
              Insertar Nodo
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          <CardTitle>Árbol Binario de Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-64 bg-gray-50 rounded-lg p-8 overflow-auto">
            {root ? (
              <div className="flex justify-center">
                {renderTree(root)}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500">
                Árbol vacío - Agrega algunos elementos
              </div>
            )}
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
              <strong>Inserción:</strong> O(log n) promedio
            </div>
            <div>
              <strong>Búsqueda:</strong> O(log n) promedio
            </div>
            <div>
              <strong>Regla:</strong> Izquierda &lt; Raíz &lt; Derecha
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BinaryTreeVisualizer;
