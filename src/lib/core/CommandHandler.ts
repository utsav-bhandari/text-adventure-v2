import type { GameResponse, GenericResponseTypes, PayloadMap } from "../types";
import { FUNNY_ALIASES } from "../utils/constants";
import type { Game } from "../core/Game";
import type { Exit } from "./Room";

type ParsedCommand = {
    action: string;
    args: string[];
};

type ActionHandler = (
    action: string,
    args: string[]
) => GameResponse | GameResponse[];

type CommandConfig = {
    aliases: string[];
    handler: ActionHandler;
};

class CommandHandler {
    private commandMap: Record<string, ActionHandler> = {};
    private game: Game;

    constructor(game: Game) {
        // One source of truth
        this.game = game;
        const commandStore: CommandConfig[] = [
            {
                aliases: FUNNY_ALIASES,
                handler: this.handleFunnyOrEmpty.bind(this),
            },
            {
                aliases: ["look"],
                handler: this.handleLook.bind(this),
            },
            {
                aliases: ["north", "east", "south", "west"],
                handler: this.handleDirection.bind(this),
            },
            {
                aliases: ["stats"],
                handler: this.handleStats.bind(this),
            },
        ];

        this.initializeCommandMap(commandStore);
    }

    private initializeCommandMap(commandStore: CommandConfig[]): void {
        for (const config of commandStore) {
            for (const alias of config.aliases) {
                this.commandMap[alias] = config.handler;
            }
        }
    }

    private createResponseObject<T extends GenericResponseTypes>(
        type: T,
        payload: PayloadMap[T]
    ): GameResponse {
        return {
            type: type,
            payload: payload,
        } as GameResponse;
    }

    private addNarrationResponses(
        responses: {
            type: Exclude<GenericResponseTypes, "stats">;
            text: string;
        }[]
    ): GameResponse[] {
        const responseList: GameResponse[] = [];
        for (const { type, text } of responses) {
            responseList.push(this.createResponseObject(type, { text }));
        }
        return responseList;
    }

    private parseCommand(command: string): ParsedCommand {
        const tokens = command.split(/\s+/);
        const [action, ...args] = tokens;
        return { action, args };
    }

    // entry point
    public handleCommand(command: string): GameResponse | GameResponse[] {
        const { action, args } = this.parseCommand(command);
        const actionHandler = this.commandMap[action];

        return actionHandler
            ? actionHandler(action, args)
            : this.handleUnknown(command);
    }

    private handleUnknown(command: string): GameResponse {
        return this.createResponseObject("error", {
            text: `Are you sure >> ${command} << is a valid command?`,
        });
    }

    private handleLook(): GameResponse[] {
        const responseList: GameResponse[] = [];

        const narrationAndSystemMessages = this.addNarrationResponses([
            {
                type: "narration",
                text: "You find yourself in a dimly lit cavern. A chilling wind whispers past.",
            },
            {
                type: "system",
                text: "Type 'examine' to look closer, or 'move north' to proceed.",
            },
        ]);
        responseList.push(...narrationAndSystemMessages);

        const statsResponse = this.createResponseObject("stats", {
            name: "Adventurer",
            hp: 75,
            maxHp: 100,
            str: 12,
        });
        responseList.push(statsResponse);

        return responseList;
    }

    private handleDirection(direction: Exit): GameResponse {
        return this.createResponseObject("narration", {
            text: `You went ${direction}.`,
        });
    }

    private handleStats(): GameResponse {
        return this.createResponseObject("stats", {
            name: "Test",
            hp: 20,
            maxHp: 20,
            str: 14,
        });
    }

    private handleFunnyOrEmpty(action: string): GameResponse {
        let text = "";
        if (action === "") {
            text = "You ponder the void, and the void ponders back.";
        } else if (action === "hey" || action === "hi" || action === "hello") {
            text = "W-E-SSSSSSSSSSSS-T";
        } else if (action === "ls" || action === "dir") {
            text =
                "Accessing cached memories... a fleeting glimpse of forgotten data structures.";
        } else if (action === "cd" || action === "chdir") {
            text =
                "Transitioning through conceptual space... the architecture reconfigures.";
        } else if (action === "pwd") {
            text =
                "Current node identified: A nexus point in the infinite weave.";
        } else if (action === "cat" || action === "more" || action === "less") {
            text =
                "Parsing fragmented echoes... a narrative stitched from discarded code.";
        } else if (action === "echo") {
            text =
                "Your input is reflected, a ripple in the data stream. Does it truly originate from you?";
        } else if (action === "?") {
            text = `${"¿".repeat(Math.round(Math.random() * 10))}`;
        } else {
            // null/undefined
            text =
                "A mocking cackle echoes from unseen corners. That command holds no power here...";
        }

        return this.createResponseObject("system", {
            text: text,
        });
    }
}

export default CommandHandler;
