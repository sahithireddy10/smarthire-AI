// src/components/shared/Chatbot.jsx
import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, User } from 'lucide-react'
import { callClaude } from '../../utils/claudeApi'

export function Chatbot({ student }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${student?.name || 'there'}! I'm SmartHire AI, your campus placement assistant. How can I help you prepare or apply today?`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  if (!student) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { role: 'user', content: inputValue.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    const systemPrompt = `You are SmartHire AI, a friendly campus placement assistant. You help students with job applications, interview prep, eligibility checks, and career advice. Keep responses concise (under 150 words). The student's name is ${student.name || 'N/A'}, branch: ${student.branch || 'N/A'}, CGPA: ${student.cgpa || 'N/A'}, skills: ${student.skills || 'N/A'}. Be specific and helpful.`;

    try {
      // Create a payload including the new message to get response
      const apiMessages = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      const botReply = await callClaude(
        userMessage.content,
        systemPrompt,
        800,
        apiMessages
      );

      setMessages((prev) => [...prev, { role: 'assistant', content: botReply }]);
    } catch (err) {
      console.warn("AI Chatbot API call failed, using fallback:", err);
      // Rules-based response fallback
      const text = userMessage.content.toLowerCase();
      let replyContent = "I can help with job eligibility, interview prep, AI match scores, and career tips!";

      if (text.includes("interview") || text.includes("prep")) {
        replyContent = "Your interviews are listed in My Applications. Check the status column or navigate to Interview Prep for MCQ quizzes and coding questions!";
      } else if (text.includes("score") || text.includes("match") || text.includes("ai")) {
        replyContent = "The AI match score is calculated out of 100 points: CGPA (30 points), Skills (40 points semantic matching), Degree (20 points), and Academic Year eligibility (10 points). Check AI Tools for details.";
      } else if (text.includes("skill") || text.includes("resume") || text.includes("extract")) {
        replyContent = "You can use the AI Skill Extractor under the AI Tools menu. Paste your resume or profile text and click Extract to auto-detect skills!";
      } else if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
        replyContent = `Hi ${student.name || 'there'}! I'm SmartHire AI. Ask me anything about placement drives, eligibility rules, resume styling, or interview prep.`;
      }

      // Add a slight delay to mimic typing
      await new Promise(resolve => setTimeout(resolve, 800));
      setMessages((prev) => [...prev, { role: 'assistant', content: replyContent }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[50]">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xl hover:shadow-indigo-500/20 hover:scale-105 transition-all duration-300 relative border border-indigo-400/30"
        >
          <MessageSquare size={22} />
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-bg-base" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] h-[480px] bg-[#111827] border border-[#1e2d45] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-slide-in">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-950 to-violet-950 border-b border-[#1e2d45] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Bot size={18} />
              </div>
              <div>
                <span className="font-bold text-[#f1f5f9] text-xs font-sora block leading-none">SmartHire AI</span>
                <span className="text-[10px] text-emerald-400 font-semibold block mt-1 leading-none">Online &bull; Career Coach</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] border shrink-0 ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400' 
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                }`}>
                  {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                </div>

                {/* Bubble */}
                <div className={`p-3 rounded-2xl text-xs max-w-[75%] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-[#1a2236] border border-[#1e2d45] text-slate-200 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Bot size={12} />
                </div>
                <div className="p-3 rounded-2xl bg-[#1a2236] border border-[#1e2d45] rounded-tl-none flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-[#1e2d45] bg-[#0a0e1a]/80 flex gap-2">
            <input
              type="text"
              placeholder="Ask about placement advice, matching, scores..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-[#161f30] border border-[#1e2d45] rounded-xl px-3 py-2 text-xs text-[#f1f5f9] placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl transition-all"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
