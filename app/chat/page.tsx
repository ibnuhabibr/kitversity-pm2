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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }
  }, [messages]);

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
    <div className="h-full overflow-y-auto space-y-4 pr-2 pb-2">
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
              "max-w-xl rounded-lg px-4 py-3",
              msg.sender === 'user'
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-gray-100 text-gray-800 rounded-bl-none"
            )}
          >
            <p 
              className="text-sm whitespace-pre-wrap leading-relaxed"
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
          <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-3 rounded-bl-none">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
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
  const n8nWebhookUrl = 'https://n8n.srv858128.hstgr.cloud/webhook/f0bb6474-a467-41b8-8908-5c59c9860e7f';

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-4xl mx-auto p-4 flex-1 flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Kembali ke Beranda
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearChat}
            className="text-gray-600 hover:text-gray-900"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Hapus Riwayat
          </Button>
        </div>

        <Card className="shadow-lg flex-1 flex flex-col">
          <CardHeader className="border-b bg-white flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-xl">Chatbot AI Kitversity</CardTitle>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 flex-1 flex flex-col">
            <div className="flex-1 overflow-hidden min-h-0 p-4 pb-2">
              <DynamicMessageList messages={messages} isLoading={isLoading} />
            </div>

            <div className="border-t bg-gray-50 p-4 flex-shrink-0">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ketik pesanmu..."
                  autoComplete="off"
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={isLoading || !inputValue.trim()}
                  className={cn(
                    "bg-blue-600 hover:bg-blue-700",
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
  );
} 