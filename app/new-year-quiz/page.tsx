// app/page.tsx (основная страница)
'use client';

import { useState, useEffect } from 'react';
import { TeamCreator } from '@/components/team/TeamCreator';
import { GameScreen } from '@/components/game/GameScreen';
import { Volume2, VolumeX, Users, Gamepad2, Trophy } from 'lucide-react';
import { gameEngine } from '@/lib/game/gameEngine';
import { useSound } from '@/lib/sounds/soundManager';

export default function HomePage() {
  const [gameState, setGameState] = useState<'teamSetup' | 'ready' | 'playing' | 'results'>('teamSetup');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [teams, setTeams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const sound = useSound();

  useEffect(() => {
    // Инициализация звуковой системы
    sound.setMuted(!soundEnabled);
    setIsLoading(false);
  }, [soundEnabled]);

  useEffect(() => {
    // Автосохранение команд в localStorage
    if (teams.length > 0) {
      localStorage.setItem('savedTeams', JSON.stringify(teams));
    }
  }, [teams]);

  useEffect(() => {
    // Загрузка сохраненных команд
    const savedTeams = localStorage.getItem('savedTeams');
    if (savedTeams) {
      try {
        const parsedTeams = JSON.parse(savedTeams);
        if (Array.isArray(parsedTeams) && parsedTeams.length > 0) {
          setTeams(parsedTeams);
        }
      } catch (e) {
        console.error('Ошибка загрузки сохраненных команд:', e);
      }
    }
  }, []);

  const handleTeamsCreated = (createdTeams: any[]) => {
    if (createdTeams.length < 2) {
      alert('Անհրաժեշտ է առնվազն 2 թիմ խաղը սկսելու համար');
      return;
    }

    const allTeamsValid = createdTeams.every(team => team.players.length >= 2);
    if (!allTeamsValid) {
      alert('Յուրաքանչյուր թիմում պետք է լինի առնվազն 2 խաղացող');
      return;
    }

    setTeams(createdTeams);
    setGameState('ready');
    sound.playTeamCreated();
  };

  const handleReadyConfirm = () => {
    try {
      gameEngine.startGame(teams);
      setGameState('playing');
      sound.playLevelComplete();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleGameComplete = () => {
    setGameState('results');
    sound.playVictory();
  };

  const handleReset = () => {
    if (confirm('Վերագործարկել խաղը? Բոլոր տվյալները կկորչեն։')) {
      gameEngine.resetGame();
      setGameState('teamSetup');
      setTeams([]);
      localStorage.removeItem('savedTeams');
      sound.stopAmbient();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-4xl text-white animate-pulse">🎮 Բեռնվում է...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 overflow-hidden">
      {/* Фоновые эффекты */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl animate-float">❄️</div>
        <div className="absolute top-40 right-20 text-5xl animate-float delay-1000">🎄</div>
        <div className="absolute bottom-32 left-1/4 text-7xl animate-float delay-2000">⭐</div>
        <div className="absolute bottom-20 right-1/3 text-6xl animate-float delay-3000">🎁</div>
        <div className="absolute top-1/2 left-1/3 text-5xl animate-pulse-slow">✨</div>
      </div>

      {/* Верхняя панель */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-black/30 backdrop-blur-lg border-b border-white/10">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="text-3xl animate-bounce">🎭</div>
                  <div>
                    <h1 className="text-xl font-bold text-white">Ամանորյա Քվեստ</h1>
                    <p className="text-white/60 text-sm">Վիրտուալ արկած ձեր գրասենյակում</p>
                  </div>
                </div>
                
                <div className="hidden md:flex items-center gap-4">
                  <button 
                    onClick={() => setGameState('teamSetup')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      gameState === 'teamSetup' 
                        ? 'bg-blue-500/30 text-blue-300' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    Թիմեր
                  </button>
                  {gameState === 'ready' && (
                    <button 
                      onClick={handleReadyConfirm}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/30 text-green-300 hover:bg-green-500/40"
                    >
                      <Gamepad2 className="w-4 h-4" />
                      Խաղալ
                    </button>
                  )}
                  {gameState === 'playing' && (
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/30 text-green-300">
                      <Gamepad2 className="w-4 h-4 animate-pulse" />
                      Խաղում է...
                    </button>
                  )}
                  {gameState === 'results' && (
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/30 text-yellow-300">
                      <Trophy className="w-4 h-4" />
                      Արդյունքներ
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSoundEnabled(!soundEnabled);
                    sound.setMuted(soundEnabled);
                  }}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  title={soundEnabled ? 'Անջատել ձայնը' : 'Միացնել ձայնը'}
                >
                  {soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-green-400" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-red-400" />
                  )}
                </button>
                
                <button 
                  onClick={handleReset}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:scale-105 transition-transform"
                >
                  Վերագործարկել
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Основное содержимое */}
      <div className="pt-20">
        {gameState === 'teamSetup' && (
          <TeamCreator onTeamsCreated={handleTeamsCreated} />
        )}

        {gameState === 'ready' && (
          <div className="container mx-auto p-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border-2 border-white/20 text-center animate-fadeIn">
                <div className="text-8xl mb-6 animate-bounce">🎮</div>
                <h2 className="text-5xl font-bold text-white mb-4">Խաղը Պատրաստ է</h2>
                <p className="text-xl text-blue-200 mb-8">Թիմերը պատրաստ են արկածի</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {teams.map((team, index) => (
                    <div 
                      key={team.id} 
                      className={`p-6 rounded-2xl border-2 border-white/30 transform hover:scale-105 transition-all ${team.color}`}
                      style={{
                        backgroundImage: team.color.includes('gradient') 
                          ? `linear-gradient(to right, ${team.color.split('from-')[1].split(' ')[0]}, ${team.color.split('to-')[1].split(' ')[0]})`
                          : team.color
                      }}
                    >
                      <div className="text-4xl mb-2">{team.emoji}</div>
                      <h3 className="text-2xl font-bold text-white mb-2">{team.name}</h3>
                      <div className="text-white/80">
                        <div className="mb-1">Խաղացողներ: {team.players.length}</div>
                        <div>Կապիտան: {team.captain?.name || 'Չկա'}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setGameState('teamSetup')}
                    className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/20 transition-all transform hover:scale-105"
                  >
                    ↩️ Փոխել Թիմերը
                  </button>
                  <button
                    onClick={handleReadyConfirm}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xl font-bold rounded-2xl transition-all transform hover:scale-105 shadow-xl"
                  >
                    🚀 Սկսել Խաղը
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <GameScreen onComplete={handleGameComplete} />
        )}

        {gameState === 'results' && (
          <div className="container mx-auto p-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border-2 border-white/20 text-center animate-fadeIn">
                <div className="text-8xl mb-6 animate-bounce">🏆</div>
                <h2 className="text-5xl font-bold text-white mb-4">Խաղն Ավարտված է</h2>
                <p className="text-xl text-blue-200 mb-8">Շնորհավորում ենք բոլոր մասնակիցներին</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {teams.map((team, index) => (
                    <div 
                      key={team.id} 
                      className={`p-6 rounded-2xl border-2 transform hover:scale-105 transition-all ${
                        index === 0 
                          ? 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border-yellow-400' 
                          : 'bg-white/10 border-white/30'
                      }`}
                    >
                      <div className="text-4xl mb-2">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{team.name}</h3>
                      <div className="text-4xl font-black text-white mb-4">{team.score} միավոր</div>
                      <div className="text-white/80">
                        <div className="mb-1">Ավարտված սենյակներ: {team.completedRooms?.length || 0}/7</div>
                        <div>Խաղացողներ: {team.players.length}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <button
                    onClick={handleReset}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white text-xl font-bold rounded-2xl transition-all transform hover:scale-105"
                  >
                    🔄 Նոր Խաղ
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl font-bold rounded-2xl transition-all transform hover:scale-105"
                  >
                    🏠 Գլխավոր Էջ
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}