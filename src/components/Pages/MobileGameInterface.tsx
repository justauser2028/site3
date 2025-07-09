import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Save, Calendar, Trophy, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useGameAudio } from '../../hooks/useGameAudio';

interface MobileGameInterfaceProps {
  onBack: () => void;
}

interface GameState {
  day: number;
  isPlaying: boolean;
  currentRoom: 'bedroom' | 'living' | 'kitchen' | 'gym' | 'bathroom';
  completedActions: string[];
  character: {
    mood: 'happy' | 'tired' | 'energetic' | 'relaxed' | 'hungry';
    energy: number;
    hygiene: number;
    hunger: number;
  };
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

const MobileGameInterface: React.FC<MobileGameInterfaceProps> = ({ onBack }) => {
  const { isDark } = useTheme();
  const { audioSettings, toggleMute, playButtonSound, playNavigationSound } = useGameAudio();
  
  const [gameState, setGameState] = useState<GameState>({
    day: 1,
    isPlaying: false,
    currentRoom: 'bedroom',
    completedActions: [],
    character: {
      mood: 'happy',
      energy: 80,
      hygiene: 70,
      hunger: 60
    },
    timeOfDay: 'morning'
  });

  const [showWelcome, setShowWelcome] = useState(true);

  const roomObjects = {
    bedroom: [
      { id: 'bed', name: 'Cama', action: 'sleep', emoji: '🛏️' },
      { id: 'computer', name: 'Computador', action: 'relax', emoji: '💻' },
      { id: 'wardrobe', name: 'Guarda-roupa', action: 'dress', emoji: '👔' }
    ],
    living: [
      { id: 'sofa', name: 'Sofá', action: 'relax', emoji: '🛋️' },
      { id: 'tv', name: 'TV', action: 'watch', emoji: '📺' },
      { id: 'bookshelf', name: 'Estante', action: 'read', emoji: '📚' }
    ],
    kitchen: [
      { id: 'table', name: 'Mesa', action: 'eat', emoji: '🍽️' },
      { id: 'fridge', name: 'Geladeira', action: 'snack', emoji: '🧊' },
      { id: 'stove', name: 'Fogão', action: 'cook', emoji: '🔥' }
    ],
    gym: [
      { id: 'exercise', name: 'Exercício', action: 'workout', emoji: '🏋️' },
      { id: 'treadmill', name: 'Esteira', action: 'cardio', emoji: '🏃' },
      { id: 'yoga-mat', name: 'Yoga', action: 'stretch', emoji: '🧘' }
    ],
    bathroom: [
      { id: 'shower', name: 'Chuveiro', action: 'shower', emoji: '🚿' },
      { id: 'sink', name: 'Pia', action: 'brush', emoji: '🪥' },
      { id: 'skincare', name: 'Skincare', action: 'skincare', emoji: '🧴' }
    ]
  };

  const handleWelcomeStart = () => {
    setShowWelcome(false);
    setGameState(prev => ({ ...prev, isPlaying: true }));
    playButtonSound();
  };

  const handleRoomChange = (room: typeof gameState.currentRoom) => {
    setGameState(prev => ({ ...prev, currentRoom: room }));
    playNavigationSound();
  };

  const handleObjectClick = (objectId: string, action: string) => {
    if (gameState.completedActions.includes(objectId)) return;
    
    setGameState(prev => ({
      ...prev,
      completedActions: [...prev.completedActions, objectId],
      character: {
        ...prev.character,
        energy: Math.min(100, prev.character.energy + 10),
        hygiene: action === 'shower' ? 100 : prev.character.hygiene,
        hunger: action === 'eat' ? 100 : Math.max(0, prev.character.hunger - 5)
      }
    }));
    playButtonSound();
  };

  const handlePlayPause = () => {
    setGameState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
    playButtonSound();
  };

  const handleReset = () => {
    setGameState({
      day: 1,
      isPlaying: false,
      currentRoom: 'bedroom',
      completedActions: [],
      character: {
        mood: 'happy',
        energy: 80,
        hygiene: 70,
        hunger: 60
      },
      timeOfDay: 'morning'
    });
    playButtonSound();
  };

  const getRoomBackground = () => {
    const baseClasses = "pixel-room-bg room-transition";
    return `${baseClasses} room-bg-${gameState.currentRoom}`;
  };

  const getCharacterMoodEmoji = () => {
    const moodEmojis = {
      happy: '😊',
      tired: '😴',
      energetic: '💪',
      relaxed: '😌',
      hungry: '😋'
    };
    return moodEmojis[gameState.character.mood];
  };

  // Tela de Boas-vindas
  if (showWelcome) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-white via-emerald-50/80 to-emerald-100/60'
      }`}>
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full rounded-2xl p-8 text-center transition-colors duration-300 ${
            isDark 
              ? 'bg-slate-900/95 border border-slate-700' 
              : 'bg-white/95 border border-emerald-200/50 shadow-xl'
          }`}>
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🌙</span>
            </div>
            
            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Dream Story Game
            </h2>
            
            <p className={`text-sm mb-8 leading-relaxed transition-colors duration-300 ${
              isDark ? 'text-slate-300' : 'text-gray-700'
            }`}>
              Bem-vindo ao Dream Story! Ajude Alex a ter uma rotina de sono saudável. 
              Explore diferentes ambientes, complete atividades e construa hábitos positivos 
              para uma boa noite de sono.
            </p>
            
            <button
              onClick={handleWelcomeStart}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-4 rounded-xl font-bold text-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Começar Jornada
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-white via-emerald-50/80 to-emerald-100/60'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b-2 transition-colors duration-300 ${
        isDark 
          ? 'bg-slate-900/95 border-slate-800' 
          : 'bg-white/95 border-emerald-200/50'
      }`}>
        {/* Primeira linha do header */}
        <div className="px-4 py-2 border-b border-opacity-30">
          <div className="flex items-center justify-between">
            {/* Lado esquerdo: Foto de perfil, nome e stats de humor */}
            <div className="flex items-center gap-3">
              {/* Foto de perfil do Alex */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center border-2 border-white/20">
                <span className="text-sm">👨‍💼</span>
              </div>
              
              {/* Nome Alex */}
              <span className={`font-bold text-sm transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-emerald-900'
              }`}>
                Alex
              </span>
              
              {/* Stats de humor */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors duration-300 ${
                isDark ? 'bg-slate-800' : 'bg-emerald-100'
              }`}>
                <span>{getCharacterMoodEmoji()}</span>
                <span className={`font-medium transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-emerald-900'
                }`}>
                  {gameState.character.mood}
                </span>
              </div>
            </div>
            
            {/* Lado direito: Controles do jogo */}
            <div className="flex items-center gap-1">
              {/* Play/Pause */}
              <button
                onClick={handlePlayPause}
                className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                  isDark 
                    ? 'hover:bg-slate-800 text-white' 
                    : 'hover:bg-emerald-100 text-emerald-900'
                }`}
              >
                {gameState.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              
              {/* Mutar áudio */}
              <button
                onClick={toggleMute}
                className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                  isDark 
                    ? 'hover:bg-slate-800 text-white' 
                    : 'hover:bg-emerald-100 text-emerald-900'
                }`}
              >
                {audioSettings.isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              
              {/* Salvar */}
              <button
                onClick={() => playButtonSound()}
                className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                  isDark 
                    ? 'hover:bg-slate-800 text-white' 
                    : 'hover:bg-emerald-100 text-emerald-900'
                }`}
              >
                <Save className="w-4 h-4" />
              </button>
              
              {/* Reiniciar */}
              <button
                onClick={handleReset}
                className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                  isDark 
                    ? 'hover:bg-slate-800 text-white' 
                    : 'hover:bg-emerald-100 text-emerald-900'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Segunda linha do header */}
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Lado esquerdo: Dia da semana e pontuação */}
            <div className="flex items-center gap-4">
              {/* Dia da semana */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors duration-300 ${
                isDark ? 'bg-slate-800' : 'bg-emerald-100'
              }`}>
                <Calendar className="w-3 h-3 text-emerald-400" />
                <span className={`text-xs font-medium transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-emerald-900'
                }`}>
                  Domingo
                </span>
              </div>
              
              {/* Pontuação geral total */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors duration-300 ${
                isDark ? 'bg-slate-800' : 'bg-emerald-100'
              }`}>
                <Trophy className="w-3 h-3 text-yellow-400" />
                <span className={`text-xs font-medium transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-emerald-900'
                }`}>
                  {gameState.completedActions.length * 10} pts
                </span>
              </div>
            </div>
            
            {/* Lado direito: Velocidade do tempo */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => playButtonSound()}
                className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                  isDark 
                    ? 'bg-slate-800 text-white hover:bg-slate-700' 
                    : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                }`}
              >
                1x
              </button>
              <button
                onClick={() => playButtonSound()}
                className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                  isDark 
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                    : 'bg-white text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                2x
              </button>
              <button
                onClick={() => playButtonSound()}
                className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                  isDark 
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                    : 'bg-white text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                4x
              </button>
            </div>
          </div>
        </div>
        
        {/* Terceira linha: 5 fatores */}
        <div className="px-4 py-2 border-t border-opacity-30">
          <div className="grid grid-cols-5 gap-2 text-xs">
            {/* Energia */}
            <button
              className={`flex flex-col items-center p-1 rounded transition-colors duration-300 ${
                isDark 
                  ? 'hover:bg-slate-800' 
                  : 'hover:bg-emerald-100'
              }`}
            >
              <span className="text-lg mb-1">⚡</span>
              <span className={`font-medium transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-emerald-900'
              }`}>
                {gameState.character.energy}
              </span>
              <div className={`w-full h-1 rounded-full mt-1 transition-colors duration-300 ${
                isDark ? 'bg-slate-700' : 'bg-emerald-200'
              }`}>
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-300"
                  style={{ width: `${gameState.character.energy}%` }}
                />
              </div>
            </button>
            
            {/* Fome */}
            <button
              className={`flex flex-col items-center p-1 rounded transition-colors duration-300 ${
                isDark 
                  ? 'hover:bg-slate-800' 
                  : 'hover:bg-emerald-100'
              }`}>
              <span className="text-lg mb-1">🍽️</span>
              <span className={`font-medium transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-emerald-900'
              }`}>
                {gameState.character.hunger}
              </span>
              <div className={`w-full h-1 rounded-full mt-1 transition-colors duration-300 ${
                isDark ? 'bg-slate-700' : 'bg-emerald-200'
              }`}>
                <div 
                  className="h-full bg-orange-500 rounded-full transition-all duration-300"
                  style={{ width: `${gameState.character.hunger}%` }}
                />
              </div>
            </button>
            
            {/* Higiene */}
            <button
              className={`flex flex-col items-center p-1 rounded transition-colors duration-300 ${
                isDark 
                  ? 'hover:bg-slate-800' 
                  : 'hover:bg-emerald-100'
              }`}>
              <span className="text-lg mb-1">🚿</span>
              <span className={`font-medium transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-emerald-900'
              }`}>
                {gameState.character.hygiene}
              </span>
              <div className={`w-full h-1 rounded-full mt-1 transition-colors duration-300 ${
                isDark ? 'bg-slate-700' : 'bg-emerald-200'
              }`}>
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${gameState.character.hygiene}%` }}
                />
              </div>
            </button>
            
            {/* Social */}
            <button
              className={`flex flex-col items-center p-1 rounded transition-colors duration-300 ${
                isDark 
                  ? 'hover:bg-slate-800' 
                  : 'hover:bg-emerald-100'
              }`}>
              <span className="text-lg mb-1">👥</span>
              <span className={`font-medium transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-emerald-900'
              }`}>
                75
              </span>
              <div className={`w-full h-1 rounded-full mt-1 transition-colors duration-300 ${
                isDark ? 'bg-slate-700' : 'bg-emerald-200'
              }`}>
                <div 
                  className="h-full bg-purple-500 rounded-full transition-all duration-300"
                  style={{ width: '75%' }}
                />
              </div>
            </button>
            
            {/* Produção */}
            <button
              className={`flex flex-col items-center p-1 rounded transition-colors duration-300 ${
                isDark 
                  ? 'hover:bg-slate-800' 
                  : 'hover:bg-emerald-100'
              }`}>
              <span className="text-lg mb-1">💼</span>
              <span className={`font-medium transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-emerald-900'
              }`}>
                85
              </span>
              <div className={`w-full h-1 rounded-full mt-1 transition-colors duration-300 ${
                isDark ? 'bg-slate-700' : 'bg-emerald-200'
              }`}>
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: '85%' }}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Botão de voltar fixo no canto superior esquerdo */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={onBack}
          className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
            isDark 
              ? 'bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700' 
              : 'bg-white/80 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Indicador de período do dia fixo no canto superior direito */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`flex items-center gap-1 px-3 py-2 rounded-full backdrop-blur-sm transition-colors duration-300 ${
          isDark ? 'bg-slate-900/80 border border-slate-700' : 'bg-white/80 border border-emerald-200'
        }`}>
          <span className={`text-sm font-medium transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-emerald-900'
          }`}>
            {gameState.timeOfDay === 'morning' && '🌅 Manhã'}
            {gameState.timeOfDay === 'afternoon' && '☀️ Tarde'}
            {gameState.timeOfDay === 'evening' && '🌆 Noite'}
            {gameState.timeOfDay === 'night' && '🌙 Madrugada'}
          </span>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative h-[50vh] overflow-hidden">
        <div className={getRoomBackground()}></div>
        
        {/* Character */}
        <div className="pixel-character">
          <div className="alex-sprite-2d alex-idle-2d">
            <div className="character-shadow-2d"></div>
          </div>
        </div>
        
        {/* Room Objects */}
        {roomObjects[gameState.currentRoom].map((obj) => (
          <button
            key={obj.id}
            onClick={() => handleObjectClick(obj.id, obj.action)}
            className={`pixel-object pixel-${obj.id} ${
              gameState.completedActions.includes(obj.id) ? 'used' : 'available'
            }`}
            disabled={gameState.completedActions.includes(obj.id)}
          >
            <span className="text-2xl">{obj.emoji}</span>
            {gameState.completedActions.includes(obj.id) && (
              <div className="pixel-completion">✓</div>
            )}
          </button>
        ))}
      </div>

      {/* Room Navigation */}
      <div className={`px-4 py-3 border-t transition-colors duration-300 ${
        isDark ? 'border-slate-800 bg-slate-900/50' : 'border-emerald-200 bg-emerald-50/50'
      }`}>
        <div className="flex justify-center gap-2 overflow-x-auto">
          {Object.keys(roomObjects).map((room) => (
            <button
              key={room}
              onClick={() => handleRoomChange(room as typeof gameState.currentRoom)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                gameState.currentRoom === room
                  ? 'bg-purple-500 text-white'
                  : isDark
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-white text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {room === 'bedroom' && '🛏️ Quarto'}
              {room === 'living' && '🛋️ Sala'}
              {room === 'kitchen' && '🍽️ Cozinha'}
              {room === 'gym' && '🏋️ Academia'}
              {room === 'bathroom' && '🚿 Banheiro'}
            </button>
          ))}
        </div>
      </div>

      {/* Game Controls */}
      <div className={`px-4 py-4 border-t transition-colors duration-300 ${
        isDark ? 'border-slate-800 bg-slate-900/50' : 'border-emerald-200 bg-emerald-50/50'
      }`}>
        <p className={`text-xs text-center transition-colors duration-300 ${
          isDark ? 'text-slate-400' : 'text-emerald-600'
        }`}>
          Explore os ambientes e complete as atividades para melhorar o sono do Alex!
        </p>
      </div>
    </div>
  );
};

export default MobileGameInterface;
              
              <div className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full transition-colors duration-300 ${
                isDark ? 'bg-slate-800' : 'bg-emerald-100'
              }`}>
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                <span className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-emerald-900'
                }`}>
                  {gameState.completedActions.length}/15
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={handlePlayPause}
                className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                  isDark 
                    ? 'hover:bg-slate-800 text-white' 
                    : 'hover:bg-emerald-100 text-emerald-900'
                }`}
              >
                {gameState.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              
              <button
                onClick={handleReset}
                className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                  isDark 
                    ? 'hover:bg-slate-800 text-white' 
                    : 'hover:bg-emerald-100 text-emerald-900'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              
              <button
                onClick={toggleMute}
                className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                  isDark 
                    ? 'hover:bg-slate-800 text-white' 
                    : 'hover:bg-emerald-100 text-emerald-900'
                }`}
              >
                {audioSettings.isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Game Area */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className={getRoomBackground()}></div>
        
        {/* Character */}
        <div className="pixel-character">
          <div className="alex-sprite-2d alex-idle-2d">
            <div className="character-shadow-2d"></div>
          </div>
        </div>
        
        {/* Room Objects */}
        {roomObjects[gameState.currentRoom].map((obj) => (
          <button
            key={obj.id}
            onClick={() => handleObjectClick(obj.id, obj.action)}
            className={`pixel-object pixel-${obj.id} ${
              gameState.completedActions.includes(obj.id) ? 'used' : 'available'
            }`}
            disabled={gameState.completedActions.includes(obj.id)}
          >
            <span className="text-2xl">{obj.emoji}</span>
            {gameState.completedActions.includes(obj.id) && (
              <div className="pixel-completion">✓</div>
            )}
          </button>
        ))}
      </div>

      {/* Room Navigation */}
      <div className={`px-4 py-3 border-t transition-colors duration-300 ${
        isDark ? 'border-slate-800 bg-slate-900/50' : 'border-emerald-200 bg-emerald-50/50'
      }`}>
        <div className="flex justify-center gap-2 overflow-x-auto">
          {Object.keys(roomObjects).map((room) => (
            <button
              key={room}
              onClick={() => handleRoomChange(room as typeof gameState.currentRoom)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                gameState.currentRoom === room
                  ? 'bg-purple-500 text-white'
                  : isDark
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-white text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {room === 'bedroom' && '🛏️ Quarto'}
              {room === 'living' && '🛋️ Sala'}
              {room === 'kitchen' && '🍽️ Cozinha'}
              {room === 'gym' && '🏋️ Academia'}
              {room === 'bathroom' && '🚿 Banheiro'}
            </button>
          ))}
        </div>
      </div>

      {/* Character Stats */}
      <div className={`px-4 py-3 border-t transition-colors duration-300 ${
        isDark ? 'border-slate-800 bg-slate-900/30' : 'border-emerald-200 bg-white/50'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">👨‍💼</span>
            <span className={`font-medium transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-emerald-900'
            }`}>Alex {getCharacterMoodEmoji()}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <div className={`flex justify-between mb-1 transition-colors duration-300 ${
              isDark ? 'text-slate-300' : 'text-emerald-700'
            }`}>
              <span>Energia</span>
              <span>{gameState.character.energy}%</span>
            </div>
            <div className={`h-2 rounded-full transition-colors duration-300 ${
              isDark ? 'bg-slate-700' : 'bg-emerald-200'
            }`}>
              <div 
                className="h-full bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${gameState.character.energy}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className={`flex justify-between mb-1 transition-colors duration-300 ${
              isDark ? 'text-slate-300' : 'text-emerald-700'
            }`}>
              <span>Higiene</span>
              <span>{gameState.character.hygiene}%</span>
            </div>
            <div className={`h-2 rounded-full transition-colors duration-300 ${
              isDark ? 'bg-slate-700' : 'bg-emerald-200'
            }`}>
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${gameState.character.hygiene}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className={`flex justify-between mb-1 transition-colors duration-300 ${
              isDark ? 'text-slate-300' : 'text-emerald-700'
            }`}>
              <span>Fome</span>
              <span>{gameState.character.hunger}%</span>
            </div>
            <div className={`h-2 rounded-full transition-colors duration-300 ${
              isDark ? 'bg-slate-700' : 'bg-emerald-200'
            }`}>
              <div 
                className="h-full bg-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${gameState.character.hunger}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Game Controls */}
      <div className={`px-4 py-4 border-t transition-colors duration-300 ${
        isDark ? 'border-slate-800 bg-slate-900/50' : 'border-emerald-200 bg-emerald-50/50'
      }`}>
        <p className={`text-xs text-center transition-colors duration-300 ${
          isDark ? 'text-slate-400' : 'text-emerald-600'
        }`}>
          Explore os ambientes e complete as atividades para melhorar o sono do Alex!
        </p>
        
        <div className="fixed top-16 right-4 z-50">
          <div className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full transition-colors duration-300 ${
            isDark ? 'bg-slate-800/90' : 'bg-white/90'
          }`}>
            <span className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-emerald-900'
            }`}>
              {gameState.timeOfDay === 'morning' && '🌅 Manhã'}
              {gameState.timeOfDay === 'afternoon' && '☀️ Tarde'}
              {gameState.timeOfDay === 'evening' && '🌆 Noite'}
              {gameState.timeOfDay === 'night' && '🌙 Madrugada'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileGameInterface;