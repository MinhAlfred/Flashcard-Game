import React from 'react';
import { Shuffle, Heart } from 'lucide-react';

const MaterialCard = ({ currentCard, selectedConsciousCard, onDrawCard, onCheckMatch }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white text-center mb-4 card-slide-in">
        🌍 Thẻ Vật chất
      </h2>
      {currentCard && (
        <div className="glassmorphism p-8 rounded-2xl text-center card-flip">
          <div className="text-6xl mb-4 float">🧱</div>
          <h3 className="text-xl font-bold text-white mb-4 card-fade-in">
            {currentCard.content}
          </h3>
          <p className="text-purple-200 card-slide-in">
            Hãy chọn thẻ Ý thức phù hợp bên phải
          </p>
        </div>
      )}
      
      <div className="text-center space-y-4">
        <button
          onClick={onDrawCard}
          className="px-6 py-3 bg-blue-500/80 hover:bg-blue-600/80 text-white rounded-full backdrop-blur-sm btn-hover"
        >
          <Shuffle className="inline mr-2" size={16} />
          Bốc thẻ khác
        </button>
        
        {selectedConsciousCard && (
          <button
            onClick={onCheckMatch}
            className="block mx-auto px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full font-semibold shadow-lg btn-hover card-pulse"
          >
            <Heart className="inline mr-2" size={20} />
            Ghép cặp
          </button>
        )}
      </div>
    </div>
  );
};

export default MaterialCard;