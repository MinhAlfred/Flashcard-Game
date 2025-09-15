import React, { useState } from 'react';
import { RotateCcw, Brain, Gamepad2 } from 'lucide-react';

// Components
import GameHeader from './components/GameHeader';
import WelcomeScreen from './components/WelcomeScreen';
import MaterialCard from './components/MaterialCard';
import ConsciousCardList from './components/ConsciousCardList';
import GameComplete from './components/GameComplete';
import Feedback from './components/Feedback';
import AIAnalysisGame from './components/AIAnalysisGame';

// Hooks
import { useGameLogic } from './hooks/useGameLogic';

const App = () => {
  const [currentView, setCurrentView] = useState('flashcard'); // 'flashcard' or 'ai-analysis'
  
  const {
    // State
    currentMaterialCard,
    availableConsciousCards,
    score,
    matches,
    gameStatus,
    selectedConsciousCard,
    feedback,
    
    // Actions
    drawMaterialCard,
    selectConsciousCard,
    checkMatch,
    resetGame,
    
    // Constants
    totalCards,
    GAME_STATUS
  } = useGameLogic();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="flex justify-center mb-6">
          <div className="glassmorphism rounded-full p-1 flex gap-1">
            <button
              onClick={() => setCurrentView('flashcard')}
              className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                currentView === 'flashcard'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Gamepad2 size={20} />
              Flashcard Game
            </button>
            <button
              onClick={() => setCurrentView('ai-analysis')}
              className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                currentView === 'ai-analysis'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Brain size={20} />
              AI Analysis
            </button>
          </div>
        </div>

        {/* Content based on current view */}
        {currentView === 'flashcard' ? (
          <>
            {/* Header */}
            <GameHeader 
              score={score} 
              matches={matches} 
              totalCards={totalCards} 
            />

            {/* Game States */}
            {gameStatus === GAME_STATUS.WAITING && (
              <WelcomeScreen onStartGame={drawMaterialCard} />
            )}

            {gameStatus === GAME_STATUS.PLAYING && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <MaterialCard 
                  currentCard={currentMaterialCard}
                  selectedConsciousCard={selectedConsciousCard}
                  onDrawCard={drawMaterialCard}
                  onCheckMatch={checkMatch}
                />
                
                <ConsciousCardList 
                  cards={availableConsciousCards}
                  selectedCard={selectedConsciousCard}
                  onSelectCard={selectConsciousCard}
                />
              </div>
            )}

            {gameStatus === GAME_STATUS.FINISHED && (
              <GameComplete 
                score={score} 
                onResetGame={resetGame} 
              />
            )}

            {/* Feedback Component */}
            <Feedback message={feedback} />

            {/* Reset button */}
            {gameStatus !== GAME_STATUS.WAITING && (
              <div className="fixed top-8 right-8">
                <button
                  onClick={resetGame}
                  className="glassmorphism p-3 rounded-full text-white hover:bg-white/20 transition-all duration-300"
                  title="Reset Game"
                >
                  <RotateCcw size={24} />
                </button>
              </div>
            )}
          </>
        ) : (
          <AIAnalysisGame onBack={() => setCurrentView('flashcard')} />
        )}
      </div>
    </div>
  );
};

export default App;
