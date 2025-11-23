import React from 'react';
import type { GameMode } from '../game/useChessGame';
import { Users, Cpu } from 'lucide-react';

interface GameModeSelectionProps {
    onSelectMode: (mode: GameMode) => void;
}

export const GameModeSelection: React.FC<GameModeSelectionProps> = ({ onSelectMode }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-8 animate-in fade-in zoom-in duration-500">
            <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-md">Choose Game Mode</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                <button
                    onClick={() => onSelectMode('vs-computer')}
                    className="group relative flex flex-col items-center gap-4 p-8 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/10 transition-all hover:scale-105 hover:shadow-2xl"
                >
                    <div className="p-4 bg-blue-500/20 rounded-full group-hover:bg-blue-500/30 transition-colors">
                        <Cpu className="w-12 h-12 text-blue-300" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-white mb-2">Play vs Computer</h3>
                        <p className="text-gray-300 text-sm">Challenge the AI engine</p>
                    </div>
                </button>

                <button
                    onClick={() => onSelectMode('vs-player')}
                    className="group relative flex flex-col items-center gap-4 p-8 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/10 transition-all hover:scale-105 hover:shadow-2xl"
                >
                    <div className="p-4 bg-green-500/20 rounded-full group-hover:bg-green-500/30 transition-colors">
                        <Users className="w-12 h-12 text-green-300" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-white mb-2">Play vs Friend</h3>
                        <p className="text-gray-300 text-sm">Local multiplayer</p>
                    </div>
                </button>
            </div>
        </div>
    );
};
