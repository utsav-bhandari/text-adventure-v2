import type { EntityData, GameResponse, NamedEntity } from "../types";
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

class Room implements NamedEntity {
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

    // A private helper to gather all viewable entities in one list.
    private getContainedEntities(): NamedEntity[] {
        const entities: NamedEntity[] = [];
        if (this.monster) entities.push(this.monster);
        if (this.weapon) entities.push(this.weapon);
        if (this.armor) entities.push(this.armor);
        // add a new item type  here.
        return entities;
    }

    view(): GameResponse[] {
        const responses: GameResponse[] = [];

        // Start with the room's primary description.
        responses.push({
            type: "narration",
            payload: { text: this.description },
        });

        // Automatically get the view responses from all contained entities.
        const entityResponses = this.getContainedEntities()
            .map((entity) => entity.view())
            .flat(); // in case an entity's view returns an array.

        // Add all the entity responses to our main list.
        responses.push(...entityResponses);

        // Finally, describe the available exits.
        responses.push({
            type: "system",
            payload: { text: this.listExits() },
        });

        return responses;
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

    addNeighbor(direction: Exit, room: Room) {
        this.neighbors[direction] = room;
    }

    listExits() {
        const exitDirections = Object.keys(this.neighbors);
        return "Exits: [" + exitDirections.join(", ") + "]";
    }
}

export { Room, type Exit };
