import React from 'react';
import { useChessGame } from '../game/useChessGame';

interface GameInfoProps {
    game: ReturnType<typeof useChessGame>;
}

export const GameInfo: React.FC<GameInfoProps> = ({ game }) => {
    const { turn, isCheck, isCheckmate, isDraw, isGameOver, resetGame } = game;

    let status = '';
    if (isCheckmate) {
        status = `Checkmate! ${turn === 'w' ? 'Black' : 'White'} wins!`;
    } else if (isDraw) {
        status = 'Draw!';
    } else if (isCheck) {
        status = `${turn === 'w' ? 'White' : 'Black'} is in Check!`;
    } else {
        status = `${turn === 'w' ? 'White' : 'Black'}'s Turn`;
    }

    return (
        <div className="flex flex-col items-center gap-4 p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 text-white w-full max-w-md">
            <h2 className="text-2xl font-bold tracking-wider">{status}</h2>

            <div className="flex gap-4">
                <button
                    onClick={resetGame}
                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors shadow-md"
                >
                    New Game
                </button>
            </div>
        </div>
    );
};
