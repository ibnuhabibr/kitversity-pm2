'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send, Bot, Trash2, ArrowLeft, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Define message type
type Message = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
};

// Welcome messages
const welcomeMessages = [
  "Halo! 👋 Ada yang bisa Kit-Bot bantu seputar produk Kitversity?",
  "Hai! 😊 Ada yang ingin ditanyakan tentang produk Kitversity?",
  "Selamat datang! 🌟 Ada yang bisa saya bantu hari ini?",
  "Halo! ✨ Ada pertanyaan seputar produk Kitversity?",
  "Hi! 🎓 Ada yang bisa saya bantu seputar kebutuhan kuliahmu?"
];

// Client-side only component for messages
const MessageList = ({ messages, isLoading }: { messages: Message[], isLoading: boolean }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Improved auto-scroll with better timing
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        });
      }
    };

    // Small delay to ensure DOM is updated
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, isLoading]);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="h-full overflow-y-auto space-y-3 pr-2">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={cn(
            "flex items-end gap-2 animate-in slide-in-from-bottom-1",
            msg.sender === 'user' ? "justify-end" : "justify-start"
          )}
        >
          <div
            className={cn(
              "max-w-[80%] sm:max-w-[70%] rounded-lg px-3 py-2 sm:px-4 sm:py-3",
              msg.sender === 'user'
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-gray-100 text-gray-800 rounded-bl-none"
            )}
          >
            <p 
              className="text-sm whitespace-pre-wrap leading-relaxed break-words"
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
            <p className="text-xs opacity-70 mt-1">
              {formatTimestamp(msg.timestamp)}
            </p>
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex items-end gap-2 justify-start animate-in slide-in-from-bottom-1">
          <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 sm:px-4 sm:py-3 rounded-bl-none max-w-[80%] sm:max-w-[70%]">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} className="h-2" />
    </div>
  );
};

// Dynamically import MessageList with no SSR
const DynamicMessageList = dynamic(() => Promise.resolve(MessageList), { ssr: false });

export default function ChatPage() {
  const { toast } = useToast();
  
  // State management
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedMessages = localStorage.getItem('chatHistory');
        if (savedMessages) {
          return JSON.parse(savedMessages);
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
    // Get random welcome message
    const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    return [
      { 
        id: 'welcome',
        sender: 'bot', 
        text: randomWelcome,
        timestamp: Date.now()
      }
    ];
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // n8n Webhook URL
  const n8nWebhookUrl = 'https://n8n.srv858128.hstgr.cloud/webhook-test/3b7acf78-c0c1-4728-8388-c3e717e335fb';

  // Save messages to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('chatHistory', JSON.stringify(messages));
      }
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }, [messages]);

  // Send message to n8n
  const sendMessageWithRetry = async (userMessage: string, retryAttempt = 0): Promise<string> => {
    try {
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
      }

      let botReply: string;
      try {
        const data = JSON.parse(responseText);
        const extractTextFromResponse = (obj: any): string => {
          if (typeof obj === 'string') return obj;
          if (typeof obj !== 'object') return String(obj);
          
          const possibleKeys = ['output', 'text', 'message', 'reply', 'response'];
          for (const key of possibleKeys) {
            if (obj[key]) {
              const value = obj[key];
              if (typeof value === 'string') return value;
              if (typeof value === 'object') return extractTextFromResponse(value);
            }
          }
          
          const firstValue = Object.values(obj)[0];
          if (firstValue) return extractTextFromResponse(firstValue);
          
          return 'Maaf, saya tidak dapat memproses response dengan benar';
        };

        botReply = extractTextFromResponse(data);
      } catch (e) {
        botReply = responseText;
      }

      if (!botReply) {
        throw new Error('Tidak ada response yang valid dari server');
      }

      // Format bot reply to be more readable
      botReply = botReply
        .replace(/[{}"\\]/g, '')
        .replace(/^\s*output:\s*/i, '')
        .replace(/^\s*text:\s*/i, '')
        .replace(/^\s*message:\s*/i, '')
        .replace(/^\s*reply:\s*/i, '')
        .replace(/\n\s*\n/g, '\n') // Remove multiple empty lines
        .replace(/\n/g, '<br>') // Replace newlines with <br>
        .replace(/([.!?])\s+/g, '$1<br><br>') // Add double line break after sentences
        .replace(/(\d+\.\s)/g, '<br>$1') // Add line break before numbered lists
        .replace(/([•-])\s/g, '<br>$1 ') // Add line break before bullet points
        .trim();

      return botReply;

    } catch (error) {
      console.error('Error in sendMessageWithRetry:', error);
      if (retryAttempt < 3) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryAttempt) * 1000));
        return sendMessageWithRetry(userMessage, retryAttempt + 1);
      }
      throw error;
    }
  };
  
  // Handle message sending
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: inputValue.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const botReply = await sendMessageWithRetry(userMessage.text);
      
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal menghubungi bot. Silakan coba lagi nanti.",
        variant: "destructive"
      });

      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        sender: 'bot',
        text: 'Waduh, koneksi ke bot lagi bermasalah nih. Coba beberapa saat lagi ya.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat history
  const handleClearChat = () => {
    const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    setMessages([{
      id: 'welcome',
      sender: 'bot',
      text: randomWelcome,
      timestamp: Date.now()
    }]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chatHistory');
    }
    toast({
      title: "Chat History Cleared",
      description: "Riwayat chat telah dihapus.",
    });
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="w-full max-w-4xl mx-auto p-2 sm:p-4 flex-1 flex flex-col">
        <div className="mb-2 sm:mb-4 flex items-center justify-between flex-shrink-0">
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 text-sm sm:text-base">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
            Kembali ke Beranda
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearChat}
            className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm"
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Hapus Riwayat
          </Button>
        </div>

        {/* This container will grow and center the chatbox */}
        <div className="flex-1 flex items-center justify-center pb-4">
          <Card className="shadow-lg w-full max-w-md sm:max-w-lg lg:max-w-2xl h-[500px] sm:h-[600px] lg:h-[700px] flex flex-col">
            <CardHeader className="border-b bg-white flex-shrink-0 p-3 sm:p-4 lg:p-6">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                <CardTitle className="text-lg sm:text-xl">Chatbot AI Kitversity</CardTitle>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 flex-1 flex flex-col min-h-0">
              {/* Messages area - fixed height, scrollable */}
              <div className="flex-1 overflow-y-auto p-2 sm:p-3 lg:p-4 pb-2">
                <DynamicMessageList messages={messages} isLoading={isLoading} />
              </div>

              {/* Input area - always visible at bottom */}
              <div className="border-t bg-gray-50 p-2 sm:p-3 lg:p-4 flex-shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ketik pesanmu..."
                    autoComplete="off"
                    disabled={isLoading}
                    className="flex-1 text-sm sm:text-base"
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={isLoading || !inputValue.trim()}
                    className={cn(
                      "bg-blue-600 hover:bg-blue-700 h-9 w-9 sm:h-10 sm:w-10",
                      isLoading && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 