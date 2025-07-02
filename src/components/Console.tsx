import { useRef, useEffect } from "react";
import { type Message } from "../App";
import NarrationMessage from "./NarrationMessage";
import StatsTable from "./StatsTable";

const NUM_START_MESSAGES = 1;

// The props and renderMessage function are unchanged
type ConsoleProps = {
    messages: Message[];
    handleSubmit: (formData: FormData) => void;
};

function renderMessage(message: Message) {
    switch (message.type) {
        case "player":
        case "system":
        case "narration":
        case "error":
            return (
                <NarrationMessage
                    text={message.payload.text}
                    type={message.type}
                />
            );
        case "stats":
            return <StatsTable {...message.payload} />;
        default:
            return (
                <p className="message message--error">Unknown message type</p>
            );
    }
}

function Console({ messages, handleSubmit }: ConsoleProps) {
    const promptRef = useRef<HTMLInputElement>(null);
    // 1. Create a ref for the scrollable output container
    const outputContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = outputContainerRef.current;
        if (container) {
            container.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }
    }, [messages]);

    return (
        <div className="console" onClick={() => promptRef.current?.focus()}>
            <h1 style={{ color: "white" }}>Console</h1>
            {/* Attach the ref to the div we want to scroll */}
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
                            messages.length === NUM_START_MESSAGES
                                ? "type a command or help for list of commands"
                                : ""
                        }
                        autoFocus
                    />
                </span>
            </form>
            <div ref={outputContainerRef}></div>
        </div>
    );
}

export default Console;
