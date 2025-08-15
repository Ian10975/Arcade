'use client';

import { useEffect, useState } from 'react';

interface Score {
  id: string;
  score: number;
  gameDate: string;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

export default function Leaderboard() {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/scores');
      
      if (!response.ok) {
        throw new Error('Error al cargar los puntajes');
      }
      
      const data = await response.json();
      setScores(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const deleteScore = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este puntaje?')) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await fetch('/api/scores', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el puntaje');
      }

      // Recargar puntajes después de eliminar
      await fetchScores();
    } catch (err) {
      alert('Error al eliminar el puntaje: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAvatarEmoji = (avatarId: string) => {
    const avatarMap: { [key: string]: string } = {
      'snake1': '🐍',
      'snake2': '🐉',
      'snake3': '🦎',
      'snake4': '✨'
    };
    return avatarMap[avatarId] || '🐍';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-2 mb-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
          <span className="text-blue-300">Cargando puntajes...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-gradient-to-r from-red-900/80 to-pink-900/80 backdrop-blur-sm rounded-2xl p-6 border border-red-700 max-w-md mx-auto">
          <p className="text-red-400 mb-4 text-lg">❌ {error}</p>
          <button
            onClick={fetchScores}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg shadow-green-500/25"
          >
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {scores.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-700 max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center">
              <span className="text-4xl">🏆</span>
            </div>
            <p className="text-gray-300 text-lg mb-4">
              No hay puntajes registrados aún
            </p>
            <p className="text-gray-400 text-sm">
              ¡Sé el primero en jugar y establecer un récord!
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Información del sistema de puntuaciones */}
          <div className="bg-gradient-to-r from-blue-900/80 to-purple-900/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-700 mb-6 max-w-4xl mx-auto">
            <div className="text-center">
              <h3 className="text-xl font-bold text-blue-300 mb-3">🏆 Sistema de Puntuaciones</h3>
              <p className="text-gray-300 mb-2">
                Solo se muestran los <span className="text-yellow-400 font-semibold">3 mejores puntajes</span> de cada jugador
              </p>
              <p className="text-gray-400 text-sm">
                Si superas tu puntuación anterior, se actualiza automáticamente. No se duplican registros.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm rounded-3xl border border-gray-700 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-800/50 to-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Posición
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Jugador
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Puntuación
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {scores.slice(0, 3).map((score, index) => (
                    <tr key={score.id} className="hover:bg-gray-800/30 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3">
                            {index === 0 ? (
                              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                <span className="text-xl">🥇</span>
                              </div>
                            ) : index === 1 ? (
                              <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                                <span className="text-xl">🥈</span>
                              </div>
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-yellow-700 rounded-full flex items-center justify-center">
                                <span className="text-xl">🥉</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                            <span className="text-2xl">{getAvatarEmoji(score.user.avatar)}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {score.user.name}
                            </div>
                            <div className="text-sm text-gray-400">
                              {score.user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30">
                          <span className="text-lg font-bold text-green-400">
                            {score.score}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatDate(score.gameDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => deleteScore(score.id)}
                          disabled={deletingId === score.id}
                          className={`px-3 py-1 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                            deletingId === score.id
                              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg shadow-red-500/25'
                          }`}
                        >
                          {deletingId === score.id ? '🗑️ Eliminando...' : '🗑️ Eliminar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
      <div className="text-center mt-8">
        <button
          onClick={fetchScores}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-500/25"
        >
          🔄 Actualizar Puntajes
        </button>
      </div>
    </div>
  );
}
