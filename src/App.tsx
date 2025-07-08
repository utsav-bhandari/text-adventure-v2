import { useState, useRef } from "react";
import { Game, type GameResponse } from "./lib/core/Game";
import Console from "./components/Console";
import Map from "./components/Map";

export type Message = {
    id: number;
} & GameResponse;

const game = new Game();

function App() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            type: "system",
            payload: {
                text: "You are in the Entrance. Goal: Defeat the Duskborne Archlich.",
            },
        },
    ]);

    const messageIdCounter = useRef(messages.length + 1);

    function handleSubmit(formData: FormData) {
        let command = formData.get("command") ?? "";
        command = command.toString().trim().toLowerCase();

        // handle misc commands here before game commands
        if (command === "clear" || command === "cls") {
            setMessages([]);
            messageIdCounter.current = 1;
            return;
        }

        // Create a message object for the player's command
        const playerMessage: Message = {
            id: messageIdCounter.current++,
            type: "player",
            payload: { text: `> ${command}` },
        };

        // Get the game's response
        const gameResponses = game.handleCommand(command);

        let gameMessages: Message[] = [];

        // multiple responses received
        if (gameResponses instanceof Array) {
            for (const gameResponse of gameResponses) {
                gameMessages.push({
                    id: messageIdCounter.current++,
                    ...gameResponse,
                });
            }
            // single response
        } else {
            gameMessages.push({
                id: messageIdCounter.current++,
                ...gameResponses,
            });
        }

        // Update the state with both new messages
        setMessages((prevMessages) => [
            ...prevMessages,
            playerMessage,
            ...gameMessages,
        ]);
    }

    return (
        <main>
            {/* Pass the full list of messages to the Console */}
            <Console messages={messages} handleSubmit={handleSubmit} />
            <Map />
        </main>
    );
}

export default App;
