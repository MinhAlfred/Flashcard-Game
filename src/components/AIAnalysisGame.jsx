import React, { useState } from 'react';
import { analyzeRelationship, getAvailableProviders, validateApiKey, AI_PROVIDERS } from '../services/aiAnalysisService';
import { historyService } from '../services/historyService';
import HistoryPanel from './HistoryPanel';
import { ArrowLeft, History, RotateCcw } from 'lucide-react';

const AIAnalysisGame = ({ onBack }) => {
  const [materialInput, setMaterialInput] = useState('');
  const [consciousnessInput, setConsciousnessInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');
  const selectedProvider = AI_PROVIDERS.GEMINI;
  const [validationErrors, setValidationErrors] = useState({});
  const [showHistory, setShowHistory] = useState(false);

  // Format text for better display
  const formatDisplayText = (text) => {
    if (!text) return '';
    
    return text
      // Split by bullet points and numbered lists
      .split(/(?=\*\s)|(?=\d+\.\s)/)
      .map(section => section.trim())
      .filter(section => section.length > 0)
      .map(section => {
        // Remove excessive ** formatting
        return section.replace(/\*\*([^*]+)\*\*/g, '$1')
                     .replace(/\*\s/g, '• ')
                     .trim();
      })
      .join('\n\n');
  };

  const validateInputs = () => {
    const errors = {};
    
    if (!materialInput.trim()) {
      errors.material = 'Vui lòng nhập vật chất';
    } else if (materialInput.trim().length < 2) {
      errors.material = 'Vật chất phải có ít nhất 2 ký tự';
    }
    
    if (!consciousnessInput.trim()) {
      errors.consciousness = 'Vui lòng nhập ý thức';
    } else if (consciousnessInput.trim().length < 2) {
      errors.consciousness = 'Ý thức phải có ít nhất 2 ký tự';
    }
    
    // API key is now configured in .env file
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAnalyze = async () => {
    setError('');
    setValidationErrors({});
    
    if (!validateInputs()) {
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeRelationship(
        materialInput.trim(),
        consciousnessInput.trim()
      );
      
      setAnalysisResult(result);
      
      // Lưu vào lịch sử
      try {
        historyService.addAnalysis(materialInput.trim(), consciousnessInput.trim(), result, 'gemini');
      } catch (historyError) {
        console.warn('Could not save to history:', historyError);
      }
    } catch (err) {
      setError(
        err.message.includes('API key') 
          ? 'API key không hợp lệ. Vui lòng kiểm tra lại!'
          : err.message.includes('quota')
          ? 'Đã vượt quá giới hạn API. Vui lòng thử lại sau!'
          : err.message || 'Có lỗi xảy ra khi phân tích. Vui lòng thử lại!'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setMaterialInput('');
    setConsciousnessInput('');
    setAnalysisResult(null);
    setError('');
  };

  // API key is now configured in .env file, no toggle needed

  const handleSelectFromHistory = (analysis) => {
    setMaterialInput(analysis.material);
    setConsciousnessInput(analysis.consciousness);
    setAnalysisResult(analysis.result);
    // selectedProvider is constant (GEMINI), no need to set
    setShowHistory(false);
  };

  const handleNewAnalysis = () => {
    setMaterialInput('');
    setConsciousnessInput('');
    setAnalysisResult(null);
    setError('');
    setValidationErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="absolute top-6 left-6 glassmorphism px-4 py-2 rounded-lg text-white hover:bg-white/20 transition-all duration-300 btn-hover flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Quay lại
          </button>
          
          <h1 className="text-4xl font-bold text-white mb-4 card-bounce">
            🤖 AI Analysis Game
          </h1>
          <p className="text-xl text-white/80 card-fade-in">
            Khám phá mối quan hệ giữa vật chất và ý thức với sức mạnh AI
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setShowHistory(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <History size={18} />
            Lịch sử phân tích
          </button>
          
          {analysisResult && (
            <button
              onClick={handleNewAnalysis}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <RotateCcw size={18} />
              Phân tích mới
            </button>
          )}
        </div>

        {/* API Configuration */}
        <div className="glassmorphism rounded-2xl p-6 mb-6 card-fade-in">
          {/* AI Configuration Info */}
          <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-green-300 mb-2">
              <span>🤖</span>
              <span className="font-medium">Sử dụng Google Gemini 2.0 Flash AI</span>
            </div>
            <p className="text-green-200/80 text-sm">
             Đây là trò chơi đơn giản sử dụng AI để phân tích mối quan hệ giữa vật chất và ý thức.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="glassmorphism rounded-2xl p-8 card-slide-in">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Material Input */}
            <div className="space-y-4">
              <label className="block text-white font-semibold text-lg">
                🔬 Vật chất
              </label>
              <textarea
                value={materialInput}
                onChange={(e) => {
                  setMaterialInput(e.target.value);
                  if (validationErrors.material) {
                    setValidationErrors(prev => ({ ...prev, material: '' }));
                  }
                }}
                placeholder="Ví dụ: Một viên đá rơi xuống đất, nước sôi ở 100°C, ánh sáng mặt trời..."
                className={`w-full h-32 p-4 rounded-xl bg-white/10 border text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                  validationErrors.material 
                    ? 'border-red-500/50 focus:ring-red-400' 
                    : 'border-white/20 focus:ring-blue-400'
                }`}
                disabled={isAnalyzing}
              />
              {validationErrors.material && (
                <p className="text-red-400 text-sm mt-1">{validationErrors.material}</p>
              )}
            </div>

            {/* Consciousness Input */}
            <div className="space-y-4">
              <label className="block text-white font-semibold text-lg">
                🧠 Ý thức
              </label>
              <textarea
                value={consciousnessInput}
                onChange={(e) => {
                  setConsciousnessInput(e.target.value);
                  if (validationErrors.consciousness) {
                    setValidationErrors(prev => ({ ...prev, consciousness: '' }));
                  }
                }}
                placeholder="Ví dụ: Cảm giác sợ hãi, hiểu biết về nhiệt độ, cảm nhận ánh sáng ấm áp..."
                className={`w-full h-32 p-4 rounded-xl bg-white/10 border text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                  validationErrors.consciousness 
                    ? 'border-red-500/50 focus:ring-red-400' 
                    : 'border-white/20 focus:ring-purple-400'
                }`}
                disabled={isAnalyzing}
              />
              {validationErrors.consciousness && (
                <p className="text-red-400 text-sm mt-1">{validationErrors.consciousness}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !materialInput.trim() || !consciousnessInput.trim()}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 btn-hover glow relative overflow-hidden"
            >
              {isAnalyzing && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-purple-700/50 animate-pulse"></div>
              )}
              <div className="relative z-10">
                {isAnalyzing ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span className="animate-pulse">Đang phân tích với AI...</span>
                  </div>
                ) : (
                  '🔍 Phân tích mối quan hệ'
                )}
              </div>
            </button>

            <button
              onClick={handleReset}
              disabled={isAnalyzing}
              className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 btn-hover"
            >
              🔄 Làm mới
            </button>
          </div>
          
          {isAnalyzing && (
            <div className="text-center mb-6 text-white/70 text-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <p>AI đang suy nghĩ về mối quan hệ giữa vật chất và ý thức...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-400 rounded-xl text-red-200 text-center card-fade-in">
              ⚠️ {error}
            </div>
          )}

          {/* Analysis Result */}
          {analysisResult && (
            <div className="bg-white/10 rounded-xl p-6 card-fade-in">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">
                📊 Kết quả phân tích
              </h3>
              
              <div className="space-y-4">
                <div className="bg-green-500/20 p-4 rounded-lg border-l-4 border-green-400">
                  <div className="font-semibold text-green-200 mb-2">🔗 Mối quan hệ:</div>
                  <div className="text-white">{analysisResult.relationship}</div>
                </div>
                
                <div className="bg-blue-500/20 p-4 rounded-lg border-l-4 border-blue-400">
                  <div className="font-semibold text-blue-200 mb-2">📝 Giải thích chi tiết:</div>
                  <div className="text-white whitespace-pre-line leading-relaxed">
                    {formatDisplayText(analysisResult.explanation)}
                  </div>
                </div>
                
                {analysisResult.mechanism && (
                  <div className="bg-purple-500/20 p-4 rounded-lg border-l-4 border-purple-400">
                    <div className="font-semibold text-purple-200 mb-2">⚗️ Cơ chế khoa học:</div>
                    <div className="text-white whitespace-pre-line leading-relaxed">
                      {formatDisplayText(analysisResult.mechanism)}
                    </div>
                  </div>
                )}
                
                {analysisResult.philosophy && (
                  <div className="bg-indigo-500/20 p-4 rounded-lg border-l-4 border-indigo-400">
                    <div className="font-semibold text-indigo-200 mb-2">🎭 Ý nghĩa triết học:</div>
                    <div className="text-white whitespace-pre-line leading-relaxed">
                      {formatDisplayText(analysisResult.philosophy)}
                    </div>
                  </div>
                )}
                
                <div className="bg-yellow-500/20 p-4 rounded-lg border-l-4 border-yellow-400">
                  <div className="font-semibold text-yellow-200 mb-2">📊 Độ tin cậy:</div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-white/20 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-green-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${analysisResult.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-semibold">{analysisResult.confidence}%</span>
                  </div>
                </div>
                
                <div className="bg-gray-500/20 p-3 rounded-lg border-l-4 border-gray-400">
                  <div className="text-gray-200 text-sm">
                    Phân tích bởi: Google Gemini 2.0 Flash
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* History Panel */}
        {showHistory && (
          <HistoryPanel
            onClose={() => setShowHistory(false)}
            onSelectAnalysis={handleSelectFromHistory}
          />
        )}
      </div>
    </div>
  );
};

export default AIAnalysisGame;