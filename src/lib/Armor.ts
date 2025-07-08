import { type NamedEntity } from "./types";

interface ArmorData extends NamedEntity {
    defense: number;
}

class Armor {
    public readonly name: string;
    public readonly description: string;
    public readonly defense: number;

    constructor(data: ArmorData) {
        this.name = data.name;
        this.description = data.description;
        this.defense = data.defense;
    }
}

export { Armor, type ArmorData };
