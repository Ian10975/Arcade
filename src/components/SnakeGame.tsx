'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

interface SnakeGameProps {
  userData: { name: string; email: string; avatar: string };
  onGameOver: (score: number) => void;
}

interface Position {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 9, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: 0 };
const GAME_SPEED = 120;

export default function SnakeGame({ userData, onGameOver }: SnakeGameProps) {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Generar comida en posición aleatoria (sin colisionar con la serpiente)
  const generateFood = useCallback(() => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    setFood(newFood);
  }, [snake]);

  // Función para verificar si una posición causará colisión
  const willCollide = useCallback((x: number, y: number) => {
    // Verificar paredes
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) {
      return true;
    }
    // Verificar colisión con el cuerpo de la serpiente
    return snake.some(segment => segment.x === x && segment.y === y);
  }, [snake]);

  // Lógica del Bot IA
  const aiMove = useCallback(() => {
    if (!aiMode || gameOver || isPaused) return;

    const head = snake[0];
    const target = food;
    
    // Algoritmo de pathfinding: encontrar ruta a la comida
    const path = findPathToFood(head, target);
    
    if (path && path.length > 1) {
      // Tomar el siguiente paso en la ruta
      const nextStep = path[1];
      const direction = {
        x: nextStep.x - head.x,
        y: nextStep.y - head.y
      };
      
      // Verificar que el movimiento sea válido
      if (!willCollide(head.x + direction.x, head.y + direction.y)) {
        setDirection(direction);
        return;
      }
    }
    
    // Si no hay ruta, usar estrategia de escape
    const escapeMove = findEscapeMove(head);
    if (escapeMove) {
      setDirection(escapeMove);
    }
  }, [aiMode, gameOver, isPaused, snake, food, willCollide]);

  // Algoritmo de búsqueda de ruta (BFS)
  const findPathToFood = useCallback((start: Position, target: Position) => {
    const queue: Array<{ pos: Position; path: Position[] }> = [{ pos: start, path: [start] }];
    const visited = new Set<string>();
    
    while (queue.length > 0) {
      const { pos, path } = queue.shift()!;
      const key = `${pos.x},${pos.y}`;
      
      if (visited.has(key)) continue;
      visited.add(key);
      
      // Si llegamos a la comida, retornar la ruta
      if (pos.x === target.x && pos.y === target.y) {
        return path;
      }
      
      // Explorar movimientos posibles
      const directions = [
        { x: pos.x + 1, y: pos.y },
        { x: pos.x - 1, y: pos.y },
        { x: pos.x, y: pos.y + 1 },
        { x: pos.x, y: pos.y - 1 }
      ];
      
      for (const dir of directions) {
        if (!willCollide(dir.x, dir.y)) {
          queue.push({ pos: dir, path: [...path, dir] });
        }
      }
    }
    
    return null; // No hay ruta disponible
  }, [willCollide]);

  // Estrategia de escape cuando no hay ruta a la comida
  const findEscapeMove = useCallback((head: Position) => {
    const directions = [
      { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }
    ];
    
    // Encontrar el movimiento que nos da más espacio
    let bestMove = null;
    let bestScore = -Infinity;
    
    for (const dir of directions) {
      const newX = head.x + dir.x;
      const newY = head.y + dir.y;
      
      if (willCollide(newX, newY)) continue;
      
      // Calcular cuánto espacio nos da este movimiento
      const space = calculateAvailableSpace(newX, newY);
      if (space > bestScore) {
        bestScore = space;
        bestMove = dir;
      }
    }
    
    return bestMove;
  }, [willCollide]);

  // Calcular espacio disponible desde una posición
  const calculateAvailableSpace = useCallback((x: number, y: number) => {
    const visited = new Set<string>();
    const queue: Position[] = [{ x, y }];
    let space = 0;
    
    while (queue.length > 0) {
      const pos = queue.shift()!;
      const key = `${pos.x},${pos.y}`;
      
      if (visited.has(key)) continue;
      visited.add(key);
      space++;
      
      // Explorar en las 4 direcciones
      const directions = [
        { x: pos.x + 1, y: pos.y },
        { x: pos.x - 1, y: pos.y },
        { x: pos.x, y: pos.y + 1 },
        { x: pos.x, y: pos.y - 1 }
      ];
      
      for (const dir of directions) {
        if (!willCollide(dir.x, dir.y)) {
          queue.push(dir);
        }
      }
    }
    
    return space;
  }, [willCollide]);

  // Verificar colisión con paredes o cuerpo
  const checkCollision = useCallback((head: Position) => {
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
  }, [snake]);

  // Mover la serpiente
  const moveSnake = useCallback(() => {
    if (gameOver || isPaused || (!direction.x && !direction.y)) return;

    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      // Mover la cabeza
      head.x += direction.x;
      head.y += direction.y;

      // Colisión
      if (checkCollision(head)) {
        setGameOver(true);
        return prevSnake;
      }

      // Comer comida
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 1);
        generateFood(); // SOLO aquí cuando come
      } else {
        newSnake.pop();
      }

      newSnake.unshift(head);
      return newSnake;
    });
  }, [direction, food, checkCollision, gameOver, isPaused, score, generateFood]);

  // Efecto para manejar game over
  useEffect(() => {
    if (gameOver) {
      onGameOver(score);
    }
  }, [gameOver, score, onGameOver]);

  // Manejo de teclas
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;

    e.preventDefault();
    
    switch (e.key) {
      case 'ArrowUp':
        if (direction.y === 0) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
        if (direction.y === 0) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
        if (direction.x === 0) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
        if (direction.x === 0) setDirection({ x: 1, y: 0 });
        break;
      case ' ':
        setIsPaused(prev => !prev);
        break;
    }
  }, [direction, gameOver]);

  // Inicializar controles
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => handleKeyPress(e);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyPress]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;
    gameLoopRef.current = setInterval(() => {
      moveSnake();
      if (aiMode) {
        aiMove();
      }
    }, GAME_SPEED);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, aiMode, aiMove, gameOver]);

  // Reiniciar juego
  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setAiMode(false);
    generateFood(); // SOLO aquí al reiniciar
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Game Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 mb-4">
          <span className="text-lg">🎮</span>
          <span className="text-sm text-green-300">Juego en Progreso</span>
        </div>
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          🐍 Snake Game
        </h2>
        <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-700">
          <p className="text-gray-300 mb-2">
            Jugador: <span className="text-green-400 font-semibold">{userData.name}</span>
          </p>
          <p className="text-gray-400 text-sm mb-3">
            Avatar: <span className="text-blue-400">{userData.avatar}</span>
          </p>
          <p className="text-2xl font-bold text-green-500">
            Puntuación: {score}
          </p>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative">
        <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-700 shadow-2xl">
          <div
            className="relative border-2 border-gray-600 bg-gray-800 rounded-2xl overflow-hidden"
            style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
          >
            {/* Grid */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: GRID_SIZE }, (_, i) => (
                <div key={i} className="absolute w-full h-px bg-gray-600" style={{ top: i * CELL_SIZE }}></div>
              ))}
              {Array.from({ length: GRID_SIZE }, (_, i) => (
                <div key={i} className="absolute h-full w-px bg-gray-600" style={{ left: i * CELL_SIZE }}></div>
              ))}
            </div>

            {/* Snake */}
            {snake.map((segment, index) => (
              <div
                key={index}
                className={`absolute rounded-sm transition-all duration-100 ${
                  index === 0 
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-500/50' 
                    : 'bg-gradient-to-br from-green-500 to-green-600'
                }`}
                style={{
                  left: segment.x * CELL_SIZE,
                  top: segment.y * CELL_SIZE,
                  width: CELL_SIZE - 1,
                  height: CELL_SIZE - 1,
                }}
              />
            ))}

            {/* Food */}
            <div
              className="absolute bg-gradient-to-br from-red-400 to-pink-500 rounded-full shadow-lg shadow-red-500/50 animate-pulse"
              style={{
                left: food.x * CELL_SIZE,
                top: food.y * CELL_SIZE,
                width: CELL_SIZE - 1,
                height: CELL_SIZE - 1,
              }}
            />
          </div>
        </div>
      </div>

      {/* Controls & Status */}
      <div className="text-center space-y-4">
        <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-700">
          <p className="text-sm text-gray-300 mb-2">
            🎯 Usa las flechas para mover | ⏸️ Espacio para pausar
          </p>
          
          {/* Botón de Modo IA */}
          <div className="mb-3">
            <button
              onClick={() => setAiMode(!aiMode)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                aiMode 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25' 
                  : 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300 hover:from-gray-500 hover:to-gray-600'
              }`}
            >
              {aiMode ? '🤖 IA Activada' : '🤖 Activar IA'}
            </button>
            {aiMode && (
              <p className="text-xs text-purple-400 mt-1">
                La IA está jugando automáticamente
              </p>
            )}
          </div>

          {!direction.x && !direction.y && (
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-3 py-1">
              <span className="text-blue-400 text-sm font-semibold">🎮 Presiona una flecha para empezar</span>
            </div>
          )}
          {isPaused && (
            <div className="inline-flex items-center space-x-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-3 py-1">
              <span className="text-yellow-400 text-sm font-semibold">⏸️ JUEGO PAUSADO</span>
            </div>
          )}
        </div>
        
        {gameOver && (
          <div className="bg-gradient-to-r from-red-900/80 to-pink-900/80 backdrop-blur-sm rounded-2xl p-6 border border-red-700 shadow-2xl">
            <h3 className="text-2xl font-bold text-red-400 mb-4">💀 ¡GAME OVER!</h3>
            <p className="text-gray-300 mb-4">
              Puntuación final: <span className="text-2xl font-bold text-green-400">{score}</span>
            </p>
            <button
              onClick={restartGame}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg shadow-green-500/25"
            >
              🔄 Jugar de nuevo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
