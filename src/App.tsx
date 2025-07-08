import { useState, useRef, useEffect } from "react";
import { Game, type GameResponse } from "./lib/core/Game";
import Console from "./components/Console";
import Map from "./components/Map";

// --- New constants for delay calculation ---
// Establishes a comfortable reading speed for the delay.
const MS_PER_WORD = 100;
// Ensures even short messages have a noticeable pause.
const MIN_MESSAGE_DELAY = 400;
// Prevents waiting too long after a very long message.
const MAX_MESSAGE_DELAY = 3500;

export type Message = {
    id: number;
} & GameResponse;

const game = new Game();

const getDelayForMessage = (message: Message | undefined): number => {
    // If there's no previous message, use the minimum delay.
    if (!message) {
        return MIN_MESSAGE_DELAY;
    }

    // within this block, we can safely access `message.payload.text`.
    if ("text" in message.payload) {
        const wordCount = message.payload.text.split(/\s+/).length;
        const calculatedDelay = wordCount * MS_PER_WORD;
        return Math.max(
            MIN_MESSAGE_DELAY,
            Math.min(calculatedDelay, MAX_MESSAGE_DELAY)
        );
    }

    // For any other message type (like 'stats'), return the minimum delay.
    return MIN_MESSAGE_DELAY;
};

function App() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, type: "system", payload: { text: "Welcome" } },
    ]);

    const [responseQueue, setResponseQueue] = useState<GameResponse[]>([]);
    // This helps know when to apply zero delay vs. a calculated delay.
    const [isNewResponse, setIsNewResponse] = useState(false);

    const messageIdCounter = useRef(messages.length + 1);

    // This useEffect is now responsible for all game response displays.
    useEffect(() => {
        if (responseQueue.length === 0) {
            return;
        }

        // Determine the delay. If it's a new response, delay is 0.
        // Otherwise, calculate it based on the last displayed message.
        const delay = isNewResponse
            ? 0
            : getDelayForMessage(messages[messages.length - 1]);

        const timerId = setTimeout(() => {
            const [nextResponse, ...remainingResponses] = responseQueue;
            const message: Message = {
                id: messageIdCounter.current++,
                ...nextResponse,
            };

            setMessages((prev) => [...prev, message]);
            setResponseQueue(remainingResponses);

            // After processing the first message, turn this flag off so subsequent
            // messages in the same batch get a calculated delay.
            if (isNewResponse) {
                setIsNewResponse(false);
            }
        }, delay);

        return () => clearTimeout(timerId);
    }, [responseQueue, isNewResponse, messages]);

    function handleSubmit(formData: FormData) {
        let command = formData.get("command") ?? "";
        command = command.toString().toLowerCase();

        if (command === "clear" || command === "cls") {
            setMessages([]);
            messageIdCounter.current = 0;
            return;
        }

        const playerMessage: Message = {
            id: messageIdCounter.current++,
            type: "player",
            payload: { text: `> ${command}` },
        };

        setMessages((prev) => [...prev, playerMessage]);

        const gameResponses = game.handleCommand(command);

        // Add the entire batch to the queue...
        setResponseQueue((prevQueue) => [...prevQueue, ...gameResponses]);
        // ...and signal that this is a new batch, which will trigger the
        // useEffect to process the first item with zero delay.
        setIsNewResponse(true);
    }

    return (
        <main>
            <Console messages={messages} handleSubmit={handleSubmit} />
            <Map />
        </main>
    );
}

export default App;
