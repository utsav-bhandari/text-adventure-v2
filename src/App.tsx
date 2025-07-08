import { useState, useRef, useEffect } from "react";
import { Game, type GameResponse } from "./lib/core/Game";
import Console from "./components/Console";
import Map from "./components/Map";

const MESSAGE_DELAY = 350;

export type Message = {
    id: number;
} & GameResponse;

const game = new Game();

function App() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, type: "system", payload: { text: "Welcome" } },
    ]);
    const [responseQueue, setResponseQueue] = useState<GameResponse[]>([]);
    const messageIdCounter = useRef(messages.length + 1);

    useEffect(() => {
        if (responseQueue.length === 0) {
            return;
        }

        const timerId = setTimeout(() => {
            const [nextResponse, ...remainingResponses] = responseQueue;

            const message: Message = {
                id: messageIdCounter.current++,
                ...nextResponse,
            };

            setMessages((prevMessages) => [...prevMessages, message]);
            setResponseQueue(remainingResponses);
        }, MESSAGE_DELAY);

        return () => clearTimeout(timerId);
    }, [responseQueue]);

    function handleSubmit(formData: FormData) {
        let command = formData.get("command") ?? "";
        command = command.toString().toLowerCase();

        if (command === "clear" || command === "cls") {
            setMessages([]);
            return;
        }

        const playerMessage: Message = {
            id: messageIdCounter.current++,
            type: "player",
            payload: { text: `> ${command}` },
        };

        setMessages((prevMessages) => [...prevMessages, playerMessage]);

        const gameResponse = game.handleCommand(command);
        const responseArray = [gameResponse].flat();

        // Separate the first response from the rest of the batch.
        const [firstResponse, ...remainingResponses] = responseArray;

        // Process and display the first response IMMEDIATELY.
        const firstMessage: Message = {
            id: messageIdCounter.current++,
            ...firstResponse,
        };
        setMessages((prevMessages) => [...prevMessages, firstMessage]);

        // If there are any remaining responses, add them to the queue for delayed display.
        if (remainingResponses.length > 0) {
            setResponseQueue((prevQueue) => [
                ...prevQueue,
                ...remainingResponses,
            ]);
        }
    }

    return (
        <main>
            <Console messages={messages} handleSubmit={handleSubmit} />
            <Map />
        </main>
    );
}

export default App;
