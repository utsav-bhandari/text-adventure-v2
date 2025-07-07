import { useState, useEffect } from "react";

type UseTypingEffectProps = {
    text: string;
    typingSpeed?: number;
    isTypingDisabled?: boolean;
};

const DEFAULT_TYPING_SPEED = 10;

function useTypingEffect({
    text,
    typingSpeed = DEFAULT_TYPING_SPEED,
    isTypingDisabled = false,
}: UseTypingEffectProps): string {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        if (isTypingDisabled) {
            setDisplayedText(text);
            return;
        }

        // Reset the text to start the effect from scratch
        setDisplayedText("");

        const intervalId = setInterval(() => {
            setDisplayedText((currentText) => {
                // When the full text is displayed, clear the interval
                if (currentText.length === text.length) {
                    clearInterval(intervalId);
                    return currentText;
                }
                // Append the next character
                return currentText + text.charAt(currentText.length);
            });
        }, typingSpeed);

        return () => clearInterval(intervalId);
    }, [text, typingSpeed, isTypingDisabled]);

    return displayedText;
}

export { useTypingEffect };
