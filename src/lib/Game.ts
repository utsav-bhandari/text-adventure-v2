// Define the shapes for each data payload
type NarrationPayload = { text: string };
type StatsPayload = { name: string; hp: number; maxHp: number; str: number };

type GameResponse =
    | { type: "narration" | "error"; payload: NarrationPayload }
    | { type: "stats"; payload: StatsPayload };

class Game {
    private playerStats: StatsPayload = {
        name: "Arin",
        hp: 85,
        maxHp: 100,
        str: 14,
    };

    constructor() {}

    handleCommand(command: string): GameResponse {
        const text = command.toLowerCase();

        switch (text) {
            case "look":
                return {
                    type: "narration",
                    payload: {
                        text: "You're in a cave. There's a tunnel to the east.",
                    },
                };

            case "stats":
                return {
                    type: "stats",
                    payload: this.playerStats,
                };

            case "go east":
                // You can update stats and then show narration
                this.playerStats.hp -= 5; // Example: take damage from a trap
                console.log(this.playerStats.hp);
                return {
                    type: "narration",
                    payload: {
                        text: "You walk into a chamber filled with crystals. You feel a bit weaker.",
                    },
                };

            default:
                return {
                    type: "error",
                    payload: {
                        text: `The command "${command}" doesn't work here.`,
                    },
                };
        }
    }
}

export { Game, type GameResponse };
