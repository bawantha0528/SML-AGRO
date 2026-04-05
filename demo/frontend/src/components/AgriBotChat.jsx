import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, ChevronDown } from 'lucide-react';

const FAQ_RESPONSES = {
  products:
    'We sell coconut-based export products including coconut shell charcoal briquettes, desiccated coconut, coconut fiber, and private-label packaged items.',
  shipping:
    'Yes, we ship internationally. Share your country and we can confirm delivery options and lead time.',
  moq:
    'Minimum order quantity depends on the product, but most export orders usually start from one 20ft container (or equivalent volume).',
  quote:
    "To get a quote, share product type, quantity, destination country, and packaging preference. You can also use the 'Customize Your Order' section.",
  payment:
    'Payment terms are typically T/T bank transfer with an advance payment and balance before shipment. Final terms are confirmed in your quotation.',
};

const FAQ_KEYWORDS = {
  products: ['what products do you sell', 'products do you sell', 'product list', 'products'],
  shipping: ['do you ship', 'shipping', 'ship to', 'delivery to'],
  moq: ['minimum order quantity', 'moq', 'minimum order', 'min order'],
  quote: ['get a quote', 'how do i get a quote', 'quotation', 'price quote', 'quote'],
  payment: ['payment terms', 'payment', 'how can i pay', 'pay'],
};

const FAQ_QUESTIONS = [
  'What products do you sell?',
  'Do you ship to [country]?',
  'What is minimum order quantity?',
  'How do I get a quote?',
  'Payment terms?',
];

const POPULAR_QUESTIONS_STORAGE_KEY = 'agribot_popular_questions';

const createInitialPopularQuestionCounts = () => ({
  products: 0,
  shipping: 0,
  moq: 0,
  quote: 0,
  payment: 0,
  other: 0,
});

const POPULAR_QUESTION_LABELS = {
  products: 'Products',
  shipping: 'Shipping',
  moq: 'MOQ',
  quote: 'Quote',
  payment: 'Payment',
  other: 'Other',
};

const loadPopularQuestionCounts = () => {
  const defaultCounts = createInitialPopularQuestionCounts();
  if (typeof window === 'undefined') {
    return defaultCounts;
  }

  try {
    const rawData = window.localStorage.getItem(POPULAR_QUESTIONS_STORAGE_KEY);
    if (!rawData) {
      return defaultCounts;
    }

    const parsed = JSON.parse(rawData);
    if (!parsed || typeof parsed !== 'object') {
      return defaultCounts;
    }

    return {
      ...defaultCounts,
      ...parsed,
    };
  } catch {
    return defaultCounts;
  }
};

const savePopularQuestionCounts = (counts) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(POPULAR_QUESTIONS_STORAGE_KEY, JSON.stringify(counts));
};

const normalizeMessage = (text = '') =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const toTitleCase = (value = '') =>
  value
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');

const extractCountryFromShipping = (text = '') => {
  const match = text.match(/\b(?:do\s+you\s+)?(?:ship|shipping)\s+to\s+([a-zA-Z\s-]+?)(?:[?.!,]|$)/i);
  if (!match?.[1]) {
    return null;
  }

  return toTitleCase(match[1].trim());
};

const hasKeywordMatch = (normalizedText, keywords) =>
  keywords.some((keyword) => normalizedText.includes(keyword));

const getFaqMatch = (text = '') => {
  const normalizedText = normalizeMessage(text);

  if (hasKeywordMatch(normalizedText, FAQ_KEYWORDS.products)) {
    return {
      intent: 'products',
      response: FAQ_RESPONSES.products,
    };
  }

  if (hasKeywordMatch(normalizedText, FAQ_KEYWORDS.shipping)) {
    const country = extractCountryFromShipping(text);
    return {
      intent: 'shipping',
      response: country
        ? `Yes, we ship to ${country}. Delivery timelines and export documentation depend on destination port and order size.`
        : FAQ_RESPONSES.shipping,
    };
  }

  if (hasKeywordMatch(normalizedText, FAQ_KEYWORDS.moq)) {
    return {
      intent: 'moq',
      response: FAQ_RESPONSES.moq,
    };
  }

  if (hasKeywordMatch(normalizedText, FAQ_KEYWORDS.quote)) {
    return {
      intent: 'quote',
      response: FAQ_RESPONSES.quote,
    };
  }

  if (hasKeywordMatch(normalizedText, FAQ_KEYWORDS.payment)) {
    return {
      intent: 'payment',
      response: FAQ_RESPONSES.payment,
    };
  }

  return null;
};

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
  const [isFaqMenuOpen, setIsFaqMenuOpen] = useState(false);
  const [popularQuestionCounts, setPopularQuestionCounts] = useState(() => loadPopularQuestionCounts());
  const messagesEndRef = useRef(null);
  const responseTimeoutRef = useRef(null);

  const topPopularQuestions = Object.entries(popularQuestionCounts)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

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
    setIsFaqMenuOpen(false);
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
      const faqMatch = getFaqMatch(text);
      const intentKey = faqMatch?.intent || 'other';

      setPopularQuestionCounts((prev) => {
        const next = {
          ...prev,
          [intentKey]: (prev[intentKey] || 0) + 1,
        };
        savePopularQuestionCounts(next);
        return next;
      });

      const botResponse =
        faqMatch?.response ||
        'I can help you with that. Our team will analyze your request and provide detailed data shortly.';

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

            {/* FAQ Actions */}
            <div className="px-3 sm:px-4 py-2 bg-gray-50 flex items-center gap-2 overflow-hidden border-t border-gray-100">
              <button
                onClick={() => setIsFaqMenuOpen((prev) => !prev)}
                disabled={isTyping}
                className="inline-flex shrink-0 min-w-[88px] items-center justify-center whitespace-nowrap px-3 py-1.5 bg-white border border-sml-green/30 text-sml-green text-xs leading-none rounded-full hover:bg-sml-green hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFaqMenuOpen ? 'Hide FAQs' : 'FAQs'}
              </button>
            </div>

            {isFaqMenuOpen && (
              <div className="px-3 sm:px-4 pb-2 bg-gray-50 flex flex-wrap gap-2 overflow-hidden">
                {FAQ_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    onClick={() => {
                      setIsFaqMenuOpen(false);
                      handleSendMessage(question);
                    }}
                    disabled={isTyping}
                    className="text-left px-3 py-2 bg-white border border-gray-200 text-gray-700 text-xs rounded-lg hover:border-sml-green hover:text-sml-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            <div className="px-3 sm:px-4 pb-2 bg-gray-50 border-t border-gray-100">
              <p className="text-[11px] font-medium text-gray-500 mb-2">Popular Questions</p>
              <div className="flex flex-wrap gap-2">
                {topPopularQuestions.length === 0 && (
                  <span className="text-[11px] text-gray-400">No trending questions yet.</span>
                )}
                {topPopularQuestions.map(([key, count]) => (
                  <span
                    key={key}
                    className="px-2.5 py-1 rounded-full bg-white border border-gray-200 text-[11px] text-gray-600"
                  >
                    {POPULAR_QUESTION_LABELS[key] || key}: {count}
                  </span>
                ))}
              </div>
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
