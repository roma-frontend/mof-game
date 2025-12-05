export type GameState = 'teamSetup' | 'ready' | 'playing' | 'paused' | 'results';
export type RoomType = 'office' | 'kitchen' | 'orange-meeting' | 'blue-meeting' | 'consultant' | 'reception' | 'it-room';

export interface Player {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar: string;
  department?: string;
  isActive: boolean;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  emoji: string;
  players: Player[];
  captain: Player | null;
  score: number;
  currentRoom: RoomType;
  completedRooms: RoomType[];
  foundItems: string[];
  hintsUsed: number;
}

export interface Puzzle {
  id: string;
  room: RoomType;
  title: string;
  description: string;
  type: 'code' | 'pattern' | 'logic' | 'search' | 'memory';
  difficulty: 1 | 2 | 3 | 4 | 5;
  solution: string;
  hints: string[];
  timeLimit: number; // վայրկյաններով
}