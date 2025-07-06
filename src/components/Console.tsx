import { useRef, useLayoutEffect } from "react";
import { type Message } from "../App";
import NarrationMessage from "./NarrationMessage";
import StatsTable from "./StatsTable";

type ConsoleProps = {
    messages: Message[];
    handleSubmit: (formData: FormData) => void;
};

// How fast the text should appear (in milliseconds per character)
const TYPING_SPEED = 10;

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
                    typingSpeed={TYPING_SPEED} // Control speed from here
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
    const outputContainerRef = useRef<HTMLDivElement>(null); // Ref for the message list
    const scrollHelperRef = useRef<HTMLDivElement>(null); // Ref for the element to scroll to

    // This effect ensures we always scroll to the bottom as content is added/typed.
    useLayoutEffect(() => {
        const outputContainer = outputContainerRef.current;
        const scrollHelper = scrollHelperRef.current;

        if (!outputContainer || !scrollHelper) return;

        const scrollToBottom = () => {
            scrollHelper.scrollIntoView({ behavior: "smooth", block: "end" });
        };

        // Scroll immediately
        scrollToBottom();

        // scroll whenever the container's size changes
        const resizeObserver = new ResizeObserver(scrollToBottom);
        resizeObserver.observe(outputContainer);

        // Cleanup: disconnect the observer when the component unmounts or dependencies change
        return () => resizeObserver.disconnect();
    }, [messages]);

    return (
        <div className="console" onClick={() => promptRef.current?.focus()}>
            <h1 style={{ color: "white" }}>Console</h1>
            {/* Attach ref to the actual list of messages */}
            <div className="console-output" ref={outputContainerRef}>
                {messages.map((msg) => (
                    <div key={msg.id}>{renderMessage(msg)}</div>
                ))}
            </div>
            <form action={(formData) => handleSubmit(formData)}>
                <span className="command-wrapper">
                    <input
                        ref={promptRef}
                        name="command"
                        type="text"
                        autoComplete="off"
                        spellCheck="false"
                        placeholder={
                            messages.length <= 1
                                ? "type a command or 'help' for a list of commands"
                                : ""
                        }
                        autoFocus
                    />
                </span>
            </form>
            {/* This empty div is the target to scroll to */}
            <div ref={scrollHelperRef}></div>
        </div>
    );
}

export default Console;
