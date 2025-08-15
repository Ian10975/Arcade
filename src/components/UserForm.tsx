'use client';

import { useState } from 'react';

interface UserFormProps {
  onSubmit: (userData: { name: string; email: string; avatar: string }) => void;
}

const avatars = [
  { id: 'snake1', name: 'Snake Verde', emoji: '🐍', color: 'from-green-500 to-emerald-500' },
  { id: 'snake2', name: 'Snake Azul', emoji: '🐉', color: 'from-blue-500 to-cyan-500' },
  { id: 'snake3', name: 'Snake Rojo', emoji: '🦎', color: 'from-red-500 to-pink-500' },
  { id: 'snake4', name: 'Snake Dorado', emoji: '✨', color: 'from-yellow-500 to-orange-500' },
];

export default function UserForm({ onSubmit }: UserFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('snake1');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    const newErrors: { name?: string; email?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El correo no es válido';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit({ name: name.trim(), email: email.trim(), avatar: selectedAvatar });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-700 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-3">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ${
                errors.name ? 'border-red-500 bg-red-500/10' : 'border-gray-600 bg-gray-800/50 hover:bg-gray-800/70'
              } text-white placeholder-gray-400`}
              placeholder="Tu nombre"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-2 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-3">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ${
                errors.email ? 'border-red-500 bg-red-500/10' : 'border-gray-600 bg-gray-800/50 hover:bg-gray-800/70'
              } text-white placeholder-gray-400`}
              placeholder="tu@email.com"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-2 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Selecciona tu Avatar
            </label>
            <div className="grid grid-cols-2 gap-3">
              {avatars.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar.id)}
                  className={`p-4 border-2 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                    selectedAvatar === avatar.id
                      ? 'border-green-400 bg-green-500/20 shadow-lg shadow-green-500/25'
                      : 'border-gray-600 bg-gray-800/30 hover:border-gray-500 hover:bg-gray-800/50'
                  }`}
                >
                  <div className={`text-3xl mb-2 p-2 rounded-lg bg-gradient-to-br ${avatar.color}`}>
                    {avatar.emoji}
                  </div>
                  <div className="text-xs text-gray-300 font-medium">{avatar.name}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg shadow-green-500/25"
          >
            🚀 ¡Empezar a Jugar!
          </button>
        </form>
      </div>
    </div>
  );
}
