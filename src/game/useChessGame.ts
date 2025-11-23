import { useState, useCallback, useEffect } from 'react';
import { Chess, type Move, type Square } from 'chess.js';
import { getBestMove } from './ai';

export type GameMode = 'vs-player' | 'vs-computer';

export interface TrackedPiece {
    id: string;
    type: string;
    color: string;
    square: Square;
}

const initializePieces = (game: Chess): TrackedPiece[] => {
    const pieces: TrackedPiece[] = [];
    const board = game.board();

    // Use counters to generate stable IDs
    const counts: Record<string, number> = {};

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece) {
                const key = `${piece.color}${piece.type}`;
                counts[key] = (counts[key] || 0) + 1;
                pieces.push({
                    id: `${key}-${counts[key]}`,
                    type: piece.type,
                    color: piece.color,
                    square: piece.square,
                });
            }
        }
    }
    return pieces;
};

export function useChessGame(gameMode: GameMode = 'vs-player') {
    const [game, setGame] = useState(new Chess());
    const [fen, setFen] = useState(game.fen());
    const [history, setHistory] = useState<string[]>([]);
    const [pieces, setPieces] = useState<TrackedPiece[]>(() => initializePieces(game));
    const [isComputerThinking, setIsComputerThinking] = useState(false);

    // Helper to update pieces based on a move
    const updatePieces = (move: Move) => {
        setPieces(prev => {
            const next = [...prev];
            const movedPieceIndex = next.findIndex(p => p.square === move.from);
            if (movedPieceIndex === -1) return prev; // Should not happen

            // Handle Capture
            if (move.captured) {
                if (move.flags.includes('e')) {
                    // En Passant: captured piece is not at 'to', but at 'to' file and 'from' rank
                    const captureSquare = `${move.to[0]}${move.from[1]}` as Square;
                    const capturedIndex = next.findIndex(p => p.square === captureSquare);
                    if (capturedIndex !== -1) next.splice(capturedIndex, 1);
                } else {
                    // Normal capture: captured piece is at 'to'
                    const capturedIndex = next.findIndex(p => p.square === move.to);
                    if (capturedIndex !== -1) next.splice(capturedIndex, 1);
                }
            }

            // Update moved piece position
            let newPieces = prev.filter(p => {
                if (move.flags.includes('e')) {
                    const captureSquare = `${move.to[0]}${move.from[1]}` as Square;
                    return p.square !== captureSquare;
                }
                if (move.captured) {
                    return p.square !== move.to;
                }
                return true;
            });

            // Find moving piece in new list
            const pIndex = newPieces.findIndex(p => p.square === move.from);
            if (pIndex !== -1) {
                newPieces[pIndex] = { ...newPieces[pIndex], square: move.to };

                // Promotion
                if (move.promotion) {
                    newPieces[pIndex].type = move.promotion;
                }
            }

            // Castling
            if (move.flags.includes('k') || move.flags.includes('q')) {
                const rank = move.color === 'w' ? '1' : '8';
                const rookFrom = move.flags.includes('k') ? `h${rank}` : `a${rank}`;
                const rookTo = move.flags.includes('k') ? `f${rank}` : `d${rank}`;

                const rIndex = newPieces.findIndex(p => p.square === rookFrom);
                if (rIndex !== -1) {
                    newPieces[rIndex] = { ...newPieces[rIndex], square: rookTo as Square };
                }
            }

            return newPieces;
        });
    };

    const makeMove = useCallback((from: string, to: string, promotion?: string) => {
        try {
            const moveResult = game.move({
                from,
                to,
                promotion: promotion || 'q',
            });

            if (moveResult) {
                updatePieces(moveResult);
                setFen(game.fen());
                setHistory(game.history());
                setGame(new Chess(game.fen()));
                if (navigator.vibrate) navigator.vibrate(50);
                return true;
            }
        } catch (e) {
            return false;
        }
        return false;
    }, [game]);

    const makeComputerMove = useCallback(async () => {
        if (game.isGameOver() || game.turn() === 'w') return;

        setIsComputerThinking(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        const bestMove = getBestMove(game);
        if (bestMove) {
            const moveResult = game.move(bestMove);
            if (moveResult) {
                updatePieces(moveResult);
                setFen(game.fen());
                setHistory(game.history());
                setGame(new Chess(game.fen()));
                if (navigator.vibrate) navigator.vibrate(50);
            }
        }
        setIsComputerThinking(false);
    }, [game]);

    useEffect(() => {
        if (gameMode === 'vs-computer' && game.turn() === 'b' && !game.isGameOver()) {
            makeComputerMove();
        }
    }, [game, gameMode, makeComputerMove]);

    const resetGame = useCallback(() => {
        const newGame = new Chess();
        setGame(newGame);
        setFen(newGame.fen());
        setHistory([]);
        setPieces(initializePieces(newGame));
        setIsComputerThinking(false);
    }, []);

    return {
        game,
        fen,
        history,
        pieces,
        turn: game.turn(),
        isCheck: game.isCheck(),
        isCheckmate: game.isCheckmate(),
        isDraw: game.isDraw(),
        isGameOver: game.isGameOver(),
        isComputerThinking,
        makeMove,
        resetGame,
    };
}
