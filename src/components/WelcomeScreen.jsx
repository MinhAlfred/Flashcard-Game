import React from 'react';
import { Shuffle } from 'lucide-react';

const WelcomeScreen = ({ onStartGame }) => {
  return (
    <div className="text-center">
      <div className="glassmorphism p-8 rounded-2xl max-w-md mx-auto mb-8 card-bounce">
        <div className="text-6xl mb-4 float">🎮</div>
        <h2 className="text-2xl font-bold text-white mb-4 card-fade-in">Sẵn sàng chơi?</h2>
        <p className="text-purple-200 mb-6 card-slide-in">
          Bốc thẻ Vật chất và tìm thẻ Ý thức phù hợp để ghép cặp!
        </p>
        <button
          onClick={onStartGame}
          className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full font-semibold shadow-lg btn-hover glow"
        >
          <Shuffle className="inline mr-2" size={20} />
          Bốc thẻ đầu tiên
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;