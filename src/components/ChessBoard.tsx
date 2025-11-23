import React, { useState } from 'react';
import { Square } from './Square';
import { useChessGame } from '../game/useChessGame';
import type { Square as SquareType } from 'chess.js';
import { Piece } from './Piece';
import { motion, AnimatePresence } from 'framer-motion';

interface ChessBoardProps {
    game: ReturnType<typeof useChessGame>;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({ game }) => {
    const [selectedSquare, setSelectedSquare] = useState<SquareType | null>(null);
    const [possibleMoves, setPossibleMoves] = useState<string[]>([]);

    const { game: chess, makeMove, turn, pieces } = game;

    // Generate board squares
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    const handleSquareClick = (square: SquareType) => {
        // If a square is already selected
        if (selectedSquare) {
            // Try to move
            const moveSuccess = makeMove(selectedSquare, square);

            if (moveSuccess) {
                setSelectedSquare(null);
                setPossibleMoves([]);
                return;
            }

            // If move failed, check if we clicked on our own piece to change selection
            const piece = chess.get(square);
            if (piece && piece.color === turn) {
                setSelectedSquare(square);
                const moves = chess.moves({ square, verbose: true }).map(m => m.to);
                setPossibleMoves(moves);
            } else {
                // Deselect if clicking empty or enemy piece (invalid move)
                setSelectedSquare(null);
                setPossibleMoves([]);
            }
        } else {
            // Select a piece
            const piece = chess.get(square);
            if (piece && piece.color === turn) {
                setSelectedSquare(square);
                const moves = chess.moves({ square, verbose: true }).map(m => m.to);
                setPossibleMoves(moves);
            }
        }
    };

    const getSquareCoordinates = (square: string) => {
        const fileIndex = files.indexOf(square[0]);
        const rankIndex = ranks.indexOf(square[1]);
        return { x: fileIndex * 100 + '%', y: rankIndex * 100 + '%' };
    };

    const boardSquares = [];
    for (let r = 0; r < 8; r++) {
        for (let f = 0; f < 8; f++) {
            const square = `${files[f]}${ranks[r]}` as SquareType;
            const isLight = (r + f) % 2 === 0;
            const isSelected = selectedSquare === square;
            const isValidMove = possibleMoves.includes(square);

            // Check if it's the last move (from or to)
            const lastMove = game.history.length > 0 ? chess.history({ verbose: true }).pop() : null;
            const isLastMove = lastMove ? (lastMove.from === square || lastMove.to === square) : false;

            boardSquares.push(
                <div key={square} className="w-full h-full" data-square={square}>
                    <Square
                        square={square}
                        isLight={isLight}
                        piece={null} // Pieces are rendered separately
                        isSelected={isSelected}
                        isLastMove={isLastMove}
                        isValidMove={isValidMove}
                        onClick={() => handleSquareClick(square)}
                    />
                </div>
            );
        }
    }

    return (
        <div className="relative w-96 h-96 sm:w-[32rem] sm:h-[32rem] md:w-[40rem] md:h-[40rem] border-8 border-[#5c4033] rounded-lg shadow-2xl bg-[#5c4033]">
            {/* Grid of Squares */}
            <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
                {boardSquares}
            </div>

            {/* Pieces Layer */}
            <div className="absolute inset-0 pointer-events-none">
                <AnimatePresence>
                    {pieces.map((p) => {
                        const { x, y } = getSquareCoordinates(p.square);
                        return (
                            <motion.div
                                key={p.id}
                                layoutId={p.id}
                                initial={false}
                                animate={{ x, y }}
                                className="absolute w-[12.5%] h-[12.5%]"
                                style={{ x, y }} // Use style for initial position to prevent flash? No, animate handles it.
                                // Actually, if we use percentage in animate, we need to be careful.
                                // Framer motion 'x' and 'y' usually translate.
                                // If we position absolute at top:0 left:0, and translate.
                                // x: '100%' works? Yes.
                                transition={{ type: 'spring', stiffness: 250, damping: 25 }}
                            >
                                <div className="w-full h-full p-1">
                                    <Piece type={p.type} color={p.color} />
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};
