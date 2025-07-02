import { useRef } from "react";

function Console() {
    const promptRef = useRef<HTMLInputElement>(null);

    return (
        <div className="console" onClick={() => promptRef.current?.focus()}>
            <h1>Console</h1>
            <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Dolores id quas suscipit obcaecati laudantium hic repudiandae,
                quo beatae modi sapiente? Assumenda, dicta minima fugit quia
                eaque ipsa mollitia. Sequi, autem.
            </p>
            <form onSubmit={(e) => e.preventDefault()}>
                <span className="command-wrapper">
                    <input
                        ref={promptRef}
                        name="command"
                        type="text"
                        autoCorrect="off"
                        autoComplete="off"
                    />
                </span>
            </form>
        </div>
    );
}

export default Console;
