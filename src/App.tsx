import { useState } from 'react';
import { useChessGame, type GameMode } from './game/useChessGame';
import { ChessBoard } from './components/ChessBoard';
import { GameInfo } from './components/GameInfo';
import { GameModeSelection } from './components/GameModeSelection';

function App() {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const game = useChessGame(gameMode || 'vs-player'); // Default to vs-player but logic depends on mode

  const handleModeSelect = (mode: GameMode) => {
    setGameMode(mode);
    game.resetGame();
  };

  const handleBackToMenu = () => {
    setGameMode(null);
    game.resetGame();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4 gap-8">
      <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg font-serif">
        Chess Master
      </h1>

      {!gameMode ? (
        <GameModeSelection onSelectMode={handleModeSelect} />
      ) : (
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="relative">
            <ChessBoard game={game} />
            {game.isComputerThinking && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px] rounded-lg z-10">
                <div className="bg-white/90 text-gray-900 px-4 py-2 rounded-full font-semibold shadow-lg flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 w-full max-w-md">
            <GameInfo game={game} />

            <button
              onClick={handleBackToMenu}
              className="w-full py-2 text-gray-400 hover:text-white transition-colors text-sm underline underline-offset-4"
            >
              Back to Menu
            </button>

            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10 text-gray-300 text-sm">
              <p>Click a piece to select it, then click a valid square to move.</p>
              <p className="mt-2 text-xs opacity-70">Mode: {gameMode === 'vs-computer' ? 'Vs Computer' : 'Vs Friend'}</p>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 right-4 text-white/20 text-sm font-serif pointer-events-none select-none">
        Made by Harsh Pal
      </div>
    </div>
  );
}

export default App;
