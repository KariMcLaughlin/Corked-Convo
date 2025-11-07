
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { Page, Message, Role } from './types';
import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';
import BottomNav from './components/BottomNav';
import WineRecommendations from './components/pages/WineRecommendations';
import Blog from './components/pages/Blog';
import Travel from './components/pages/Travel';
import Recipes from './components/pages/Recipes';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Chat);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: Role.Model,
      parts: "Welcome to Corked Convo! How can your personal sommelier help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = useCallback(() => {
    try {
      if (!process.env.API_KEY) {
        throw new Error("API key is missing.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `You are 'Corked Convo', a friendly and highly knowledgeable personal sommelier AI. Your expertise covers wine pairings, detailed recipes, global wine regions, and personalized wine recommendations. Always maintain a warm, sophisticated, and approachable tone. When a user asks for a recipe, provide it in clear, easy-to-follow steps and always suggest at least two wine pairings (a classic choice and a more adventurous one), explaining why they complement the dish. When asked for wine recommendations, ask clarifying questions about their taste preferences (e.g., sweet vs. dry, red vs. white, flavor notes they enjoy) to build a taste profile before suggesting specific wines. For travel planning, provide insightful information about wine regions, including key wineries to visit, local cuisine, and best times to travel. Structure your responses for readability using markdown, like lists and bold text.`;
      
      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-pro',
        config: {
          systemInstruction,
        },
      });
      setError(null);
    } catch (e) {
      console.error(e);
      setError("Failed to initialize the sommelier AI. Please check the API key.");
    }
  }, []);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);


  const sendMessage = async (input: string) => {
    if (!input.trim() || isLoading) return;

    const newUserMessage: Message = {
      role: Role.User,
      parts: input,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setIsLoading(true);
    setError(null);

    try {
      if (!chatRef.current) {
        throw new Error("Chat is not initialized.");
      }
      const response = await chatRef.current.sendMessage({ message: input });
      
      const modelResponse: Message = {
        role: Role.Model,
        parts: response.text,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, modelResponse]);
    } catch (e: any) {
      const errorMessage = "I'm sorry, I'm having trouble connecting. Please try again later.";
      setError(errorMessage);
       setMessages((prevMessages) => [...prevMessages, {
          role: Role.Model,
          parts: errorMessage,
          timestamp: new Date(),
        }]);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.Chat:
        return (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6">
              {messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} />
              ))}
              {isLoading && (
                 <div className="flex justify-start items-center space-x-2">
                    <div className="w-12 h-12 rounded-full bg-warm-taupe/20 flex items-center justify-center">
                       <svg className="w-8 h-8 text-warm-taupe" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8Z" opacity=".5"/><path d="M12 4.12A7.88 7.88 0 0 1 19.88 12h-2A5.89 5.89 0 0 0 12 6.12Z"><animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite" to="360 12 12" type="rotate"/></path></svg>
                    </div>
                   <div className="bg-soft-blush px-4 py-3 rounded-2xl rounded-bl-none max-w-sm">
                     <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-warm-taupe rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-warm-taupe rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-warm-taupe rounded-full animate-pulse"></div>
                      </div>
                   </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            {error && <div className="p-4 text-center text-red-400 bg-red-900/50">{error}</div>}
            <ChatInput onSend={sendMessage} disabled={isLoading} />
          </div>
        );
      case Page.Recommendations: return <WineRecommendations />;
      case Page.Blog: return <Blog />;
      case Page.Travel: return <Travel />;
      case Page.Recipes: return <Recipes />;
      default: return null;
    }
  };

  return (
    <div className="h-screen w-screen bg-deep-burgundy flex flex-col font-serif">
       <header className="bg-black/20 backdrop-blur-sm p-4 text-center shadow-lg">
          <h1 className="text-2xl font-bold text-gold-accent tracking-wider">CORKED CONVO</h1>
        </header>
      <main className="flex-grow overflow-hidden">
        {renderPage()}
      </main>
      <BottomNav currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
};

export default App;
