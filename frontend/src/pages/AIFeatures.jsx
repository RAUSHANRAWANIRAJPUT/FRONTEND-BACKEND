import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageSquare, Zap, BookOpen, BrainCircuit, RefreshCw, LoaderCircle } from 'lucide-react';
import { apiClient } from '../lib/api';
import { toast } from 'react-hot-toast';

const AIFeatures = () => {
  const [activeTab, setActiveTab] = useState('recommend');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am your **ReadTogether Librarian**. I've synchronized with your library and am ready to dive into character metaphors, thematic summaries, or plot analysis.\n\nWhat would you like to explore today?",
    }
  ]);
  const [isLibrarianThinking, setIsLibrarianThinking] = useState(false);
  
  const recommendations = [
     { title: "Klara and the Sun", author: "Kazuo Ishiguro", match: 98, reason: "Matches your interest in AI ethics and emotional sci-fi." },
     { title: "Sapiens", author: "Yuval Noah Harari", match: 92, reason: "Based on your frequent reading of non-fiction history." },
     { title: "Circe", author: "Madeline Miller", match: 85, reason: "Similar narrative style to 'The Midnight Library'." },
  ];
  
  const handleAsk = async () => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || isLibrarianThinking) return;

    const userMessage = { role: 'user', content: trimmedQuestion };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion('');
    setIsLibrarianThinking(true);

    try {
      const response = await apiClient.post('/ai/ask', { question: trimmedQuestion });
      const assistantMessage = { role: 'assistant', content: response.data.answer };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'The Librarian is away from their desk. Please try again.');
    } finally {
      setIsLibrarianThinking(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
         <h1 className="text-3xl font-bold text-gray-900 lg:text-5xl">Your AI Librarian</h1>
         <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-gray-600">
           Your knowledgeable book club mentor, providing clear, insightful, and engaging responses about themes, characters, and deeper meanings.
         </p>
      </div>

      <div className="mb-10 flex justify-center">
        <div className="inline-flex rounded-2xl border border-gray-100 bg-white p-1 shadow-sm">
           {['recommend', 'summaries', 'ask'].map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                 activeTab === tab ? 'bg-primary-600 text-white shadow-lg shadow-primary-100' : 'text-gray-500 hover:text-primary-600'
               }`}
             >
               {tab.charAt(0).toUpperCase() + tab.slice(1)}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {activeTab === 'recommend' && (
          <>
            <div className="space-y-6 lg:col-span-2">
              <h3 className="mb-4 text-xl font-bold text-gray-900">Tailored For You</h3>
              {recommendations.map((rec, i) => (
                <motion.div 
                   key={rec.title}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="group flex items-center justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                   <div className="flex items-center space-x-6">
                       <div className="h-20 w-16 overflow-hidden rounded-xl bg-gray-100 shadow-inner">
                           <img src={`https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=100&h=130&sig=${i}`} alt={rec.title} />
                       </div>
                       <div>
                          <h4 className="font-bold text-gray-900">{rec.title}</h4>
                          <p className="mb-2 text-sm text-gray-500">{rec.author}</p>
                          <div className="inline-flex items-center rounded-md bg-green-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-600">
                             {rec.match}% Match
                          </div>
                       </div>
                   </div>
                   <div className="hidden max-w-[30%] text-right md:block">
                      <p className="text-xs italic text-gray-400">" {rec.reason} "</p>
                   </div>
                   <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 text-gray-400 transition-colors group-hover:bg-primary-50 group-hover:text-primary-600">
                      <Zap size={18} />
                   </button>
                </motion.div>
              ))}
            </div>
            
            <div className="space-y-6">
               <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-white">
                  <BrainCircuit size={32} className="mb-4" />
                  <h3 className="mb-2 text-xl font-bold">Smart Analysis</h3>
                  <p className="mb-6 text-sm leading-relaxed text-indigo-100">Our AI analyzes over 50 data points including reading speed, highlighter usage, and discussion engagement.</p>
                  <button className="flex w-full items-center justify-center rounded-xl bg-white py-3 text-sm font-bold text-indigo-600 transition-colors hover:bg-indigo-50">
                    <RefreshCw size={16} className="mr-2" /> Recalibrate Model
                  </button>
               </div>
            </div>
          </>
        )}

        {activeTab === 'summaries' && (
           <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:col-span-3 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                   <div className="mb-4 flex items-center justify-between">
                      <BookOpen size={20} className="text-primary-500" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Chapter {i}</span>
                   </div>
                   <h4 className="mb-3 text-lg font-bold text-gray-900">Key Themes</h4>
                   <ul className="mb-6 space-y-2">
                      <li className="flex items-start text-sm text-gray-500"><Zap size={14} className="mr-2 mt-1 text-yellow-500" /> The existential dread of choice.</li>
                      <li className="flex items-start text-sm text-gray-500"><Zap size={14} className="mr-2 mt-1 text-yellow-500" /> Philosophical roots in Stoicism.</li>
                   </ul>
                   <button className="text-sm font-bold text-primary-600 hover:underline">Read Full AI Synthesis</button>
                </div>
              ))}
           </div>
        )}

        {activeTab === 'ask' && (
           <div className="mx-auto w-full max-w-4xl lg:col-span-3">
              {/* Identity & Guidelines Section */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm"
              >
                <h4 className="mb-6 flex items-center text-xl font-bold text-gray-900">
                  <BookOpen size={24} className="mr-3 text-primary-600" />
                  Librarian Mission & Guidelines
                </h4>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  <div>
                    <h5 className="mb-2 text-sm font-bold uppercase tracking-wider text-primary-600">My Role</h5>
                    <ul className="space-y-2 text-sm leading-relaxed text-gray-500">
                      <li>• Provide clear, insightful book responses</li>
                      <li>• Explore themes and character arcs</li>
                      <li>• Encourage thoughtful discussion</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="mb-2 text-sm font-bold uppercase tracking-wider text-primary-600">Quality Standards</h5>
                    <ul className="space-y-2 text-sm leading-relaxed text-gray-500">
                      <li>• Structured, easy-to-read answers</li>
                      <li>• Simple but intelligent language</li>
                      <li>• Concise but meaningful insights</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="mb-2 text-sm font-bold uppercase tracking-wider text-primary-600">The Tone</h5>
                    <p className="text-sm italic leading-relaxed text-gray-500">
                      "Professional but warm, helpful and engaging—a knowledgeable mentor for your reading journey."
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-50 bg-gray-50/50 p-8">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-200">
                          <MessageSquare size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Ask the AI Librarian</h3>
                        <p className="text-xs text-gray-500">Ready to discuss your current read</p>
                      </div>
                    </div>
                    <span className="flex items-center rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-green-600">
                      <Zap size={10} className="mr-1 fill-current" /> Online
                    </span>
                </div>
                
                <div className="h-[450px] space-y-6 overflow-y-auto p-8 bg-[#fcfdfd]">
                    {messages.map((msg, idx) => {
                      const isAssistant = msg.role === 'assistant';
                      return (
                        <div key={idx} className={`flex items-start gap-4 ${isAssistant ? '' : 'flex-row-reverse'}`}>
                          <div className={`flex shrink-0 items-center justify-center rounded-xl h-10 w-10 ${isAssistant ? 'bg-primary-50' : 'bg-secondary-50'}`}>
                            {isAssistant ? <Sparkles size={20} className="text-primary-600" /> : <div className="font-bold text-secondary-600">U</div>}
                          </div>
                          <div className={`p-6 rounded-3xl text-sm leading-relaxed border whitespace-pre-line shadow-sm max-w-[85%] ${
                            isAssistant 
                              ? 'rounded-tl-none bg-white text-gray-700 border-gray-100' 
                              : 'rounded-tr-none bg-secondary-600 text-white border-secondary-500'
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      );
                    })}
                    {isLibrarianThinking && (
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                          <LoaderCircle className="animate-spin text-primary-600" size={20} />
                        </div>
                        <div className="rounded-3xl rounded-tl-none border border-gray-100 bg-white p-6 shadow-sm">
                          <p className="text-sm italic text-gray-400">Librarian is thinking...</p>
                        </div>
                      </div>
                    )}
                </div>

                <div className="border-t border-gray-100 bg-gray-50/30 p-8">
                    <div className="relative">
                      <input 
                          type="text" 
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleAsk();
                            }
                          }}
                          placeholder="e.g. Help me understand the key themes of Matt Haig's writing..."
                          className="w-full rounded-[1.5rem] border border-gray-200 bg-white py-5 pl-8 pr-20 text-gray-900 shadow-sm transition-all font-medium focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 placeholder:text-gray-400"
                      />
                      <button 
                          onClick={handleAsk}
                          disabled={isLibrarianThinking || !question.trim()}
                          className="absolute right-3 top-3 bottom-3 rounded-xl bg-primary-600 px-8 font-bold text-white shadow-md shadow-primary-100 transition-all hover:scale-[1.02] hover:bg-primary-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                      >
                          {isLibrarianThinking ? <LoaderCircle className="animate-spin" size={18} /> : 'Ask'}
                      </button>
                    </div>
                </div>
              </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default AIFeatures;
