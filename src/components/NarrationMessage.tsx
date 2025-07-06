import { useState, useEffect } from "react";

type NarrationMessageProps = {
    text: string;
    type: "system" | "player" | "narration" | "error";
    typingSpeed?: number;
};

const DEFAULT_SPEED = 15;

function NarrationMessage({
    text,
    type,
    typingSpeed = DEFAULT_SPEED,
}: NarrationMessageProps) {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        // For player messages, display the text immediately without any effect.
        if (type === "player") {
            setDisplayedText(text);
            return;
        }

        // For all other message types, start the typing effect.
        // We start with an empty string. The interval will fill it.
        setDisplayedText("");

        const intervalId = setInterval(() => {
            setDisplayedText((currentText) => {
                // If the full text is already displayed, we're done.
                if (currentText.length === text.length) {
                    clearInterval(intervalId); // Stop the interval
                    return currentText;
                }

                // The index of the *next* character is the length of the *current* text.
                const nextCharIndex = currentText.length;

                // Append the next character from the full text.
                return currentText + text.charAt(nextCharIndex);
            });
        }, typingSpeed);

        return () => clearInterval(intervalId);
    }, [text, type, typingSpeed]);

    const messageClass = `message message--${type}`;

    return <p className={messageClass}>{displayedText}</p>;
}

export default NarrationMessage;
