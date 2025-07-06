import type { GameResponse, GenericResponseTypes } from "./Game";
import { FUNNY_ALIASES } from "./constants";

type ParsedCommand = {
    action: string;
    args: string[];
};

type ActionHandler = (action: string, args: string[]) => GameResponse;

type CommandConfig = {
    aliases: string[];
    handler: ActionHandler;
};
class CommandHandler {
    private commandMap: Record<string, ActionHandler> = {};

    constructor() {
        // One source of truth
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
        // Handle potential null/undefined input before splitting
        const commandStr = String(command ?? "")
            .trim()
            .toLowerCase();
        const tokens = commandStr.split(/\s+/);
        const [action, ...args] = tokens;
        return { action, args };
    }

    public handleCommand(command: string): GameResponse {
        const { action, args } = this.parseCommand(command);
        const actionHandler = this.commandMap[action];

        return actionHandler
            ? actionHandler(action, args)
            : this.handleUnknown(action);
    }

    private handleUnknown(command: string): GameResponse {
        return this.createResponseObject("error", {
            text: `Are you sure >> ${command} << is a valid command?`,
        });
    }

    private handleLook(): GameResponse {
        return this.createResponseObject("narration", {
            text: "You see the universe...",
        });
    }

    private handleDirection(action: string): GameResponse {
        return this.createResponseObject("narration", {
            text: `You went ${action}.`,
        });
    }

    private createResponseObject(
        type: GenericResponseTypes,
        payload: any
    ): GameResponse {
        return {
            type: type,
            payload: payload,
        };
    }

    private handleFunnyOrEmpty(action: string): GameResponse {
        if (action === "") {
            return this.createResponseObject("system", {
                text: "You ponder the void, and the void ponders back.",
            });
        } else if (action === "hey" || action === "hi" || action === "hello") {
            return this.createResponseObject("system", {
                text: "W-E-SSSSSSSSSSSS-T",
            });
        } else if (action === "ls" || action === "dir") {
            return this.createResponseObject("system", {
                text: "Accessing cached memories... a fleeting glimpse of forgotten data structures.",
            });
        } else if (action === "cd" || action === "chdir") {
            return this.createResponseObject("system", {
                text: "Transitioning through conceptual space... the architecture reconfigures.",
            });
        } else if (action === "pwd") {
            return this.createResponseObject("system", {
                text: "Current node identified: A nexus point in the infinite weave.",
            });
        } else if (action === "cat" || action === "more" || action === "less") {
            return this.createResponseObject("system", {
                text: "Parsing fragmented echoes... a narrative stitched from discarded code.",
            });
        } else if (action === "echo") {
            return this.createResponseObject("system", {
                text: "Your input is reflected, a ripple in the data stream. Does it truly originate from you?",
            });
        } else if (action === "?") {
            return this.createResponseObject("system", {
                text: `${"¿".repeat(Math.round(Math.random() * 10))}`,
            });
        } else {
            // null/undefined
            return this.createResponseObject("system", {
                text: "A mocking cackle echoes from unseen corners. That command holds no power here...Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quos consequuntur ex sapiente magni a, quasi corrupti aperiam, maiores, reprehenderit veniam laudantium ipsam. Quam ipsa voluptate excepturi porro, voluptatem repellendus odio.",
            });
        }
    }
}

export default CommandHandler;
