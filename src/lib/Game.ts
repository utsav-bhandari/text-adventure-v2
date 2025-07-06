import CommandHandler from "./CommandHandler";

type NarrationPayload = { text: string };
type StatsPayload = { name: string; hp: number; maxHp: number; str: number };

type GenericResponseTypes =
    | "player"
    | "narration"
    | "system"
    | "error"
    | "stats";

type GameResponse =
    | {
          type: Exclude<GenericResponseTypes, "stats">;
          payload: NarrationPayload;
      }
    | { type: Extract<GenericResponseTypes, "stats">; payload: StatsPayload };

class Game {
    private playerStats: StatsPayload = {
        name: "Arin",
        hp: 85,
        maxHp: 100,
        str: 14,
    };

    private static instance: Game;

    private commandHandler: CommandHandler;

    private constructor() {
        this.commandHandler = new CommandHandler();
    }

    public static getGameInstance() {
        if (!Game.instance) Game.instance = new Game();
        return Game.instance;
    }

    public handleCommand(command: string): GameResponse {
        return this.commandHandler.handleCommand(command);
    }
}

export { Game, type GameResponse, type GenericResponseTypes };
