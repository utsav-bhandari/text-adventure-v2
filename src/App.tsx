import { useState, useRef } from "react";
import { Game, type GameResponse } from "./lib/Game";
import Console from "./components/Console";
import Map from "./components/Map";

export type Message = {
    id: number;
} & GameResponse;

function App() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, type: "system", payload: { text: "Welcome" } },
    ]);

    const messageIdCounter = useRef(messages.length + 1);

    function handleSubmit(formData: FormData) {
        let command = formData.get("command") ?? "";
        command = command.toString().toLowerCase();

        // handle misc commands here before game commands
        if (command === "clear" || command === "cls") {
            setMessages([]);
            return;
        }

        // Create a message object for the player's command
        const playerMessage: Message = {
            id: messageIdCounter.current++,
            type: "player",
            payload: { text: `> ${command}` },
        };

        // Get the game's response
        const gameResponse = Game.getGameInstance().handleCommand(command);

        const gameMessage: Message = {
            id: messageIdCounter.current++,
            ...gameResponse,
        };

        // Update the state with both new messages
        setMessages((prevMessages) => [
            ...prevMessages,
            playerMessage,
            gameMessage,
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
