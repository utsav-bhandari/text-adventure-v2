import type { GameResponse } from "../types";
import { FUNNY_ALIASES } from "../utils/constants";
import { createResponseObject, addNarrationResponses } from "../utils/utils";
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

    private parseCommand(command: string): ParsedCommand {
        const tokens = command.split(/\s+/);
        const [action, ...args] = tokens;
        return { action, args };
    }

    // entry point
    public handleCommand(command: string): GameResponse[] {
        const { action, args } = this.parseCommand(command);
        const actionHandler = this.commandMap[action];

        let result: GameResponse | GameResponse[];

        if (actionHandler) {
            result = actionHandler(action, args);
        } else {
            result = this.handleUnknown(command);
        }

        result = Array.isArray(result) ? result : [result];

        // hijack response array every time to send this message
        result.push(
            createResponseObject("system", {
                text: `You are in ${this.game.currentRoom.name}.`,
            })
        );

        return result;
    }

    private handleUnknown(command: string): GameResponse {
        return createResponseObject("error", {
            text: `Are you sure >> ${command} << is a valid command?`,
        });
    }

    private handleLook(): GameResponse[] {
        return this.game.currentRoom.view();
    }

    private handleDirection(action: string): GameResponse[] {
        return this.game.movePlayer(action as Exit);
    }

    private handleStats(): GameResponse {
        return createResponseObject("stats", {
            name: "Adventurer",
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
        } else if (
            action === "northeast" ||
            action === "northwest" ||
            action === "southeast" ||
            action === "southwest"
        ) {
            text = "sigh...";
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

        return createResponseObject("system", {
            text: text,
        });
    }
}

export default CommandHandler;
