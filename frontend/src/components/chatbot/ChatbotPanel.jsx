import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { sendChatMessage } from '../../services/api';

const SUGGESTIONS = [
  "What affects HDI the most?",
  "Predict for a developing country",
  "Explain the HDI formula",
];

const ChatbotPanel = ({ onClose, credits, onCreditsUpdate, onPredictFromChat, onOpenPricing }) => {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: "Hi! I'm the HDI Assistant 🌍 Ask me anything about human development, or tell me a country to predict its HDI score.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const messagesEndRef = useRef(null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 250);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    const messageText = text || input.trim();
    if (!messageText || isTyping) return;

    // Add user message
    const userMsg = { role: 'user', content: messageText };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({
          role: m.role === 'bot' ? 'model' : 'user',
          content: m.content,
        }));

      const data = await sendChatMessage(messageText, conversationHistory);

      // Add bot reply
      // Strip JSON code blocks from displayed text for cleaner UX
      let displayReply = data.reply;
      displayReply = displayReply.replace(/```json[\s\S]*?```/g, '').trim();
      if (!displayReply) displayReply = "I've extracted the prediction data for you!";

      setMessages((prev) => [...prev, { role: 'bot', content: displayReply }]);

      // Update credits
      if (data.creditsRemaining !== undefined) {
        onCreditsUpdate(data.creditsRemaining);
      }

      // If the AI extracted predict data, trigger a prediction
      if (data.predictData && data.predictData.lifeExpectancy) {
        onPredictFromChat(data.predictData);
      }
    } catch (error) {
      if (error.message === 'OUT_OF_CREDITS') {
        setMessages((prev) => [
          ...prev,
          {
            role: 'bot',
            content: "You've run out of credits! 💎 Purchase more to continue chatting with the AI assistant.",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'bot', content: `Sorry, something went wrong: ${error.message}` },
        ]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const showSuggestions = messages.length <= 1 && !isTyping;

  return (
    <div className={`chatbot-panel ${isClosing ? 'animate-slide-down' : 'animate-slide-up'}`}>
      {/* Header */}
      <div className="chatbot-header">
        <div className="chatbot-avatar">🤖</div>
        <div className="chatbot-header-info">
          <div className="chatbot-header-name">HDI Assistant</div>
          <div className="chatbot-header-status">
            <span>●</span> Online
          </div>
        </div>
        <span className="chatbot-header-cost">2 credits/msg</span>
        <button className="chatbot-close" onClick={handleClose}>✕</button>
      </div>

      {/* Messages */}
      <div className="chatbot-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-msg ${msg.role === 'user' ? 'chat-msg-user' : 'chat-msg-bot'}`}>
            {msg.role === 'bot' ? (
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            ) : (
              msg.content
            )}
          </div>
        ))}
        {isTyping && (
          <div className="chat-msg chat-msg-bot" style={{ opacity: 0.7 }}>
            <span className="spinner-container">
              <span className="spinner" style={{ width: 12, height: 12 }}></span> Thinking...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestions */}
      {showSuggestions && (
        <div className="chatbot-suggestions">
          {SUGGESTIONS.map((s, i) => (
            <button key={i} className="suggestion-chip" onClick={() => handleSend(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="chatbot-input-bar">
        <input
          type="text"
          className="chatbot-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about HDI..."
          disabled={isTyping}
        />
        <button
          className="chatbot-send-btn"
          onClick={() => handleSend()}
          disabled={isTyping || !input.trim()}
        >
          ➤
        </button>
      </div>

      {/* Footer */}
      <div className="chatbot-footer">
        <span>💎 {credits ?? '—'} credits remaining</span>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent-blue)',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            fontWeight: 700,
          }}
          onClick={onOpenPricing}
        >
          Get Credits
        </button>
      </div>
    </div>
  );
};

export default ChatbotPanel;
