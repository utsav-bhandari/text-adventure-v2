import { useRef, type FormEvent } from "react";
import { type Message } from "../App";
import NarrationMessage from "./NarrationMessage";
import StatsTable from "./StatsTable";

const NUM_DEFAULT_MESSAGES = 1;

type ConsoleProps = {
    messages: Message[];
    handleSubmit: (formData: FormData) => void;
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
                {messages.map((msg) => (
                    <div key={msg.id}>{renderMessage(msg)}</div>
                ))}
            </div>
            <form action={handleSubmit}>
                <span className="command-wrapper">
                    <input
                        ref={promptRef}
                        name="command"
                        type="text"
                        autoComplete="off"
                        spellCheck="false"
                        placeholder={
                            messages.length === NUM_DEFAULT_MESSAGES
                                ? "type a command or help for list of commands"
                                : ""
                        }
                        autoFocus
                    />
                </span>
            </form>
        </div>
    );
}

export default Console;
