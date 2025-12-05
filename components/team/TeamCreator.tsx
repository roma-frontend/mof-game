// components/team/TeamCreator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Trash2, Crown, Save, X, Plus, Search, Mail, Phone } from 'lucide-react';
import { useSound } from '@/lib/sounds/soundManager';

interface Player {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar: string;
  department?: string;
  isActive: boolean;
}

interface Team {
  id: string;
  name: string;
  color: string;
  emoji: string;
  players: Player[];
  captain: Player | null;
  score: number;
}

interface TeamCreatorProps {
  onTeamsCreated?: (teams: Team[]) => void;
}

const teamColors = [
  { 
    color: 'from-red-500 to-pink-500', 
    bg: 'bg-gradient-to-r from-red-500 to-pink-500', 
    emoji: '🔴', 
    name: 'Կարմիր' 
  },
  { 
    color: 'from-blue-500 to-cyan-500', 
    bg: 'bg-gradient-to-r from-blue-500 to-cyan-500', 
    emoji: '🔵', 
    name: 'Կապույտ' 
  },
  { 
    color: 'from-green-500 to-emerald-500', 
    bg: 'bg-gradient-to-r from-green-500 to-emerald-500', 
    emoji: '🟢', 
    name: 'Կանաչ' 
  },
  { 
    color: 'from-yellow-500 to-orange-500', 
    bg: 'bg-gradient-to-r from-yellow-500 to-orange-500', 
    emoji: '🟡', 
    name: 'Դեղին' 
  },
  { 
    color: 'from-purple-500 to-violet-500', 
    bg: 'bg-gradient-to-r from-purple-500 to-violet-500', 
    emoji: '🟣', 
    name: 'Մանուշակագույն' 
  },
  { 
    color: 'from-teal-500 to-cyan-500', 
    bg: 'bg-gradient-to-r from-teal-500 to-cyan-500', 
    emoji: '🟦', 
    name: 'Փիրուզագույն' 
  },
];

const playerAvatars = [
  '👤', '👨', '👩', '🧑', '🧔', '👨‍💼', '👩‍💼', '👨‍🔧', 
  '👩‍🔧', '👨‍🎓', '👩‍🎓', '👨‍🍳', '👩‍🍳', '👨‍🔬', '👩‍🔬'
];

export const TeamCreator: React.FC<TeamCreatorProps> = ({ onTeamsCreated }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedColor, setSelectedColor] = useState(0);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerEmail, setNewPlayerEmail] = useState('');
  const [newPlayerPhone, setNewPlayerPhone] = useState('');
  const [selectedPlayerAvatar, setSelectedPlayerAvatar] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isValid, setIsValid] = useState({
    teamName: true,
    playerName: true
  });

  const sound = useSound();

  useEffect(() => {
    // Проверяем, можно ли начать игру
    const canStartGame = teams.length >= 2 && 
      teams.every(team => team.players.length >= 2);
    
    // Здесь можно добавить логику уведомления, если игра готова
  }, [teams]);

  const validateEmail = (email: string) => {
    return email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return phone === '' || /^\+?[0-9\s\-\(\)]+$/.test(phone);
  };

  const createTeam = () => {
    const trimmedName = newTeamName.trim();
    if (!trimmedName) {
      setIsValid(prev => ({ ...prev, teamName: false }));
      alert('Խնդրում ենք մուտքագրել թիմի անունը');
      return;
    }

    // Проверяем, нет ли команды с таким именем
    if (teams.some(team => team.name === trimmedName)) {
      alert('Այս անունով թիմ արդեն գոյություն ունի');
      return;
    }

    const newTeam: Team = {
      id: `team-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: trimmedName,
      color: teamColors[selectedColor].color,
      emoji: teamColors[selectedColor].emoji,
      players: [],
      captain: null,
      score: 0,
    };
    
    setTeams([...teams, newTeam]);
    setNewTeamName('');
    setIsValid(prev => ({ ...prev, teamName: true }));
    
    // Звуковой эффект
    sound.playTeamCreated();
  };

  const deleteTeam = (teamId: string) => {
    const teamToDelete = teams.find(t => t.id === teamId);
    if (teamToDelete && teamToDelete.players.length > 0) {
      if (!confirm(`Հեռացնել "${teamToDelete.name}" թիմը? Խաղացողները կվերադառնան հասանելի ցուցակին։`)) {
        return;
      }
      
      // Возвращаем игроков в доступный список
      setAvailablePlayers(prev => [...prev, ...teamToDelete.players]);
    }
    
    setTeams(teams.filter(t => t.id !== teamId));
    sound.playClick();
  };

  const addNewPlayer = () => {
    const trimmedName = newPlayerName.trim();
    if (!trimmedName) {
      setIsValid(prev => ({ ...prev, playerName: false }));
      alert('Խնդրում ենք մուտքագրել խաղացողի անունը');
      return;
    }

    if (!validateEmail(newPlayerEmail)) {
      alert('Խնդրում ենք մուտքագրել վավեր էլ․ հասցե');
      return;
    }

    if (!validatePhone(newPlayerPhone)) {
      alert('Խնդրում ենք մուտքագրել վավեր հեռախոսահամար');
      return;
    }

    const newPlayer: Player = {
      id: `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: trimmedName,
      email: newPlayerEmail || undefined,
      phone: newPlayerPhone || undefined,
      avatar: playerAvatars[selectedPlayerAvatar],
      isActive: true,
    };
    
    setAvailablePlayers([...availablePlayers, newPlayer]);
    setNewPlayerName('');
    setNewPlayerEmail('');
    setNewPlayerPhone('');
    setSelectedPlayerAvatar(0);
    setIsValid(prev => ({ ...prev, playerName: true }));
    
    sound.playPlayerAdded();
  };

  const addPlayerToTeam = (teamId: string, playerId: string) => {
    const player = availablePlayers.find(p => p.id === playerId);
    if (!player) return;

    setTeams(teams.map(team => {
      if (team.id === teamId && !team.players.some(p => p.id === playerId)) {
        const updatedPlayers = [...team.players, player];
        return {
          ...team,
          players: updatedPlayers,
          captain: team.captain || player
        };
      }
      return team;
    }));

    // Удаляем из доступного списка
    setAvailablePlayers(availablePlayers.filter(p => p.id !== playerId));
    sound.playClick();
  };

  const removePlayerFromTeam = (teamId: string, playerId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;

    const player = team.players.find(p => p.id === playerId);
    if (player) {
      setAvailablePlayers([...availablePlayers, player]);
    }

    setTeams(teams.map(t => {
      if (t.id === teamId) {
        const updatedPlayers = t.players.filter(p => p.id !== playerId);
        return {
          ...t,
          players: updatedPlayers,
          captain: t.captain?.id === playerId ? 
            (updatedPlayers.length > 0 ? updatedPlayers[0] : null) : 
            t.captain
        };
      }
      return t;
    }));
    
    sound.playClick();
  };

  const setTeamCaptain = (teamId: string, playerId: string) => {
    setTeams(teams.map(team => {
      if (team.id === teamId) {
        const captain = team.players.find(p => p.id === playerId);
        return { ...team, captain: captain || null };
      }
      return team;
    }));
    
    sound.playClick();
  };

  const handleStartGame = () => {
    if (teams.length < 2) {
      alert('Անհրաժեշտ է առնվազն 2 թիմ խաղը սկսելու համար');
      return;
    }

    const allTeamsValid = teams.every(team => team.players.length >= 2);
    if (!allTeamsValid) {
      const invalidTeams = teams.filter(team => team.players.length < 2);
      alert(`Յուրաքանչյուր թիմում պետք է լինի առնվազն 2 խաղացող: ${invalidTeams.map(t => t.name).join(', ')}`);
      return;
    }

    onTeamsCreated?.(teams);
  };

  const filteredAvailablePlayers = availablePlayers.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPlayers = teams.reduce((sum, team) => sum + team.players.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 animate-pulse">🎭 Ամանորյա Քվեստ</h1>
          <p className="text-xl text-blue-200">Ստեղծեք թիմերը և պատրաստվեք արկածի</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Левая сторона - Создание команд */}
          <div className="lg:col-span-2 space-y-8">
            {/* Создать новую команду */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Plus className="text-green-400" />
                Ստեղծել Նոր Թիմ
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Թիմի Անուն *</label>
                  <input
                    type="text"
                    value={newTeamName}
                    onChange={(e) => {
                      setNewTeamName(e.target.value);
                      setIsValid(prev => ({ ...prev, teamName: true }));
                    }}
                    placeholder="Օրինակ՝ Ծրագրավորողների Թիմ"
                    className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 ${
                      isValid.teamName ? 'border-white/20 focus:ring-blue-500' : 'border-red-500 focus:ring-red-500'
                    }`}
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm mb-2">Ընտրել Գույն</label>
                  <div className="flex flex-wrap gap-2">
                    {teamColors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(idx)}
                        className={`p-3 rounded-lg transition-all transform ${
                          selectedColor === idx 
                            ? 'ring-2 ring-white scale-110 shadow-lg' 
                            : 'hover:scale-105 hover:shadow-md'
                        }`}
                        style={{ 
                          background: color.bg.replace('bg-gradient-to-r ', ''),
                          backgroundImage: color.bg.includes('gradient') ? 
                            `linear-gradient(to right, ${color.bg.split('from-')[1].split(' ')[0]}, ${color.bg.split('to-')[1].split(' ')[0]})` 
                            : color.bg 
                        }}
                        title={`${color.name} թիմ`}
                      >
                        <span className="text-xl">{color.emoji}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={createTeam}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105 active:scale-95"
                  >
                    <UserPlus className="inline mr-2" />
                    Ստեղծել Թիմ
                  </button>
                </div>
              </div>
              
              {/* Текущие команды */}
              {teams.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Ընթացիկ Թիմերը ({teams.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teams.map((team) => (
                      <div
                        key={team.id}
                        className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div 
                              className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${team.color}`}
                              style={{
                                backgroundImage: team.color.includes('gradient') 
                                  ? `linear-gradient(to right, ${team.color.split('from-')[1].split(' ')[0]}, ${team.color.split('to-')[1].split(' ')[0]})`
                                  : team.color
                              }}
                            >
                              {team.emoji}
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-white">{team.name}</h4>
                              <p className="text-white/60 text-sm">
                                {team.players.length} խաղացող • {team.captain ? `Կապիտան՝ ${team.captain.name}` : 'Կապիտան չկա'}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteTeam(team.id)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-5 h-5 text-red-400" />
                          </button>
                        </div>
                        
                        {/* Игроки команды */}
                        <div className="mb-3">
                          <div className="text-white/80 text-sm mb-2">Խաղացողներ</div>
                          {team.players.length === 0 ? (
                            <div className="text-center py-2 bg-white/5 rounded-lg">
                              <p className="text-white/50 text-sm">Ոչ մի խաղացող</p>
                            </div>
                          ) : (
                            <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                              {team.players.map((player) => (
                                <div
                                  key={player.id}
                                  className="flex justify-between items-center bg-white/10 p-2 rounded-lg hover:bg-white/15 transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="text-lg">{player.avatar}</div>
                                    <div>
                                      <div className="text-white text-sm truncate max-w-[150px]">{player.name}</div>
                                      {team.captain?.id === player.id && (
                                        <div className="text-yellow-400 text-xs flex items-center gap-1">
                                          <Crown className="w-3 h-3" /> Կապիտան
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex gap-1">
                                    {team.captain?.id !== player.id && (
                                      <button
                                        onClick={() => setTeamCaptain(team.id, player.id)}
                                        className="p-1 hover:bg-yellow-500/20 rounded transition-colors"
                                        title="Դարձնել կապիտան"
                                      >
                                        <Crown className="w-4 h-4 text-yellow-400" />
                                      </button>
                                    )}
                                    <button
                                      onClick={() => removePlayerFromTeam(team.id, player.id)}
                                      className="p-1 hover:bg-red-500/20 rounded transition-colors"
                                      title="Հեռացնել"
                                    >
                                      <X className="w-4 h-4 text-red-400" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Быстрое добавление нового игрока */}
                        <div className="mt-2">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                addPlayerToTeam(team.id, e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="w-full bg-black/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            disabled={availablePlayers.length === 0}
                          >
                            <option value="">
                              {availablePlayers.length === 0 
                                ? 'Հասանելի խաղացողներ չկան' 
                                : 'Ավելացնել խաղացող...'}
                            </option>
                            {availablePlayers.map((player) => (
                              <option key={player.id} value={player.id}>
                                {player.avatar} {player.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Правая сторона - Управление игроками */}
          <div className="space-y-8">
            {/* Добавить нового игрока */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <UserPlus className="text-blue-400" />
                Ավելացնել Նոր Խաղացող
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Անուն *</label>
                  <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => {
                      setNewPlayerName(e.target.value);
                      setIsValid(prev => ({ ...prev, playerName: true }));
                    }}
                    placeholder="Անուն Ազգանուն"
                    className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 ${
                      isValid.playerName ? 'border-white/20 focus:ring-blue-500' : 'border-red-500 focus:ring-red-500'
                    }`}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Էլ. հասցե</label>
                    <input
                      type="email"
                      value={newPlayerEmail}
                      onChange={(e) => setNewPlayerEmail(e.target.value)}
                      placeholder="email@company.com"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Հեռախոս</label>
                    <input
                      type="tel"
                      value={newPlayerPhone}
                      onChange={(e) => setNewPlayerPhone(e.target.value)}
                      placeholder="+374 XX XXX XXX"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm mb-2">Ընտրել Ավատար</label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2">
                    {playerAvatars.map((avatar, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPlayerAvatar(idx)}
                        className={`text-2xl p-2 rounded-lg transition-all ${
                          selectedPlayerAvatar === idx 
                            ? 'bg-blue-500/30 ring-2 ring-blue-400 scale-110' 
                            : 'bg-white/10 hover:bg-white/20 hover:scale-105'
                        }`}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={addNewPlayer}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 active:scale-95 mt-4"
                >
                  <Save className="inline mr-2" />
                  Պահպանել Խաղացողին
                </button>
              </div>
            </div>

            {/* Доступные игроки */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20 shadow-2xl">
              <div className="flex flex-col gap-4 justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="text-green-400" />
                  Հասանելի Խաղացողներ ({availablePlayers.length})
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Որոնել անունով, բաժնով..."
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredAvailablePlayers.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="text-2xl flex-shrink-0">{player.avatar}</div>
                      <div className="min-w-0">
                        <div className="text-white font-medium truncate">{player.name}</div>
                        {player.department && (
                          <div className="text-white/60 text-xs truncate">{player.department}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {player.email && (
                        <a
                          href={`mailto:${player.email}`}
                          className="p-1 hover:bg-blue-500/20 rounded transition-colors"
                          title="Էլ. նամակ"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Mail className="w-4 h-4 text-blue-400" />
                        </a>
                      )}
                      {player.phone && (
                        <a
                          href={`tel:${player.phone}`}
                          className="p-1 hover:bg-green-500/20 rounded transition-colors"
                          title="Զանգահարել"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Phone className="w-4 h-4 text-green-400" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredAvailablePlayers.length === 0 && (
                  <div className="text-center py-8 text-white/60">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>{searchTerm ? 'Խաղացողներ չեն գտնվել' : 'Հասանելի խաղացողներ չկան'}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Статус игры */}
            {teams.length > 0 && (
              <div className={`rounded-2xl p-6 border-2 shadow-2xl transition-all ${
                teams.length >= 2 && teams.every(t => t.players.length >= 2)
                  ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/30'
                  : 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/30'
              }`}>
                <h3 className="text-xl font-bold text-white mb-4">
                  {teams.length >= 2 && teams.every(t => t.players.length >= 2) 
                    ? '✅ Պատրաստ է խաղի' 
                    : '⚠️ Պատրաստվում է'}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/80">Թիմեր</span>
                    <span className={`font-bold ${
                      teams.length >= 2 ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {teams.length} / 2+
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Ընդհանուր խաղացողներ</span>
                    <span className="text-white font-bold">{totalPlayers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Նվազագույն թիմի չափ</span>
                    <span className={`font-bold ${
                      Math.min(...teams.map(t => t.players.length)) >= 2 
                        ? 'text-green-400' 
                        : 'text-yellow-400'
                    }`}>
                      {Math.min(...teams.map(t => t.players.length))} / 2+
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={handleStartGame}
                  disabled={teams.length < 2 || !teams.every(t => t.players.length >= 2)}
                  className={`w-full mt-4 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg ${
                    teams.length >= 2 && teams.every(t => t.players.length >= 2)
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                      : 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed'
                  }`}
                >
                  {teams.length >= 2 && teams.every(t => t.players.length >= 2)
                    ? '🚀 Սկսել Քվեստը'
                    : 'Պատրաստվում է...'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Статистика */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-xl p-4 text-center hover:bg-white/15 transition-colors">
            <div className="text-3xl text-white font-bold">{teams.length}</div>
            <div className="text-white/60 text-sm">Թիմեր</div>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4 text-center hover:bg-white/15 transition-colors">
            <div className="text-3xl text-white font-bold">{totalPlayers}</div>
            <div className="text-white/60 text-sm">Ընդհանուր խաղացողներ</div>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4 text-center hover:bg-white/15 transition-colors">
            <div className="text-3xl text-white font-bold">{availablePlayers.length}</div>
            <div className="text-white/60 text-sm">Հասանելի խաղացողներ</div>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4 text-center hover:bg-white/15 transition-colors">
            <div className="text-3xl text-white font-bold">
              {teams.filter(t => t.captain).length}
            </div>
            <div className="text-white/60 text-sm">Կապիտաններ</div>
          </div>
        </div>
      </div>
    </div>
  );
};