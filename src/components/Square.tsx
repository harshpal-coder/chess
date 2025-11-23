import React from 'react';
import { Piece } from './Piece';
import clsx from 'clsx';

interface SquareProps {
    square: string; // e.g., 'a1'
    isLight: boolean;
    piece?: { type: 'p' | 'n' | 'b' | 'r' | 'q' | 'k'; color: 'w' | 'b' } | null;
    isSelected?: boolean;
    isLastMove?: boolean;
    isValidMove?: boolean;
    onClick: () => void;
}

export const Square: React.FC<SquareProps> = ({
    isLight,
    piece,
    isSelected,
    isLastMove,
    isValidMove,
    onClick,
}) => {
    return (
        <div
            onClick={onClick}
            className={clsx(
                'w-full h-full flex items-center justify-center cursor-pointer transition-colors duration-150',
                isLight ? 'bg-[#EBECD0]' : 'bg-[#779556]', // Classic chess colors
                isSelected && 'bg-yellow-200 ring-inset ring-4 ring-yellow-400',
                isLastMove && 'bg-yellow-100/50', // Highlight last move
                isValidMove && !piece && 'after:content-[""] after:w-3 after:h-3 after:bg-black/20 after:rounded-full', // Dot for valid move on empty square
                isValidMove && piece && 'ring-inset ring-4 ring-black/10' // Ring for valid capture
            )}
        >
            {piece && <Piece type={piece.type} color={piece.color} />}
        </div>
    );
};
