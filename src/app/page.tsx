'use client';

import { useState } from 'react';
import UserForm from '../components/UserForm';
import SnakeGame from '../components/SnakeGame';
import Leaderboard from '../components/Leaderboard';

type GameState = 'form' | 'playing' | 'gameOver' | 'leaderboard';

interface UserData {
  name: string;
  email: string;
  avatar: string;
}

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('form');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [finalScore, setFinalScore] = useState<number>(0);

  const handleFormSubmit = (data: UserData) => {
    setUserData(data);
    setGameState('playing');
  };

  const handleGameOver = (score: number) => {
    setFinalScore(score);
    setGameState('gameOver');
    
    // Guardar puntaje en la base de datos
    saveScore(userData!, score);
  };

  const saveScore = async (userData: UserData, score: number) => {
    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
          score: score,
        }),
      });

      if (!response.ok) {
        console.error('Error saving score');
      }
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  const handlePlayAgain = () => {
    setGameState('playing');
    setFinalScore(0);
  };

  const handleShowLeaderboard = () => {
    setGameState('leaderboard');
  };

  const handleBackToForm = () => {
    setGameState('form');
    setUserData(null);
    setFinalScore(0);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-blue-900/20 to-purple-900/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM0ZjQ2ZTUiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] animate-pulse"></div>
      </div>

      {/* Floating elements - Red de Galaxia Densa */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-green-500 rounded-full animate-bounce opacity-60"></div>
      <div className="absolute top-40 right-32 w-3 h-3 bg-blue-500 rounded-full animate-bounce opacity-40 delay-300"></div>
      <div className="absolute bottom-40 left-40 w-5 h-5 bg-purple-500 rounded-full animate-bounce opacity-50 delay-700"></div>
      <div className="absolute top-60 left-1/2 w-2 h-2 bg-pink-500 rounded-full animate-bounce opacity-70 delay-500"></div>
      
      {/* Más puntitos para efecto galaxia */}
      <div className="absolute top-32 right-16 w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-80 delay-100"></div>
      <div className="absolute top-80 left-16 w-2 h-2 bg-yellow-400 rounded-full animate-bounce opacity-60 delay-400"></div>
      <div className="absolute top-96 right-24 w-1 h-1 bg-orange-400 rounded-full animate-pulse opacity-70 delay-200"></div>
      <div className="absolute bottom-32 right-40 w-3 h-3 bg-indigo-400 rounded-full animate-bounce opacity-50 delay-600"></div>
      <div className="absolute bottom-80 left-1/3 w-1 h-1 bg-teal-400 rounded-full animate-pulse opacity-90 delay-300"></div>
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-400 rounded-full animate-bounce opacity-60 delay-800"></div>
      <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-emerald-400 rounded-full animate-pulse opacity-80 delay-150"></div>
      <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-violet-400 rounded-full animate-bounce opacity-70 delay-450"></div>
      <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-sky-400 rounded-full animate-pulse opacity-85 delay-250"></div>
      <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-rose-400 rounded-full animate-bounce opacity-55 delay-550"></div>
      
      {/* Red de galaxia adicional - Capa 1 */}
      <div className="absolute top-16 left-1/3 w-1 h-1 bg-lime-400 rounded-full animate-pulse opacity-75 delay-75"></div>
      <div className="absolute top-24 right-1/4 w-2 h-2 bg-amber-400 rounded-full animate-bounce opacity-65 delay-175"></div>
      <div className="absolute top-48 left-1/6 w-1 h-1 bg-fuchsia-400 rounded-full animate-pulse opacity-85 delay-125"></div>
      <div className="absolute top-72 right-1/6 w-3 h-3 bg-cyan-500 rounded-full animate-bounce opacity-45 delay-375"></div>
      <div className="absolute top-88 left-2/3 w-1 h-1 bg-emerald-500 rounded-full animate-pulse opacity-95 delay-225"></div>
      <div className="absolute top-1/6 right-2/3 w-2 h-2 bg-orange-500 rounded-full animate-bounce opacity-70 delay-475"></div>
      <div className="absolute top-2/3 left-1/8 w-1 h-1 bg-purple-500 rounded-full animate-pulse opacity-80 delay-325"></div>
      <div className="absolute top-5/6 right-1/8 w-3 h-3 bg-pink-500 rounded-full animate-bounce opacity-50 delay-575"></div>
      
      {/* Red de galaxia adicional - Capa 2 */}
      <div className="absolute top-28 left-2/5 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-90 delay-50"></div>
      <div className="absolute top-36 right-3/5 w-2 h-2 bg-green-400 rounded-full animate-bounce opacity-60 delay-250"></div>
      <div className="absolute top-56 left-4/5 w-1 h-1 bg-yellow-500 rounded-full animate-pulse opacity-70 delay-150"></div>
      <div className="absolute top-64 right-4/5 w-3 h-3 bg-red-500 rounded-full animate-bounce opacity-40 delay-350"></div>
      <div className="absolute top-84 left-1/5 w-1 h-1 bg-indigo-500 rounded-full animate-pulse opacity-85 delay-100"></div>
      <div className="absolute top-92 right-2/5 w-2 h-2 bg-teal-500 rounded-full animate-bounce opacity-55 delay-300"></div>
      <div className="absolute top-1/5 left-3/4 w-1 h-1 bg-violet-500 rounded-full animate-pulse opacity-75 delay-200"></div>
      <div className="absolute top-3/5 right-3/4 w-3 h-3 bg-rose-500 rounded-full animate-bounce opacity-35 delay-400"></div>
      
      {/* Red de galaxia adicional - Capa 3 */}
      <div className="absolute top-12 left-1/2 w-1 h-1 bg-sky-500 rounded-full animate-pulse opacity-80 delay-25"></div>
      <div className="absolute top-20 right-1/2 w-2 h-2 bg-lime-500 rounded-full animate-bounce opacity-65 delay-275"></div>
      <div className="absolute top-44 left-3/5 w-1 h-1 bg-amber-500 rounded-full animate-pulse opacity-95 delay-175"></div>
      <div className="absolute top-52 right-1/5 w-3 h-3 bg-fuchsia-500 rounded-full animate-bounce opacity-30 delay-375"></div>
      <div className="absolute top-76 left-4/5 w-1 h-1 bg-cyan-600 rounded-full animate-pulse opacity-70 delay-125"></div>
      <div className="absolute top-68 right-4/5 w-2 h-2 bg-emerald-600 rounded-full animate-bounce opacity-50 delay-325"></div>
      <div className="absolute top-1/4 left-1/8 w-1 h-1 bg-orange-600 rounded-full animate-pulse opacity-90 delay-75"></div>
      <div className="absolute top-3/4 right-1/8 w-3 h-3 bg-purple-600 rounded-full animate-bounce opacity-25 delay-275"></div>
      
      {/* Red de galaxia adicional - Capa 4 (puntos más pequeños y sutiles) */}
      <div className="absolute top-8 left-1/4 w-0.5 h-0.5 bg-blue-300 rounded-full animate-pulse opacity-60 delay-90"></div>
      <div className="absolute top-16 right-1/3 w-0.5 h-0.5 bg-green-300 rounded-full animate-pulse opacity-70 delay-190"></div>
      <div className="absolute top-32 left-2/3 w-0.5 h-0.5 bg-yellow-300 rounded-full animate-pulse opacity-50 delay-290"></div>
      <div className="absolute top-40 right-2/3 w-0.5 h-0.5 bg-red-300 rounded-full animate-pulse opacity-80 delay-390"></div>
      <div className="absolute top-60 left-1/8 w-0.5 h-0.5 bg-purple-300 rounded-full animate-pulse opacity-65 delay-490"></div>
      <div className="absolute top-68 right-1/8 w-0.5 h-0.5 bg-pink-300 rounded-full animate-pulse opacity-55 delay-590"></div>
      <div className="absolute top-80 left-3/4 w-0.5 h-0.5 bg-cyan-300 rounded-full animate-pulse opacity-75 delay-690"></div>
      <div className="absolute top-88 right-3/4 w-0.5 h-0.5 bg-emerald-300 rounded-full animate-pulse opacity-45 delay-790"></div>
      <div className="absolute top-96 left-1/2 w-0.5 h-0.5 bg-orange-300 rounded-full animate-pulse opacity-85 delay-890"></div>
      <div className="absolute top-1/6 right-1/6 w-0.5 h-0.5 bg-violet-300 rounded-full animate-pulse opacity-60 delay-990"></div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6 backdrop-blur-sm bg-black/20">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
            <span className="text-2xl">🐍</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Snake Game
          </span>
        </div>
        
        <nav className="flex space-x-6">
          <button 
            onClick={() => setGameState('form')}
            className={`hover:text-green-400 transition-colors ${gameState === 'form' ? 'text-green-400' : ''}`}
          >
            🎮 Jugar
          </button>
          <button 
            onClick={() => setGameState('leaderboard')}
            className={`hover:text-green-400 transition-colors ${gameState === 'leaderboard' ? 'text-green-400' : ''}`}
          >
            🏆 Puntajes
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6">
        {gameState === 'form' && (
          <div className="text-center mb-12 max-w-4xl">
            <h1 className="text-6xl md:text-7xl font-bold mb-12 leading-tight">
              <span className="bg-gradient-to-r from-white via-green-200 to-blue-200 bg-clip-text text-transparent">
              Arcade
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Viborita
              </span>
            </h1>
            
            <UserForm onSubmit={handleFormSubmit} />
          </div>
        )}

        {gameState === 'playing' && userData && (
          <div className="w-full max-w-4xl mx-auto">
            <SnakeGame userData={userData} onGameOver={handleGameOver} />
          </div>
        )}

        {gameState === 'gameOver' && userData && (
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-700">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <span className="text-4xl">💀</span>
                </div>
                
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                  ¡Game Over!
                </h2>
                
                <div className="mb-8">
                  <p className="text-xl text-gray-300 mb-2">
                    Jugador: <span className="text-green-400 font-semibold">{userData.name}</span>
                  </p>
                  <p className="text-3xl font-bold text-green-500">
                    Puntuación: {finalScore}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={handlePlayAgain}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                  >
                    🎮 Jugar de nuevo
                  </button>
                  
                  <button
                    onClick={handleShowLeaderboard}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                  >
                    🏆 Ver puntajes
                  </button>
                  
                  <button
                    onClick={handleBackToForm}
                    className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                  >
                    🏠 Volver al inicio
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {gameState === 'leaderboard' && (
          <div className="w-full max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                🏆 Tabla de Puntajes
              </h2>
              <button
                onClick={handleBackToForm}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
              >
                🎮 Jugar
              </button>
            </div>
            <Leaderboard />
          </div>
        )}
      </main>

    </div>
  );
}
