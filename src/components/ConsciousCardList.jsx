import React from 'react';

const ConsciousCardList = ({ cards, selectedCard, onSelectCard }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white text-center mb-4 card-slide-in">
        🧠 Thẻ Ý thức
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {cards.map((card, index) => (
          <div
            key={card.id}
            data-card-id={card.id}
            onClick={() => onSelectCard(card)}
            className={`glassmorphism p-4 rounded-xl cursor-pointer stagger-item btn-hover ${
              selectedCard?.id === card.id
                ? 'ring-4 ring-yellow-400 bg-yellow-400/20'
                : 'hover:bg-white/10'
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="text-3xl mb-2 text-center float">💭</div>
            <p className="text-white text-sm text-center font-medium">
              {card.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsciousCardList;