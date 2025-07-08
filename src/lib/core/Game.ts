import { Armor } from "../entities/Armor";
import CommandHandler from "./CommandHandler";
import { Monster } from "../entities/Monster";
import { Room, type Exit } from "./Room";
import roomsJson from "../data/rooms.json";
import type { GameResponse, GenericResponseTypes } from "../types";
import { Weapon } from "../entities/Weapon";

class Game {
    public roomsMap: Map<string, Room>;
    public currentRoom: Room;
    private commandHandler: CommandHandler;

    constructor() {
        this.commandHandler = new CommandHandler(this);

        this.roomsMap = new Map<string, Room>();

        // First pass: create room instances
        for (const roomData of roomsJson.rooms) {
            const room = new Room(roomData);

            if (roomData.weapon) room.setWeapon(new Weapon(roomData.weapon));
            if (roomData.monster)
                room.setMonster(new Monster(roomData.monster));
            if (roomData.armor) room.setArmor(new Armor(roomData.armor));
            // if (roomData.treasure)
            //     room.setTreasure(new Treasure(roomData.treasure));
            // if (roomData.fountain) room.setFountain(new Fountain());

            this.roomsMap.set(roomData.name, room);
        }

        // Second pass: wire neighbors
        for (const roomData of roomsJson.rooms) {
            const room = this.roomsMap.get(roomData.name)!;

            for (const [dir, neighborId] of Object.entries(
                roomData.neighbors
            ) as [Exit, string][]) {
                const neighbor = this.roomsMap.get(neighborId);
                if (neighbor) room.addNeighbor(dir, neighbor);
            }
        }

        this.currentRoom = this.roomsMap.get("Entrance")!;
    }

    public handleCommand(command: string): GameResponse | GameResponse[] {
        return this.commandHandler.handleCommand(command);
    }
}

export { Game, type GameResponse, type GenericResponseTypes };
