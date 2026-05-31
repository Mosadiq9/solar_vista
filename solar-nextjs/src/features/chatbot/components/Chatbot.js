'use client';
import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Zap } from 'lucide-react';
import { createBrowserClient } from '@/shared/utils/supabase/client';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi there! 👋 I'm your SolarVista AI Assistant. Are you looking to get a quick solar estimate, or do you have a question?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [step, setStep] = useState(0); // 0: Init, 1: Bill, 2: Name, 3: Email, 4: Done
  const [leadData, setLeadData] = useState({ bill: '', name: '', email: '' });
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  const supabase = createBrowserClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const pushLeadToSupabase = async (finalLeadData) => {
    try {
      const { error } = await supabase.from('leads').insert([{
        name: finalLeadData.name,
        email: finalLeadData.email,
        message: `Lead from AI Chatbot. Average monthly bill: ${finalLeadData.bill}.`,
        status: 'new'
      }]);
      if (error) console.error("Supabase error:", error);
    } catch (err) {
      console.error('Chatbot Supabase Error:', err);
    }
  };

  const simulateBotTyping = (callback, delay = 800) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInputValue('');

    // State Machine Logic
    if (step === 0) {
      setStep(1);
      simulateBotTyping(() => {
        setMessages(prev => [...prev, { role: 'bot', text: "Great! Let's get you an estimate. Roughly how much is your average monthly electricity bill? (e.g. $150)" }]);
      });
    } else if (step === 1) {
      setLeadData(prev => ({ ...prev, bill: userText }));
      setStep(2);
      simulateBotTyping(() => {
        setMessages(prev => [...prev, { role: 'bot', text: "Got it. Based on that, solar could save you thousands! Who should I address this estimate to? (Please provide your name)" }]);
      });
    } else if (step === 2) {
      setLeadData(prev => ({ ...prev, name: userText }));
      setStep(3);
      simulateBotTyping(() => {
        setMessages(prev => [...prev, { role: 'bot', text: `Nice to meet you, ${userText}! Finally, what's the best email address to send your instant quote to?` }]);
      });
    } else if (step === 3) {
      const finalLeadData = { ...leadData, email: userText };
      setLeadData(finalLeadData);
      setStep(4);
      
      // Push to Supabase immediately in background
      pushLeadToSupabase(finalLeadData);

      simulateBotTyping(() => {
        setMessages(prev => [...prev, { role: 'bot', text: "Awesome! I've sent your details to our expert team. We'll email your custom system design and quote shortly. Let me know if you need anything else!" }]);
      });
    } else if (step === 4) {
      simulateBotTyping(() => {
        setMessages(prev => [...prev, { role: 'bot', text: "Thanks again! Our team is on it." }]);
      });
    }
  };

  // Quick Action Buttons for Step 0
  const handleQuickAction = (action) => {
    if (action === 'quote') {
      setInputValue("I want to get a quote.");
      // Programmatically trigger send
      setTimeout(() => {
        const form = document.getElementById('chat-form');
        if (form) form.requestSubmit();
      }, 50);
    }
  };

  return (
    <>
      <style>{`
        .chatbot-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          font-family: var(--font-primary, system-ui, sans-serif);
        }
        .chatbot-toggle {
          width: 60px;
          height: 60px;
          border-radius: 30px;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          border: none;
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(245, 158, 11, 0.4);
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
        }
        .chatbot-toggle:hover {
          transform: scale(1.05) translateY(-5px);
          box-shadow: 0 15px 35px rgba(245, 158, 11, 0.5);
        }
        
        .chat-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 360px;
          height: 520px;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          transform-origin: bottom right;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
          opacity: 0;
          transform: scale(0.9) translateY(20px);
          pointer-events: none;
        }
        .chat-window.open {
          opacity: 1;
          transform: scale(1) translateY(0);
          pointer-events: all;
        }
        
        .chat-header {
          padding: 20px;
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .chat-header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .chat-avatar {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0f172a;
        }
        .chat-title h4 {
          color: #fff;
          font-size: 1.1rem;
          margin: 0;
          font-weight: 600;
        }
        .chat-title p {
          color: #10b981;
          font-size: 0.8rem;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .online-dot {
          width: 6px;
          height: 6px;
          background: #10b981;
          border-radius: 50%;
        }
        .close-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          transition: color 0.2s;
        }
        .close-btn:hover { color: #fff; }
        
        .chat-body {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .chat-body::-webkit-scrollbar { width: 6px; }
        .chat-body::-webkit-scrollbar-track { background: transparent; }
        .chat-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        
        .message-row {
          display: flex;
          width: 100%;
        }
        .message-row.bot { justify-content: flex-start; }
        .message-row.user { justify-content: flex-end; }
        
        .message-bubble {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        .message-row.bot .message-bubble {
          background: rgba(255, 255, 255, 0.05);
          color: #f8fafc;
          border-bottom-left-radius: 4px;
        }
        .message-row.user .message-bubble {
          background: var(--gradient-primary, linear-gradient(135deg, #fbbf24, #f59e0b));
          color: #0f172a;
          border-bottom-right-radius: 4px;
          font-weight: 500;
        }
        
        .quick-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }
        .quick-btn {
          background: rgba(251, 191, 36, 0.1);
          border: 1px solid rgba(251, 191, 36, 0.3);
          color: #fbbf24;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .quick-btn:hover {
          background: rgba(251, 191, 36, 0.2);
        }
        
        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          border-bottom-left-radius: 4px;
          width: fit-content;
        }
        .typing-dot {
          width: 6px;
          height: 6px;
          background: #94a3b8;
          border-radius: 50%;
          animation: typingBounce 1.4s infinite ease-in-out both;
        }
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes typingBounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        
        .chat-footer {
          padding: 16px;
          background: rgba(255, 255, 255, 0.03);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .chat-form {
          display: flex;
          gap: 8px;
          background: rgba(0, 0, 0, 0.2);
          padding: 4px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .chat-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #fff;
          padding: 8px 16px;
          font-size: 0.95rem;
          outline: none;
        }
        .chat-input::placeholder { color: #64748b; }
        .chat-send {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          background: #fbbf24;
          border: none;
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .chat-send:hover { transform: scale(1.05); }
        .chat-send:disabled {
          background: #475569;
          color: #94a3b8;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .chat-window {
            width: calc(100vw - 32px);
            right: -8px;
            bottom: 70px;
          }
        }
      `}</style>

      <div className="chatbot-container">
        <div className={`chat-window ${isOpen ? 'open' : ''}`}>
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar"><Zap size={20} /></div>
              <div className="chat-title">
                <h4>Solar AI</h4>
                <p><span className="online-dot"></span> Online 24/7</p>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>
          
          <div className="chat-body">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message-row ${msg.role}`}>
                <div className="message-bubble">{msg.text}</div>
              </div>
            ))}
            
            {step === 0 && messages.length === 1 && (
              <div className="message-row bot">
                <div className="quick-actions">
                  <button className="quick-btn" onClick={() => handleQuickAction('quote')}>Get an Instant Quote</button>
                  <button className="quick-btn" onClick={() => handleQuickAction('support')}>Talk to Support</button>
                </div>
              </div>
            )}
            
            {isTyping && (
              <div className="message-row bot">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chat-footer">
            <form id="chat-form" className="chat-form" onSubmit={handleSend}>
              <input 
                type="text" 
                className="chat-input" 
                placeholder="Type your message..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isTyping || step === 4}
              />
              <button type="submit" className="chat-send" disabled={!inputValue.trim() || isTyping || step === 4}>
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

        <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Open Chat">
          {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        </button>
      </div>
    </>
  );
}
