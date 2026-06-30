import React from 'react';

const ChatbotButton = ({ onClick, isOpen }) => {
  return (
    <button
      className="chatbot-fab"
      onClick={onClick}
      title={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
      aria-label="Toggle AI Assistant"
    >
      {isOpen ? '✕' : '🤖'}
      {!isOpen && <span className="chatbot-fab-dot"></span>}
    </button>
  );
};

export default ChatbotButton;
