export type NarrationPayload = { text: string };
export type StatsPayload = {
    name: string;
    hp: number;
    maxHp: number;
    str: number;
};
// type InventoryPayload = { items: string[] };

export type GenericResponseTypes =
    | "player"
    | "narration"
    | "system"
    | "error"
    | "stats";
//   | "inventory"

// Define a map of types to their corresponding payloads
export type PayloadMap = {
    player: NarrationPayload;
    narration: NarrationPayload;
    system: NarrationPayload;
    error: NarrationPayload;
    stats: StatsPayload;
    //   inventory: InventoryPayload;
};

export type GameResponse = {
    [K in GenericResponseTypes]: {
        type: K;
        payload: PayloadMap[K];
    };
}[GenericResponseTypes];

export interface EntityData {
    name: string;
    description: string;
}

export interface NamedEntity extends EntityData {
    view: () => GameResponse | GameResponse[];
}
