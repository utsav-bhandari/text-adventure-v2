import type { Monster } from "./Monster";
import type { Weapon } from "./Weapon";

type Exit = "north" | "east" | "south" | "west";

class Room {
    private readonly name: string;
    private readonly description: string;
    private exits: Partial<Record<Exit, Room>>;

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
        this.exits = {};
    }

    setWeapon(arg0: Weapon) {
        return;
        throw new Error("Method not implemented.");
    }

    setMonster(arg0: Monster) {
        return;
        throw new Error("Method not implemented.");
    }

    public addNeighbor(direction: Exit, room: Room) {
        this.exits[direction] = room;
    }
}

export { Room, type Exit };
