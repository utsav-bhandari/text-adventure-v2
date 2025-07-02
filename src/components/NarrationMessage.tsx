type NarrationMessageProps = {
    text: string;
    type: "narration" | "error" | "player" | "system";
};

export default function NarrationMessage({
    text,
    type,
}: NarrationMessageProps) {
    return <p className={`message message--${type}`}>{text}</p>;
}
