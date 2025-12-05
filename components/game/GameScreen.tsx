'use client';

import React, { useState, useEffect } from 'react';
import { OfficeRoom3D } from '@/components/three/OfficeRoom';
import { PuzzlePanel } from '@/components/game/PuzzlePanel';
import { gameEngine } from '@/lib/game/gameEngine';
import { useSound } from '@/lib/sounds/soundManager';
import { 
  Clock, Users, Trophy, Zap, Eye, EyeOff, HelpCircle, 
  ArrowRight, ArrowLeft, Home, Volume2, VolumeX 
} from 'lucide-react';

interface GameScreenProps {
  onComplete: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ onComplete }) => {
  const [currentRoom, setCurrentRoom] = useState('office');
  const [timeLeft, setTimeLeft] = useState(600); // 10 րոպե
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [currentPuzzle, setCurrentPuzzle] = useState<string>('');
  const [muted, setMuted] = useState(false);
  
  const sound = useSound();
  const currentTeam = gameEngine.getCurrentTeam();

  useEffect(() => {
    // Սկսել ժամանակի հաշվիչ
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Միացնել սենյակի համապատասխան ձայնը
    sound.startAmbient(currentRoom);
    return () => sound.stopAmbient();
  }, [currentRoom]);

  const handleObjectClick = (objectName: string) => {
    // Պատրաստել գլուխկոտրուկ ըստ օբյեկտի
    const puzzles: Record<string, any> = {
      'calendar': {
        title: '📅 Օրացույցի Գաղտնագիրը',
        description: 'Յուրաքանչյուր ամսվա անունում թաքնված է թվանշան: Գտեք օրացույցի գաղտնագիրը:',
        type: 'code',
        solution: '123456',
        hints: ['Սկսեք հունվարից', 'Օգտագործեք հայերեն ամիսների անունները']
      },
      'computer': {
        title: '💻 Համակարգչի Պարոլը',
        description: 'Համակարգչի էկրանին կա հաղորդագրություն: Վերծանեք կոդը մուտք գործելու համար:',
        type: 'pattern',
        solution: 'AMANOR',
        hints: ['Օգտագործեք առաջին տառերը', 'Շատ անգամ օգտագործված բառ է']
      },
      'safe': {
        title: '🔒 Գաղտնարանի Կոդը',
        description: 'Գաղտնարանը պաշտպանված է 4 թվանշանից բաղկացած կոդով: Գտեք ճիշտ համադրությունը:',
        type: 'logic',
        solution: '2024',
        hints: ['Կապված է տարվա հետ', 'Նոր տարին է']
      }
    };

    const puzzle = puzzles[objectName];
    if (puzzle) {
      setCurrentPuzzle(objectName);
      setShowPuzzle(true);
      sound.playClick();
    }
  };

  const handlePuzzleSolved = (points: number) => {
    gameEngine.completePuzzle(currentTeam.id, points);
    setShowPuzzle(false);
    sound.playPuzzleSolved();
    
    // Շարժվել հաջորդ սենյակ
    const hasNextRoom = gameEngine.moveToNextRoom();
    if (hasNextRoom) {
      setCurrentRoom(gameEngine.getCurrentTeam().currentRoom);
    } else {
      // Հաջորդ թիմի անցում
      gameEngine.switchToNextTeam();
      setCurrentRoom(gameEngine.getCurrentTeam().currentRoom);
    }
  };

  const handleSkipPuzzle = () => {
    setShowPuzzle(false);
    sound.playError();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const roomNames: Record<string, string> = {
    'office': 'Գրասենյակ',
    'kitchen': 'Խոհանոց',
    'orange-meeting': 'Orange Հանդիպումների Սենյակ',
    'blue-meeting': 'Blue Հանդիպումների Սենյակ',
    'consultant': 'Խորհրդատուի Սենյակ',
    'reception': 'Ընդունարան',
    'it-room': 'IT Սենյակ'
  };

  if (showPuzzle) {
    return <PuzzlePanel 
      puzzleName={currentPuzzle}
      onSolved={() => handlePuzzleSolved(100)}
      onSkip={handleSkipPuzzle}
    />;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Վերին վահանակ */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6 border-2 border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Թիմի տեղեկություն */}
          <div className="col-span-2">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl ${currentTeam.color}`}>
                {currentTeam.emoji}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{currentTeam.name}</h2>
                <div className="text-white/60">
                  Միավորներ: <span className="text-yellow-400 font-bold">{currentTeam.score}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ժամանակ */}
          <div className="text-center">
            <div className="text-white/60 text-sm mb-1 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              Մնացած Ժամանակ
            </div>
            <div className={`text-4xl font-black ${timeLeft < 60 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Սենյակ */}
          <div className="text-center">
            <div className="text-white/60 text-sm mb-1">Ընթացիկ Սենյակ</div>
            <div className="text-2xl font-bold text-white">{roomNames[currentRoom]}</div>
            <div className="text-white/40 text-sm">
              {currentTeam.completedRooms?.length || 0}/7 ավարտված
            </div>
          </div>

          {/* Կառավարման կոճակներ */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setMuted(!muted)}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20"
            >
              {muted ? (
                <VolumeX className="w-5 h-5 text-red-400" />
              ) : (
                <Volume2 className="w-5 h-5 text-green-400" />
              )}
            </button>
            <button
              onClick={() => onComplete()}
              className="p-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg border border-red-500/30"
            >
              <Home className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ձախ կողմ - 3D սենյակ */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl p-4 border-2 border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                🏢 {roomNames[currentRoom]}
              </h3>
              <div className="text-white/60 text-sm">
                Ուսումնասիրեք սենյակը և գտեք գաղտնիքները
              </div>
            </div>
            
            <OfficeRoom3D 
              roomType={currentRoom} 
              onObjectClick={handleObjectClick}
            />
            
            <div className="mt-4 text-center text-white/60 text-sm">
              💡 Կտտացրեք օբյեկտների վրա՝ գլուխկոտրուկներ բացելու համար
            </div>
          </div>
        </div>

        {/* Աջ կողմ - Ինֆորմացիա */}
        <div className="space-y-6">
          {/* Թիմի անդամներ */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="text-blue-400" />
              Թիմի Անդամներ
            </h3>
            <div className="space-y-3">
              {currentTeam.players.map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between bg-white/5 p-3 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{player.avatar}</div>
                    <div>
                      <div className="text-white font-medium">{player.name}</div>
                      <div className="text-white/60 text-xs">{player.department}</div>
                    </div>
                  </div>
                  {currentTeam.captain?.id === player.id && (
                    <div className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs">
                      👑 Կապիտան
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Առաջադրանք */}
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-6 border-2 border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="text-yellow-400" />
              Ընթացիկ Առաջադրանք
            </h3>
            <div className="text-white/80 mb-4">
              {currentRoom === 'office' && 'Գտեք օրացույցի գաղտնագիրը և բացեք համակարգիչը'}
              {currentRoom === 'kitchen' && 'Պատրաստեք կախարդական էլիքսիրը ճիշտ բաղադրությամբ'}
              {currentRoom === 'orange-meeting' && 'Դուրս եկեք հայելային լաբիրինթոսից'}
              {currentRoom === 'blue-meeting' && 'Կարգավորեք ժամանակի պորտալը'}
              {currentRoom === 'consultant' && 'Գտեք կախարդանքը հին ձեռագրերում'}
              {currentRoom === 'reception' && 'Անջատեք անվտանգության համակարգը'}
              {currentRoom === 'it-room' && 'Համոզեք Գրինչին վերադարձնել նվերները'}
            </div>
            <div className="text-white/60 text-sm">
              ⏱️ Մոտավոր ժամանակ: 5-7 րոպե
            </div>
          </div>

          {/* Հուշումներ */}
          <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl p-6 border-2 border-green-500/30">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <HelpCircle className="text-green-400" />
              Հուշումներ
            </h3>
            <div className="text-white/80 mb-4">
              Մնացել է <span className="text-yellow-400 font-bold">3</span> հուշում
            </div>
            <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-lg transition-all transform hover:scale-105">
              🔍 Ստանալ Հուշում
            </button>
          </div>
        </div>
      </div>

      {/* Ստատուս բար */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-black/50 backdrop-blur-lg rounded-full px-6 py-3 border border-white/20">
          <div className="flex items-center gap-6">
            <div className="text-white/80">Թիմեր՝ {gameEngine.getAllTeams().length}</div>
            <div className="text-white/80">Ընդհանուր միավոր՝ {gameEngine.getAllTeams().reduce((sum, team) => sum + team.score, 0)}</div>
            <div className="text-white/80">Ավարտված սենյակներ՝ {currentTeam.completedRooms?.length || 0}/7</div>
            <button className="text-red-400 hover:text-red-300">
              🆘 Օգնություն
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};