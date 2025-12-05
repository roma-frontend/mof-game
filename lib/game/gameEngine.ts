import { GameState, RoomType, Puzzle, Team } from '@/types/game';

class GameEngine {
  private static instance: GameEngine;
  private gameState: GameState = 'teamSetup';
  private currentRoom: RoomType = 'office';
  private teams: Team[] = [];
  private currentTeamIndex: number = 0;
  private startTime: number = 0;
  private timerInterval: NodeJS.Timeout | null = null;

  static getInstance(): GameEngine {
    if (!GameEngine.instance) {
      GameEngine.instance = new GameEngine();
    }
    return GameEngine.instance;
  }

  startGame(teams: Team[]) {
    if (teams.length < 2) {
      throw new Error('Անհրաժեշտ է առնվազն 2 թիմ խաղը սկսելու համար');
    }

    this.teams = teams.map(team => ({
      ...team,
      score: 0,
      currentRoom: 'office',
      completedRooms: [],
      foundItems: [],
      hintsUsed: 0,
    }));

    this.gameState = 'ready';
    this.currentTeamIndex = 0;
    this.currentRoom = 'office';
    
    // Ստարտել հաշվարկը
    this.startTime = Date.now();
    this.startTimer();
    
    console.log('Խաղը սկսված է:', this.teams);
  }

  private startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    
    this.timerInterval = setInterval(() => {
      // Այստեղ կարող եք ավելացնել ժամանակի հաշվարկի լոգիկա
      // Օրինակ՝ սենյակի ժամանակի սպառում
    }, 1000);
  }

  getCurrentTeam(): Team {
    return this.teams[this.currentTeamIndex];
  }

  moveToNextRoom(): boolean {
    const currentTeam = this.getCurrentTeam();
    const rooms: RoomType[] = ['office', 'kitchen', 'orange-meeting', 'blue-meeting', 'consultant', 'reception', 'it-room'];
    const currentIndex = rooms.indexOf(currentTeam.currentRoom);
    
    if (currentIndex < rooms.length - 1) {
      currentTeam.currentRoom = rooms[currentIndex + 1];
      return true;
    }
    return false;
  }

  completePuzzle(teamId: string, points: number) {
    const team = this.teams.find(t => t.id === teamId);
    if (team) {
      team.score += points;
      
      // Ավելացնել սենյակը ավարտվածների ցանկին
      if (!team.completedRooms.includes(team.currentRoom)) {
        team.completedRooms.push(team.currentRoom);
      }
    }
  }

  switchToNextTeam() {
    this.currentTeamIndex = (this.currentTeamIndex + 1) % this.teams.length;
    this.currentRoom = this.getCurrentTeam().currentRoom;
  }

  getGameState(): GameState {
    return this.gameState;
  }

  setGameState(state: GameState) {
    this.gameState = state;
  }

  getAllTeams(): Team[] {
    return this.teams;
  }

  getLeaderboard() {
    return [...this.teams].sort((a, b) => b.score - a.score);
  }

  resetGame() {
    this.gameState = 'teamSetup';
    this.teams = [];
    this.currentTeamIndex = 0;
    this.currentRoom = 'office';
    
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
}

export const gameEngine = GameEngine.getInstance();