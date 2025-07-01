// Lokasi: app/chat/page.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send, Bot, Trash2, ArrowLeft, Sparkles, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown'; // <-- 1. IMPORT PUSTAKA MARKDOWN

// Tipe Message tetap sama
type Message = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
};

// Welcome messages tetap sama
const welcomeMessages = [
  "Halo! 👋 Ada yang bisa Kit-Bot bantu seputar produk Kitversity?",
  "Hai! 😊 Ada yang ingin ditanyakan tentang produk Kitversity?",
  "Selamat datang! 🌟 Ada yang bisa saya bantu hari ini?",
  "Halo! ✨ Ada pertanyaan seputar produk Kitversity?",
  "Hi! 🎓 Ada yang bisa saya bantu seputar kebutuhan kuliahmu?"
];

// --- KOMPONEN BARU UNTUK TAMPILAN LEBIH RAPI ---
const CustomLi = (props: React.HTMLAttributes<HTMLLIElement>) => (
  <li className="flex items-start gap-2 text-gray-700" {...props}>
    <CheckCircle className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
    <span className="flex-1">{props.children}</span>
  </li>
);
const CustomStrong = (props: React.HTMLAttributes<HTMLElement>) => (
  <strong className="font-semibold text-blue-600" {...props} />
);
// ---------------------------------------------

// MessageList dimodifikasi untuk menggunakan ReactMarkdown
const MessageList = ({ messages, isLoading }: { messages: Message[], isLoading: boolean }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    };
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, isLoading]);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div className="h-full overflow-y-auto space-y-3 pr-2">
      {messages.map((msg) => (
        <div key={msg.id} className={cn("flex items-end gap-2 animate-in slide-in-from-bottom-1", msg.sender === 'user' ? "justify-end" : "justify-start")}>
          <div className={cn("max-w-[80%] sm:max-w-[70%] rounded-lg px-3 py-2 sm:px-4 sm:py-3 prose", msg.sender === 'user' ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none")}>
            {/* --- 2. MENGGANTI dangerouslySetInnerHTML DENGAN ReactMarkdown --- */}
            <ReactMarkdown
                components={{
                    li: CustomLi,
                    strong: CustomStrong,
                    // Membersihkan style default dari paragraf
                    p: (props) => <p className="my-0" {...props} /> 
                }}
            >
                {msg.text}
            </ReactMarkdown>
            <p className="text-xs opacity-70 mt-1 text-right">
              {formatTimestamp(msg.timestamp)}
            </p>
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex items-end gap-2 justify-start animate-in slide-in-from-bottom-1">
          <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 sm:px-4 sm:py-3 rounded-bl-none">
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

const DynamicMessageList = dynamic(() => Promise.resolve(MessageList), { ssr: false });

// Logika komponen utama ChatPage tetap sama
export default function ChatPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedMessages = localStorage.getItem('chatHistory');
        if (savedMessages) return JSON.parse(savedMessages);
      }
    } catch (error) { console.error('Error loading chat history:', error); }
    const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    return [{ id: 'welcome', sender: 'bot', text: randomWelcome, timestamp: Date.now() }];
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('chatHistory', JSON.stringify(messages));
      }
    } catch (error) { console.error('Error saving chat history:', error); }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { id: `user-${Date.now()}`, sender: 'user', text: inputValue.trim(), timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', { // <-- Mengarah ke API Route baru kita
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentInput,
          chat_history: messages.map(msg => `${msg.sender === 'user' ? 'Human' : 'AI'}: ${msg.text}`).join('\n')
        })
      });

      if (!response.ok) throw new Error('Gagal mendapatkan respon dari server.');

      const data = await response.json();
      const botMessage: Message = { id: `bot-${Date.now()}`, sender: 'bot', text: data.answer || "Maaf, terjadi kesalahan.", timestamp: Date.now() };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = { id: `error-${Date.now()}`, sender: 'bot', text: 'Waduh, koneksi ke bot lagi bermasalah nih. Coba beberapa saat lagi ya.', timestamp: Date.now() };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    setMessages([{ id: 'welcome', sender: 'bot', text: randomWelcome, timestamp: Date.now() }]);
    if (typeof window !== 'undefined') localStorage.removeItem('chatHistory');
    toast({ title: "Riwayat Chat Dihapus", description: "Anda memulai percakapan baru." });
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="w-full max-w-4xl mx-auto p-2 sm:p-4 flex-1 flex flex-col">
        <div className="mb-2 sm:mb-4 flex items-center justify-between flex-shrink-0">
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 text-sm sm:text-base">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
            Kembali ke Beranda
          </Link>
          <Button variant="ghost" size="sm" onClick={handleClearChat} className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm">
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Hapus Riwayat
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center pb-4">
          <Card className="shadow-lg w-full max-w-md sm:max-w-lg lg:max-w-2xl h-[500px] sm:h-[600px] lg:h-[700px] flex flex-col">
            <CardHeader className="border-b bg-white flex-shrink-0 p-3 sm:p-4 lg:p-6">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                <CardTitle className="text-lg sm:text-xl">Chatbot AI Kitversity</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto p-2 sm:p-3 lg:p-4 pb-2">
                <DynamicMessageList messages={messages} isLoading={isLoading} />
              </div>
              <div className="border-t bg-gray-50 p-2 sm:p-3 lg:p-4 flex-shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Ketik pesanmu..." autoComplete="off" disabled={isLoading} className="flex-1 text-sm sm:text-base" />
                  <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} className={cn("bg-blue-600 hover:bg-blue-700 h-9 w-9 sm:h-10 sm:w-10", isLoading && "opacity-50 cursor-not-allowed")}>
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