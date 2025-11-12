
"use client"

import React, { useState } from 'react';
import { Sparkles, Snowflake, Gift, Heart, Wine, Users, ChevronDown, ChevronUp, Eye, EyeOff, X, UserPlus, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { games, type Game, type Participant } from './games-data';


export default function NewYearGames() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [printMode, setPrintMode] = useState(false);
  const [expandedGame, setExpandedGame] = useState<number | null>(null);
  const [printAllGames, setPrintAllGames] = useState(false);
  
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [currentGameForRoles, setCurrentGameForRoles] = useState<Game | null>(null);
  const [participantInputs, setParticipantInputs] = useState<string[]>(['', '', '', '', '', '']);
  const [assignedParticipants, setAssignedParticipants] = useState<Participant[]>([]);
  const [revealMode, setRevealMode] = useState(false);
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);

  const handlePrint = (game: Game) => {
    setSelectedGame(game);
    setPrintMode(true);
    setTimeout(() => window.print(), 100);
  };

  const handlePrintAll = () => {
    setPrintAllGames(true);
    setTimeout(() => window.print(), 100);
  };

  const openParticipantsModal = (game: Game) => {
    setCurrentGameForRoles(game);
    setShowParticipantsModal(true);
    setParticipantInputs(['', '', '', '', '', '']);
    setAssignedParticipants([]);
    setRevealMode(false);
    setCurrentRevealIndex(0);
    setIsRevealing(false);
  };

  const updateParticipantInput = (index: number, value: string) => {
    const newInputs = [...participantInputs];
    newInputs[index] = value;
    setParticipantInputs(newInputs);
  };

  const addMoreInputs = () => {
    setParticipantInputs([...participantInputs, '', '']);
  };

  const assignRoles = () => {
    if (!currentGameForRoles) return;

    const participantNames = participantInputs
      .map(name => name.trim())
      .filter(name => name.length > 0);

    if (participantNames.length === 0) return;

    const shuffledRoles = [...currentGameForRoles.roles].sort(() => Math.random() - 0.5);
    
    const assigned: Participant[] = participantNames.map((name, index) => ({
      name,
      role: shuffledRoles[index % shuffledRoles.length]
    }));

    setAssignedParticipants(assigned);
    setRevealMode(true);
    setCurrentRevealIndex(0);
    setIsRevealing(false);
  };

  const handleRevealRole = () => {
    setIsRevealing(true);
  };

  const handleNextParticipant = () => {
    setIsRevealing(false);
    if (currentRevealIndex < assignedParticipants.length - 1) {
      setCurrentRevealIndex(currentRevealIndex + 1);
    }
  };

  const handleRestart = () => {
    setRevealMode(false);
    setCurrentRevealIndex(0);
    setIsRevealing(false);
    setParticipantInputs(['', '', '', '', '', '']);
    setAssignedParticipants([]);
  };

  if (printAllGames) {
    return (
      <div className="print-page bg-white p-8">
        <style>{`
          @media print {
            body { margin: 0; padding: 10px; background: white; }
            .no-print { display: none !important; }
            .print-page { display: block !important; }
            .game-summary-card { page-break-inside: avoid; }
          }
          @page { size: A4; margin: 10mm; }
        `}</style>
        
        <div className="text-center mb-8 pb-4 border-b-2 border-slate-300">
          <div className="flex items-center justify-center mb-3">
            <Snowflake className="text-sky-500" size={40} />
            <h1 className="text-[60px] font-bold text-slate-800 mx-4">Ամանորյա Խաղերի Հավաքածու</h1>
            <Sparkles className="text-amber-500" size={40} />
          </div>
          <p className="text-xl text-slate-600 font-semibold">10 Շքեղ Դերային Խաղ</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="game-summary-card border-2 border-slate-200 rounded-xl p-6 bg-gradient-to-br from-slate-50 to-blue-50"
              style={{ minHeight: '320px' }}
            >
              <div className="flex items-center mb-4 pb-3 border-b border-slate-200">
                <div className="bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-2xl font-bold mr-4 shadow-md">
                  {game.id}
                </div>
                <h2 className="text-2xl font-bold text-slate-800">{game.name}</h2>
              </div>

              <p className="text-sm text-slate-700 mb-3 leading-relaxed">{game.description}</p>

              <div className="space-y-2 mb-3">
                <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
                  <p className="text-xs text-slate-700"><strong className="text-blue-600">⏱️</strong> {game.duration} | <strong className="text-blue-600">👥</strong> {game.players}</p>
                </div>
                
                <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">
                  <p className="text-xs text-slate-700"><strong className="text-amber-600">🎯</strong> {game.materials}</p>
                </div>

                <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                  <p className="text-xs text-slate-700"><strong className="text-emerald-600">🍽️</strong> {game.food}</p>
                </div>
              </div>

              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                <h3 className="font-bold text-indigo-700 mb-2 text-sm flex items-center">
                  <Users className="mr-1" size={16} />
                  Դերեր ({game.roles.length}):
                </h3>
                <div className="grid grid-cols-2 gap-1">
                  {game.roles.map((role, idx) => (
                    <div
                      key={idx}
                      className="bg-white px-2 py-1 rounded text-xs font-medium text-slate-700 border border-slate-200"
                    >
                      {role.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center mt-3 space-x-2">
                <Gift className="text-emerald-500" size={18} />
                <Heart className="text-rose-500" size={18} />
                <Wine className="text-purple-500" size={18} />
                <Sparkles className="text-amber-500" size={18} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center border-t-2 border-slate-300 pt-6">
          <div className="flex items-center justify-center space-x-4 text-2xl mb-3">
            <Snowflake className="text-sky-500" />
            <Heart className="text-rose-500" />
            <Wine className="text-purple-500" />
            <Gift className="text-emerald-500" />
            <Sparkles className="text-amber-500" />
          </div>
          <p className="text-xl text-slate-700 font-bold">
            Շնորհավոր Նոր Տարի և Սուրբ Ծնունդ! 🎄🎉
          </p>
        </div>

        <button
          onClick={() => setPrintAllGames(false)}
          className="no-print fixed top-4 right-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-sky-600 hover:to-blue-700 shadow-xl font-bold text-lg"
        >
          ✕ Փակել
        </button>
      </div>
    );
  }

  if (printMode && selectedGame) {
    return (
      <div className="print-page bg-gradient-to-br from-slate-50 to-blue-50 p-8">
        <style>{`
          @media print {
            body { margin: 0; padding: 15px; background: white; }
            .no-print { display: none !important; }
            .print-page { display: block !important; }
          }
          @page { size: A4; margin: 8mm; }
          .card-shadow { 
            box-shadow: 0 4px 12px rgba(71, 85, 105, 0.2);
          }
        `}</style>
        
        <div className="text-center mb-8 py-6 border-b-2 border-slate-300">
          <div className="flex items-center justify-center mb-4">
            <Snowflake className="text-sky-500" size={36} />
            <h1 className="text-5xl font-bold text-slate-800 mx-4 tracking-wide">{selectedGame.name}</h1>
            <Sparkles className="text-amber-500" size={36} />
          </div>
          <p className="text-xl text-slate-700 mb-3 font-semibold">{selectedGame.description}</p>
          <p className="text-base text-slate-600 leading-relaxed mb-4 max-w-4xl mx-auto">{selectedGame.fullDescription}</p>
          
          <div className="grid grid-cols-2 gap-4 max-w-5xl mx-auto mt-6">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-200">
              <p className="text-sm font-bold text-indigo-700">⏱️ Տևողություն: {selectedGame.duration}</p>
            </div>
            <div className="bg-gradient-to-r from-sky-50 to-cyan-50 p-4 rounded-xl border border-sky-200">
              <p className="text-sm font-bold text-sky-700">👥 Խաղացողներ: {selectedGame.players}</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-orange-200 mt-4 max-w-5xl mx-auto">
            <p className="text-sm font-bold text-orange-700">🎯 Անհրաժեշտ նյութեր: {selectedGame.materials}</p>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-200 mt-4 max-w-5xl mx-auto">
            <p className="text-sm font-bold text-emerald-700">{selectedGame.food}</p>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-xl border border-amber-200 mt-4 max-w-5xl mx-auto">
            <p className="text-sm font-bold text-amber-700">{selectedGame.tips}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {selectedGame.roles.map((role, idx) => (
            <div
              key={idx}
              className="border-2 border-slate-300 rounded-2xl p-6 bg-gradient-to-br from-white to-blue-50 card-shadow"
              style={{
                pageBreakInside: 'avoid',
                minHeight: '280px'
              }}
            >
              <div className="flex items-center justify-center mb-4 pb-3 border-b border-slate-200">
                <Snowflake className="text-sky-500" size={28} />
                <h3 className="text-2xl font-bold text-slate-800 text-center mx-3">{role.name}</h3>
                <Sparkles className="text-amber-500" size={28} />
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-slate-700 leading-relaxed">{role.task}</p>
              </div>
              
              <div className="bg-indigo-50 bg-opacity-80 p-3 rounded-lg border border-dashed border-indigo-300 mt-4">
                <p className="text-xs text-indigo-800 font-medium">💭 Հուշումներ: {role.hints}</p>
              </div>
              
              <div className="flex justify-center mt-4 space-x-3">
                <Gift className="text-emerald-600" size={20} />
                <Heart className="text-rose-600" size={20} />
                <Wine className="text-purple-600" size={20} />
                <Sparkles className="text-amber-500" size={20} />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            setPrintMode(false);
            setSelectedGame(null);
          }}
          className="no-print fixed top-4 right-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-sky-600 hover:to-blue-700 shadow-xl font-bold text-lg"
        >
          ✕ Փակել
        </button>
      </div>
    );
  }

  if (showParticipantsModal && currentGameForRoles) {
    if (revealMode && assignedParticipants.length > 0) {
      const currentParticipant = assignedParticipants[currentRevealIndex];
      
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl max-w-4xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowParticipantsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={32} />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-slate-800 mb-2">{currentGameForRoles.name}</h2>
              <p className="text-lg text-slate-600">Մասնակից {currentRevealIndex + 1}-ը {assignedParticipants.length}-ից</p>
            </div>

            {!isRevealing ? (
              <div className="text-center py-12">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-2xl p-12 mb-8 shadow-xl">
                  <EyeOff size={64} className="mx-auto mb-6" />
                  <h3 className="text-5xl font-bold mb-4">{currentParticipant.name}</h3>
                  <p className="text-2xl mb-8">Պատրա՞ստ եք իմանալ ձեր դերը:</p>
                  <p className="text-xl opacity-90">⚠️ Մնացած մասնակիցները պետք է հեռու նայեն!</p>
                </div>

                <button
                  onClick={handleRevealRole}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-12 py-6 rounded-xl font-bold text-2xl hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg flex items-center justify-center mx-auto"
                >
                  <Eye size={32} className="mr-3" />
                  Բացել իմ դերը
                </button>
              </div>
            ) : (
              <div className="py-8">
                <div className="border-2 border-slate-300 rounded-2xl p-8 bg-gradient-to-br from-white to-blue-50 shadow-xl mb-8">
                  <div className="flex items-center justify-center mb-6 pb-4 border-b border-slate-200">
                    <Snowflake className="text-sky-500" size={36} />
                    <h3 className="text-4xl font-bold text-slate-800 text-center mx-4">
                      {currentParticipant.role?.name}
                    </h3>
                    <Sparkles className="text-amber-500" size={36} />
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-xl font-bold text-indigo-700 mb-3">📋 Ձեր առաջադրանքը:</h4>
                    <p className="text-lg text-slate-700 leading-relaxed">{currentParticipant.role?.task}</p>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                    <h4 className="text-lg font-bold text-indigo-800 mb-2">💭 Հուշումներ:</h4>
                    <p className="text-base text-indigo-700">{currentParticipant.role?.hints}</p>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  {currentRevealIndex < assignedParticipants.length - 1 ? (
                    <button
                      onClick={handleNextParticipant}
                      className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-10 py-5 rounded-xl font-bold text-xl hover:from-sky-600 hover:to-blue-700 transition-all shadow-lg flex items-center"
                    >
                      Հաջորդ մասնակիցը
                      <ChevronDown size={28} className="ml-3" />
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <button
                        onClick={() => setShowParticipantsModal(false)}
                        className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-10 py-5 rounded-xl font-bold text-xl hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg flex items-center mx-auto"
                      >
                        <Gift size={28} className="mr-3" />
                        Սկսել խաղը
                      </button>
                      <button
                        onClick={handleRestart}
                        className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-amber-700 transition-all shadow-lg flex items-center mx-auto"
                      >
                        <Shuffle size={24} className="mr-2" />
                        Վերաբաշխել դերերը
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    const filledParticipants = participantInputs.filter(name => name.trim().length > 0).length;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl max-w-3xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setShowParticipantsModal(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={32} />
          </button>

          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <UserPlus className="text-indigo-600" size={48} />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">{currentGameForRoles.name}</h2>
            <p className="text-lg text-slate-600">Ավելացրեք մասնակիցներին</p>
            <p className="text-sm text-indigo-600 mt-2">
              Հասանելի դերեր՝ {currentGameForRoles.roles.length} | Ավելացված՝ {filledParticipants}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-lg font-bold text-slate-700 mb-4">
              Մուտքագրեք մասնակիցների անունները:
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {participantInputs.map((value, index) => (
                <div key={index} className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600 font-bold text-lg">
                    {index + 1}.
                  </div>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateParticipantInput(index, e.target.value)}
                    placeholder={`Մասնակից ${index + 1}`}
                    className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 text-lg"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={addMoreInputs}
              className="mt-4 w-full bg-gradient-to-r from-sky-400 to-blue-500 text-white py-3 rounded-xl font-bold hover:from-sky-500 hover:to-blue-600 transition-all flex items-center justify-center"
            >
              <UserPlus size={20} className="mr-2" />
              Ավելացնել ևս 2 մասնակից
            </button>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowParticipantsModal(false)}
              className="bg-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-300 transition-all"
            >
              Չեղարկել
            </button>
            <button
              onClick={assignRoles}
              disabled={filledParticipants === 0}
              className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-indigo-600 hover:to-blue-700 transition-all shadow-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Shuffle size={24} className="mr-3" />
              Բաշխել դերերը ({filledParticipants})
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="relative max-w-7xl mx-auto">

        <div className="fixed left-[2rem] top-[2rem]">
          <button
            onClick={() => window.location.href = '/'}
            className="group relative flex px-8 py-4 text-xl font-bold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl h-[3rem] bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"
          >
            <span className="relative z-10 flex items-center gap-3">
              <svg 
                className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Գլխավոր էջ
              <Sparkles className="w-5 h-5 animate-pulse" />
            </span>
          </button>
        </div>

        <header className="text-center mb-12 bg-white bg-opacity-90 rounded-3xl p-8 shadow-xl border border-slate-200">
          <div className="flex items-center justify-center mb-6">
            <Snowflake className="text-sky-500 animate-spin" size={56} style={{animationDuration: '3s'}} />
            <h1 className="text-[60px] font-bold bg-gradient-to-r from-slate-700 via-indigo-600 to-blue-600 bg-clip-text text-transparent mx-6">
              Ամանորյա Խաղերի Հավաքածու
            </h1>
            <Sparkles className="text-amber-500 animate-pulse" size={56} />
          </div>
          <p className="text-2xl text-slate-700 font-semibold">
            10 Շքեղ Դերային Խաղ Աշխատավայրի Համար
          </p>
          <p className="text-lg text-slate-600 mt-3">
            🎭 Իմպրովիզացիա | 💋 Ֆլիրտ | 🍷 Զվարճություն | 🎉 Անմոռանալի Հուշեր
          </p>
          
          <button
            onClick={handlePrintAll}
            className="mt-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-xl font-bold hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg text-lg flex items-center justify-center mx-auto"
          >
            <Gift className="mr-3" size={24} />
            🖨️ Տպել Բոլոր Խաղերի Քարտերը
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 hover:border-indigo-300 transition-all hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mr-5 shadow-md">
                  {game.id}
                </div>
                <h2 className="text-3xl font-bold text-slate-800">{game.name}</h2>
              </div>

              <p className="text-slate-700 mb-4 text-lg leading-relaxed">{game.description}</p>

              <button
                onClick={() => setExpandedGame(expandedGame === game.id ? null : game.id)}
                className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 rounded-lg font-bold mb-4 hover:from-indigo-600 hover:to-blue-600 transition-all flex items-center justify-center"
              >
                {expandedGame === game.id ? <ChevronUp size={20} className="mr-2" /> : <ChevronDown size={20} className="mr-2" />}
                {expandedGame === game.id ? 'Թաքցնել Մանրամասները' : 'Տեսնել Մանրամասները'}
              </button>

              {expandedGame === game.id && (
                <div className="mb-6 space-y-3 animate-in">
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                    <p className="text-sm text-slate-700"><strong className="text-indigo-700">📖 Ամբողջական նկարագրություն:</strong> {game.fullDescription}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="text-sm text-slate-700"><strong className="text-blue-600">⏱️ Տևողություն:</strong> {game.duration}</p>
                    </div>
                    <div className="bg-cyan-50 p-3 rounded-lg border border-cyan-200">
                      <p className="text-sm text-slate-700"><strong className="text-cyan-600">👥 Խաղացողներ:</strong> {game.players}</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <p className="text-sm text-slate-700"><strong className="text-amber-600">🎯 Անհրաժեշտ է:</strong> {game.materials}</p>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                    <p className="text-sm text-slate-700"><strong className="text-emerald-600">🍽️ Ուտեստ և Խմիչք:</strong> {game.food}</p>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-sm text-slate-700"><strong className="text-yellow-600">💡 Խորհուրդներ:</strong> {game.tips}</p>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-bold text-slate-700 mb-3 flex items-center text-xl">
                  <Users className="mr-2 text-indigo-600" size={24} />
                  Դերեր ({game.roles.length} հատ):
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {game.roles.map((role, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-3 rounded-xl text-sm font-semibold text-indigo-800 border border-indigo-200 shadow-sm hover:shadow-md transition-all"
                    >
                      {role.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => openParticipantsModal(game)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-blue-700 transition-all flex items-center justify-center shadow-md text-lg"
                >
                  <UserPlus className="mr-3" size={24} />
                  👥 Ավելացնել խաղացողներին և բաշխել դերերը
                </button>

                <button
                  onClick={() => handlePrint(game)}
                  className="w-full bg-gradient-to-r from-sky-500 to-cyan-600 text-white py-4 rounded-xl font-bold hover:from-sky-600 hover:to-cyan-700 transition-all flex items-center justify-center shadow-md text-lg"
                >
                  <Gift className="mr-3" size={24} />
                  🖨️ Տպել Շքեղ Քարտերը
                </button>
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-16 text-center bg-white bg-opacity-90 rounded-3xl p-8 shadow-xl border border-slate-200">
          <div className="flex items-center justify-center space-x-6 text-3xl mb-4">
            <Snowflake className="text-sky-500 animate-bounce" />
            <Heart className="text-rose-500 animate-pulse" />
            <Wine className="text-purple-500 animate-bounce" />
            <Gift className="text-emerald-500 animate-pulse" />
            <Sparkles className="text-amber-500 animate-bounce" />
          </div>
          <p className="text-2xl text-slate-800 font-bold mb-2">
            Շնորհավոր Նոր Տարի և Սուրբ Ծնունդ! 🎄🎉
          </p>
          <p className="text-lg text-slate-600">
            Վայելեք խաղերը, ստեղծեք անմոռանալի հուշեր և լինեք երջանիկ! 💖
          </p>
        </footer>
      </div>
    </div>
  );
}