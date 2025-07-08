import { type EntityData, type GameResponse, type NamedEntity } from "../types";
import { createResponseObject } from "../utils/utils";

interface ArmorData extends EntityData {
    defense: number;
}

class Armor implements NamedEntity {
    public readonly name: string;
    public readonly description: string;
    public readonly defense: number;

    constructor(data: ArmorData) {
        this.name = data.name;
        this.description = data.description;
        this.defense = data.defense;
    }

    view(): GameResponse | GameResponse[] {
        return createResponseObject("narration", {
            text: `${this.name} here. ${this.description}`,
        });
    }
}

export { Armor, type ArmorData };
