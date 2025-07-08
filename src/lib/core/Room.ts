import type { EntityData } from "../types";
import type { Armor, ArmorData } from "../entities/Armor";
import type { Monster, MonsterData } from "../entities/Monster";
import type { Weapon, WeaponData } from "../entities/Weapon";

interface RoomData extends EntityData {
    neighbors: Partial<Record<Exit, string>>; // direction to room name
    monster?: MonsterData;
    weapon?: WeaponData;
    armor?: ArmorData;
}

type Exit = "north" | "east" | "south" | "west";

class Room {
    public readonly name: string;
    public readonly description: string;
    public neighbors: Partial<Record<Exit, Room>> = {};

    private monster?: Monster;
    private weapon?: Weapon;
    private armor?: Armor;
    // more to come

    constructor(data: RoomData) {
        this.name = data.name;
        this.description = data.description;
    }

    look() {
        console.log("looked at room and things in room");
    }

    setMonster(monster: Monster) {
        this.monster = monster;
    }

    setWeapon(weapon: Weapon) {
        this.weapon = weapon;
    }

    setArmor(armor: Armor) {
        this.armor = armor;
    }

    public addNeighbor(direction: Exit, room: Room) {
        this.neighbors[direction] = room;
    }
}

export { Room, type Exit };
