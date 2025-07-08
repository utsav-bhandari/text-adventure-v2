import { type EntityData, type GameResponse, type NamedEntity } from "../types";
import { createResponseObject } from "../utils/utils";

interface WeaponData extends EntityData {
    baseDamage: number;
    critChance: number;
}

class Weapon implements NamedEntity {
    public readonly name: string;
    public readonly description: string;
    private readonly baseDamage: number;
    private readonly critChance: number;

    constructor(data: WeaponData) {
        this.name = data.name;
        this.description = data.description;
        this.baseDamage = data.baseDamage;
        this.critChance = data.critChance;
    }
    view(): GameResponse | GameResponse[] {
        return createResponseObject("narration", {
            text: `You see a ${this.name} lying here. ${this.description}`,
        });
    }
}

export { Weapon, type WeaponData };
