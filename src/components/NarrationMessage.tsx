import { useTypingEffect } from "../hooks/useTypingEffect";

type NarrationMessageProps = {
    text: string;
    type: "system" | "player" | "narration" | "error";
    typingSpeed?: number;
};

function NarrationMessage({ text, type, typingSpeed }: NarrationMessageProps) {
    // pass a flag to disable the effect for player messages.
    const displayedText = useTypingEffect({
        text,
        typingSpeed,
        isTypingDisabled: type === "player",
    });

    const messageClass = `message message--${type}`;

    return <p className={messageClass}>{displayedText}</p>;
}

export default NarrationMessage;
