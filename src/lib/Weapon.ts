export interface WeaponData {
    name: string;
    description: string;
    baseDamage: number;
    critChance: number;
}

class Weapon {
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
}

export { Weapon };
