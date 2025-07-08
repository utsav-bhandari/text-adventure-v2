import { useTypingEffect } from "../hooks/useTypingEffect";

type StatsTableProps = {
    name: string;
    hp: number;
    maxHp: number;
    str: number;
};

export default function StatsTable({ name, hp, maxHp, str }: StatsTableProps) {
    const displayedText = useTypingEffect({
        text: name + "'s Stats",
        typingSpeed: 50,
    });
    return (
        <div className="pixel-corners stats-table-container message">
            <h4 className="stats-header">{displayedText}</h4>
            {/* <h4 className="stats-header">{name}'s Stats</h4> */}
            <table className="stats-table">
                <tbody>
                    <tr>
                        <td>HP</td>
                        <td>
                            {hp} / {maxHp}
                        </td>
                    </tr>
                    <tr>
                        <td>Strength</td>
                        <td>{str}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
