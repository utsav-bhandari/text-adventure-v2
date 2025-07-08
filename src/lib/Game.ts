import CommandHandler from "./CommandHandler";
import { Monster } from "./Monster";
import { Room, type Exit } from "./Room";
import roomsJson from "./rooms.json";
import { Weapon } from "./Weapon";

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
    private roomsMap: Map<string, Room>;
    private currentRoom: Room;

    private playerStats: StatsPayload = {
        name: "Arin",
        hp: 85,
        maxHp: 100,
        str: 14,
    };

    private commandHandler: CommandHandler;

    constructor() {
        this.commandHandler = new CommandHandler();

        this.roomsMap = new Map<string, Room>();

        // First pass: create room instances
        for (const roomData of roomsJson.rooms) {
            const room = new Room(roomData);

            if (roomData.weapon) room.setWeapon(new Weapon(roomData.weapon));
            if (roomData.monster)
                room.setMonster(new Monster(roomData.monster));
            // if (roomData.armor) room.setArmor(new Armor(roomData.armor));
            // if (roomData.treasure)
            //     room.setTreasure(new Treasure(roomData.treasure));
            // if (roomData.fountain) room.setFountain(new Fountain());

            this.roomsMap.set(roomData.name, room);
        }

        // Second pass: wire neighbors
        for (const roomData of roomsJson.rooms) {
            const room = this.roomsMap.get(roomData.name)!;

            if (roomData.neighbors) {
                for (const [dir, neighborId] of Object.entries(
                    roomData.neighbors
                ) as [Exit, string][]) {
                    const neighbor = this.roomsMap.get(neighborId);
                    if (neighbor) room.addNeighbor(dir, neighbor);
                }
            }
        }

        this.currentRoom = this.roomsMap.get("entrance")!;
    }

    public handleCommand(command: string): GameResponse {
        return this.commandHandler.handleCommand(command);
    }
}

export { Game, type GameResponse, type GenericResponseTypes };
