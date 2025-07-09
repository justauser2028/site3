import React from 'react';
import { ArrowLeft, Gamepad2, Play, Pause, RotateCcw } from 'lucide-react';

interface MobileGameInterfaceProps {
  onBack: () => void;
}

export default function MobileGameInterface({ onBack }: MobileGameInterfaceProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [level, setLevel] = React.useState(1);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setScore(0);
    setLevel(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-6 h-6" />
          <h1 className="text-xl font-bold">Dream Game</h1>
        </div>
        
        <div className="text-right">
          <div className="text-sm opacity-75">Level {level}</div>
          <div className="font-bold">{score.toLocaleString()}</div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 p-4">
        <div className="bg-black/30 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
          <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-white/20 flex items-center justify-center mb-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Gamepad2 className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Mobile Game Interface</h2>
              <p className="text-white/70 mb-4">Interactive gaming experience</p>
              
              {isPlaying ? (
                <div className="animate-pulse">
                  <div className="text-lg font-semibold text-green-400">Game Running...</div>
                  <div className="text-sm text-white/60 mt-1">Tap to interact</div>
                </div>
              ) : (
                <div className="text-lg font-semibold text-yellow-400">Game Paused</div>
              )}
            </div>
          </div>

          {/* Game Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handlePlayPause}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                isPlaying
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-600 hover:bg-gray-700 text-white font-semibold transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-black/20 rounded-xl p-4 text-center backdrop-blur-sm border border-white/10">
            <div className="text-2xl font-bold text-blue-400">{score}</div>
            <div className="text-sm text-white/70">Score</div>
          </div>
          
          <div className="bg-black/20 rounded-xl p-4 text-center backdrop-blur-sm border border-white/10">
            <div className="text-2xl font-bold text-purple-400">{level}</div>
            <div className="text-sm text-white/70">Level</div>
          </div>
          
          <div className="bg-black/20 rounded-xl p-4 text-center backdrop-blur-sm border border-white/10">
            <div className="text-2xl font-bold text-green-400">
              {isPlaying ? 'ON' : 'OFF'}
            </div>
            <div className="text-sm text-white/70">Status</div>
          </div>
        </div>
      </div>
    </div>
  );
}