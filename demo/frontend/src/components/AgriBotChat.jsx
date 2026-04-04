import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, ChevronDown } from 'lucide-react';

export function AgriBotChat() {
  const createWelcomeMessage = () => ({
    id: Date.now(),
    text: "Hello! I'm the SML Agri Bot. I can help with product recommendations and export documentation. How can I assist you?",
    sender: 'bot',
    timestamp: new Date(),
  });

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => [createWelcomeMessage()]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const responseTimeoutRef = useRef(null);

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  useEffect(() => {
    return () => {
      if (responseTimeoutRef.current) {
        clearTimeout(responseTimeoutRef.current);
      }
    };
  }, []);

  const minimizeChat = () => {
    setIsOpen(false);
  };

  const closeChat = () => {
    if (responseTimeoutRef.current) {
      clearTimeout(responseTimeoutRef.current);
    }
    setIsTyping(false);
    setInputValue('');
    setMessages([createWelcomeMessage()]);
    setIsOpen(false);
  };

  const handleSendMessage = (text = inputValue) => {
    if (!text.trim() || isTyping) return;

    const newUserMessage = {
      id: Date.now(),
      text: text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    // Mock AI Response
    responseTimeoutRef.current = setTimeout(() => {
      let botResponse =
        'I can help you with that. Our team will analyze your request and provide detailed data shortly.';
      if (
        text.toLowerCase().includes('price') ||
        text.toLowerCase().includes('quote')
      ) {
        botResponse =
          "I can help generate a quote. Please use the 'Customize Your Order' section to specify your requirements.";
      } else if (text.toLowerCase().includes('doc')) {
        botResponse =
          'For exports to the EU, we provide Phytosanitary Certificates, Certificate of Origin as standard.';
      }

      const newBotMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, newBotMessage]);
    }, 1000);
  };

  const quickActions = ['Product Info', 'Pricing', 'Export Docs', 'Contact'];

  return (
    <>
      {/* Trigger Button */}
      <button
        id="agribot-trigger"
        onClick={() => setIsOpen(true)}
        className="hidden"
      >
        Open Chat
      </button>

      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 bg-sml-green text-white p-4 rounded-full shadow-2xl flex items-center space-x-2 hover:bg-sml-green-light transition-colors"
          aria-label="Open chat"
        >
          <Sparkles className="w-6 h-6" />
          <span className="font-bold pr-2 hidden sm:inline">AGRI BOT</span>
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-2 right-2 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-1rem)] sm:w-full max-w-md bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[calc(100vh-1rem)] sm:max-h-[600px]"
          >
            {/* Header */}
            <div className="bg-sml-dark p-4 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-sml-green rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">SML Agri Bot</h3>
                  <p className="text-sml-green-light text-xs flex items-center">
                    <span className="w-2 h-2 bg-sml-green-light rounded-full mr-1 animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={minimizeChat}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                  aria-label="Minimize chat"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
                <button
                  onClick={closeChat}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-gray-50 h-[52vh] sm:h-[400px]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-sml-green text-white rounded-tr-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                    <p
                      className={`mt-1 text-[11px] ${
                        msg.sender === 'user' ? 'text-white/70' : 'text-gray-400'
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm">
                    <div className="flex items-center gap-1" aria-label="Bot is typing">
                      <span className="w-2 h-2 rounded-full bg-sml-green-light animate-bounce"></span>
                      <span
                        className="w-2 h-2 rounded-full bg-sml-green-light animate-bounce"
                        style={{ animationDelay: '120ms' }}
                      ></span>
                      <span
                        className="w-2 h-2 rounded-full bg-sml-green-light animate-bounce"
                        style={{ animationDelay: '240ms' }}
                      ></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-3 sm:px-4 py-2 bg-gray-50 flex gap-2 overflow-x-auto">
              {quickActions.map((action) => (
                <button
                  key={action}
                  onClick={() => handleSendMessage(`Tell me about ${action}`)}
                  disabled={isTyping}
                  className="whitespace-nowrap px-3 py-1 bg-white border border-sml-green/30 text-sml-green text-xs rounded-full hover:bg-sml-green hover:text-white transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div
              className="p-3 sm:p-4 bg-white border-t border-gray-100"
              style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)' }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about products..."
                  className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-3 text-sm focus:ring-2 focus:ring-sml-green focus:bg-white transition-all"
                  aria-label="Chat message input"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-sml-dark text-white p-3 rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
