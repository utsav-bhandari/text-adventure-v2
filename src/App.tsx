import { useState, useRef, type FormEvent } from "react";
import { Game, type GameResponse } from "./lib/Game";
import Console from "./components/Console";
import Map from "./components/Map";

export type Message = {
    id: number;
} & (
    | { type: "player"; payload: { text: string } }
    | { type: "system"; payload: { text: string } }
    | GameResponse
);

function App() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, type: "system", payload: { text: "Welcome" } },
    ]);

    const gameRef = useRef<Game | null>(null);

    const messageIdCounter = useRef(messages.length + 1);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const command = formData.get("command")?.toString();
        event.currentTarget.reset(); // clear the input field

        if (command) {
            // Instantiate Game on the first command
            if (!gameRef.current) {
                gameRef.current = new Game();
            }

            // Create a message object for the player's command
            const playerMessage: Message = {
                id: messageIdCounter.current++,
                type: "player",
                payload: { text: `> ${command}` },
            };

            // Get the game's response
            const gameResponse = gameRef.current.handleCommand(command);
            const gameMessage: Message = {
                id: messageIdCounter.current++,
                ...gameResponse,
            };

            // 3. Update the state with both new messages
            setMessages((prevMessages) => [
                ...prevMessages,
                playerMessage,
                gameMessage,
            ]);
        }
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
