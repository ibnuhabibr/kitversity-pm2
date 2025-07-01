// Lokasi: components/ChatbotWidget.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, X, ChevronsUp, ChevronsDown, Send, Bot, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Definisikan tipe untuk pesan
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

export const ChatbotWidget = () => {
  const { toast } = useToast();
  
  // State untuk mengontrol tampilan dan fungsionalitas
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    // Load messages from localStorage if available
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
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // URL Webhook n8n
  const n8nWebhookUrl = 'https://n8n.kitversity.com/webhook/1607ad4c-a2a0-403e-9892-444008a188c1';

  // Save messages to localStorage whenever they change
  useEffect(() => {
    // Save messages to localStorage whenever they change
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('chatHistory', JSON.stringify(messages));
      }
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }, [messages]);

  // Fungsi untuk auto-scroll ke pesan terakhir
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fungsi untuk retry jika terjadi error
  const sendMessageWithRetry = async (userMessage: string, retryAttempt = 0): Promise<string> => {
    try {
      console.log('Sending message to n8n:', userMessage);
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ message: userMessage }),
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
      }

      let botReply: string;
      try {
        // Mencoba parse sebagai JSON
        const data = JSON.parse(responseText);
        
        // Fungsi untuk mengekstrak text dari nested object
        const extractTextFromResponse = (obj: any): string => {
          if (typeof obj === 'string') return obj;
          if (typeof obj !== 'object') return String(obj);
          
          // Cek properti yang mungkin berisi pesan
          const possibleKeys = ['output', 'text', 'message', 'reply', 'response'];
          for (const key of possibleKeys) {
            if (obj[key]) {
              const value = obj[key];
              if (typeof value === 'string') return value;
              if (typeof value === 'object') return extractTextFromResponse(value);
            }
          }
          
          // Jika tidak ada properti yang cocok, coba ambil nilai pertama
          const firstValue = Object.values(obj)[0];
          if (firstValue) return extractTextFromResponse(firstValue);
          
          return 'Maaf, saya tidak dapat memproses response dengan benar';
        };

        botReply = extractTextFromResponse(data);
      } catch (e) {
        // Jika bukan JSON valid, gunakan response text langsung
        console.log('Response bukan JSON, menggunakan text langsung');
        botReply = responseText;
      }

      if (!botReply) {
        throw new Error('Tidak ada response yang valid dari server');
      }

      // Bersihkan format response jika masih ada karakter JSON yang tersisa
      botReply = botReply
        .replace(/[{}"\\]/g, '') // Hapus karakter JSON
        .replace(/^\s*output:\s*/i, '') // Hapus label "output:"
        .replace(/^\s*text:\s*/i, '') // Hapus label "text:"
        .replace(/^\s*message:\s*/i, '') // Hapus label "message:"
        .replace(/^\s*reply:\s*/i, '') // Hapus label "reply:"
        .replace(/\n\s*\n/g, '\n') // Remove multiple empty lines
        .replace(/\n/g, '<br>') // Replace newlines with <br>
        .replace(/([.!?])\s+/g, '$1<br><br>') // Add double line break after sentences
        .replace(/(\d+\.\s)/g, '<br>$1') // Add line break before numbered lists
        .replace(/([•-])\s/g, '<br>$1 ') // Add line break before bullet points
        .trim(); // Hapus whitespace di awal dan akhir

      return botReply;

    } catch (error) {
      console.error('Error in sendMessageWithRetry:', error);
      if (retryAttempt < MAX_RETRIES) {
        console.log(`Retrying... attempt ${retryAttempt + 1} of ${MAX_RETRIES}`);
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryAttempt) * 1000));
        return sendMessageWithRetry(userMessage, retryAttempt + 1);
      }
      throw error;
    }
  };
  
  // Fungsi untuk mengirim pesan ke n8n
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
      console.log('Bot reply received:', botReply);
      
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, botMessage]);
      setRetryCount(0); // Reset retry count on success

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

  // Fungsi untuk clear chat history
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
    <>
      {/* Tombol Floating untuk buka chat */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-24 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 shadow-lg transition-all duration-300 hover:scale-110",
          "animate-in slide-in-from-bottom-2"
        )}
        size="icon"
        aria-label="Buka Chatbot"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>

      {/* Jendela Chat */}
      {isOpen && (
        <div
          className={cn(
            "fixed bottom-40 right-6 z-50 transition-all duration-300",
            "animate-in zoom-in-90 slide-in-from-bottom-2",
            isMaximized ? "w-[400px] h-[600px]" : "w-80 h-[450px]"
          )}
        >
          <Card className="h-full w-full flex flex-col shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between p-4 bg-gray-100 border-b">
              <div className="flex items-center space-x-2">
                <Bot className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-lg">Kit-Bot</CardTitle>
              </div>
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={handleClearChat}
                  title="Hapus Riwayat Chat"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => setIsMaximized(!isMaximized)}
                >
                  {isMaximized ? <ChevronsDown className="h-4 w-4" /> : <ChevronsUp className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-4 overflow-y-auto space-y-4 h-0">
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
                      "max-w-[280px] rounded-lg px-3 py-2",
                      msg.sender === 'user'
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    )}
                  >
                    <p 
                      className="text-sm whitespace-pre-wrap leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: msg.text }}
                    />
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-end gap-2 justify-start animate-in slide-in-from-bottom-1">
                  <div className="bg-gray-200 text-gray-800 rounded-lg px-3 py-2 rounded-bl-none">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ketik pesanmu..."
                  autoComplete="off"
                  disabled={isLoading}
                  className="transition-all duration-200"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={isLoading || !inputValue.trim()}
                  className={cn(
                    "transition-all duration-200",
                    isLoading && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </>
  );
};