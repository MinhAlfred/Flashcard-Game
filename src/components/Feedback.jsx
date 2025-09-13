import React from 'react';

const Feedback = ({ message }) => {
  if (!message) return null;

  // Kiểm tra xem có phải feedback chi tiết không
  const isDetailedFeedback = message.includes('🔬') || message.includes('🧠');
  
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl">
      <div className={`glassmorphism px-6 py-4 rounded-xl text-white shadow-lg ${
        isDetailedFeedback ? 'text-left' : 'text-center rounded-full'
      }`}>
        {isDetailedFeedback ? (
          <div className="space-y-3">
            {message.split('\n\n').map((section, index) => {
              if (section.startsWith('🎉')) {
                return (
                  <div key={index} className="text-center font-bold text-lg text-green-300 mb-4">
                    {section}
                  </div>
                );
              }
              if (section.startsWith('🔬')) {
                return (
                  <div key={index} className="bg-blue-500/20 p-3 rounded-lg border-l-4 border-blue-400">
                    <div className="font-semibold text-blue-200 mb-1">Vật chất:</div>
                    <div className="text-sm">{section.replace('🔬 ', '')}</div>
                  </div>
                );
              }
              if (section.startsWith('🧠')) {
                return (
                  <div key={index} className="bg-purple-500/20 p-3 rounded-lg border-l-4 border-purple-400">
                    <div className="font-semibold text-purple-200 mb-1">Ý thức:</div>
                    <div className="text-sm">{section.replace('🧠 ', '')}</div>
                  </div>
                );
              }
              if (section.startsWith('⚡')) {
                return (
                  <div key={index} className="bg-yellow-500/20 p-3 rounded-lg border-l-4 border-yellow-400">
                    <div className="font-semibold text-yellow-200 mb-1">Tương tác:</div>
                    <div className="text-sm">{section.replace('⚡ Tương tác: ', '')}</div>
                  </div>
                );
              }
              return (
                <div key={index} className="text-sm">
                  {section}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="font-semibold">
            {message.split('\n').map((line, index) => (
              <div key={index} className={index > 0 ? 'mt-2 text-sm opacity-80' : ''}>
                {line}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;