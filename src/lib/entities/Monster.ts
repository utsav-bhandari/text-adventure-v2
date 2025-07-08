import type { EntityData, GameResponse, NamedEntity } from "../types";
import { createResponseObject } from "../utils/utils";

export interface MonsterData extends EntityData {
    attack: number;
    health: number;
    maxHealth: number;
    agility: number;
}

class Monster implements NamedEntity {
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
    view(): GameResponse | GameResponse[] {
        return createResponseObject("system", {
            text: `${this.name} appears!`,
        });
    }

    getHp(): number {
        return this.health;
    }

    setHp(hp: number): void {
        this.health = hp;
    }

    takesDamage(damage: number): void {
        this.health -= damage;
    }

    isDead(): boolean {
        return Math.ceil(this.health) <= 0;
    }

    getAttackDamage(): number {
        return this.attack;
    }
}

export { Monster };
