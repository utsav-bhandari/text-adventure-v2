import { useRef, type FormEvent } from "react";
import { type Message } from "../App";
import NarrationMessage from "./NarrationMessage";
import StatsTable from "./StatsTable";

type ConsoleProps = {
    messages: Message[];
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

// This function will decide which component to render
function renderMessage(message: Message) {
    switch (message.type) {
        case "player":
        case "system":
        case "narration":
        case "error":
            // All these types are simple text, so they use NarrationMessage
            return (
                <NarrationMessage
                    text={message.payload.text}
                    type={message.type}
                />
            );

        case "stats":
            // The 'stats' type renders the StatsTable component
            return <StatsTable {...message.payload} />;

        default:
            // handle unknown types
            return (
                <p className="message message--error">Unknown message type</p>
            );
    }
}

function Console({ messages, handleSubmit }: ConsoleProps) {
    const promptRef = useRef<HTMLInputElement>(null);

    return (
        <div className="console" onClick={() => promptRef.current?.focus()}>
            <h1 style={{ color: "white" }}>Console</h1>
            <div className="console-output">
                <p className="message">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Dolores id quas suscipit obcaecati laudantium hic
                    repudiandae, quo beatae modi sapiente? Assumenda, dicta
                    minima fugit quia eaque ipsa mollitia. Sequi, autem. lorem
                </p>
                {messages.map((msg) => (
                    <div key={msg.id}>{renderMessage(msg)}</div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <span className="command-wrapper">
                    <input
                        ref={promptRef}
                        name="command"
                        type="text"
                        autoCorrect="off"
                        autoComplete="off"
                        autoFocus
                    />
                </span>
            </form>
        </div>
    );
}

export default Console;
