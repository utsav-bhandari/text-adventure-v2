export type MonsterData = {
    name: string;
    attack: number;
    health: number;
    maxHealth: number;
    agility: number;
    description: string;
};

class Monster {
    public readonly name: string;
    public readonly description: string;
    public readonly attack: number;
    private health: number;
    public readonly agility: number;
    public readonly maxHealth: number;

    constructor(data: MonsterData) {
        this.name = data.name;
        this.attack = data.attack;
        this.health = data.health;
        this.maxHealth = data.maxHealth;
        this.agility = data.agility;
        this.description = data.description;
    }

    public getHp(): number {
        return this.health;
    }

    public setHp(hp: number): void {
        this.health = hp;
    }

    public takesDamage(damage: number): void {
        this.health -= damage;
    }

    public isDead(): boolean {
        return Math.ceil(this.health) <= 0;
    }

    public getAttackDamage(): number {
        return this.attack;
    }
}

export { Monster };
