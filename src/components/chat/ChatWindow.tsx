import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Agent } from './AgentList';
import ChatMessage, { Message } from './ChatMessage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, Send, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { playMessageSound } from '@/utils/notificationSounds';

interface ChatWindowProps {
  agent: Agent;
  onClose: () => void;
  onMessageReceived?: (message: Message) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ agent, onClose, onMessageReceived }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hi there! I'm ${agent.name}. Please send the Order ID number here`,
      sender: 'agent',
      timestamp: new Date(),
      read: true,
    },
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: 'user',
      timestamp: new Date(),
      read: true, // User messages are always "read"
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    
    // Simulate agent response after a short delay
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I received your message: "${input.trim()}"`,
        sender: 'agent',
        timestamp: new Date(),
        read: true, // Message is read since chat is open
      };
      setMessages(prev => [...prev, responseMessage]);
      
      // Play sound for incoming message
      playMessageSound();
      
      // Notify parent component about the new message
      onMessageReceived?.(responseMessage);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real app, you would upload this file to a server
    // Here we'll create a local object URL for demo purposes
    setIsUploading(true);
    
    setTimeout(() => {
      const isImage = file.type.startsWith('image/');
      const objectUrl = URL.createObjectURL(file);
      
      const newMessage: Message = {
        id: Date.now().toString(),
        content: isImage ? 'I sent an image' : `I sent a file: ${file.name}`,
        sender: 'user',
        timestamp: new Date(),
        mediaUrl: objectUrl,
        mediaType: isImage ? 'image' : 'file',
        read: true, // User messages are always "read"
      };
      
      setMessages(prev => [...prev, newMessage]);
      setIsUploading(false);
      
      // Simulate agent response
      setTimeout(() => {
        const responseContent = isImage 
          ? "I received your image. It looks great!"
          : `Thanks for sending the file "${file.name}".`;
          
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: responseContent,
          sender: 'agent',
          timestamp: new Date(),
          read: true, // Message is read since chat is open
        };
        setMessages(prev => [...prev, responseMessage]);
        
        // Notify parent component about the new message
        onMessageReceived?.(responseMessage);
      }, 1000);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 1000); // Simulate upload delay
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="fixed bottom-20 right-4 w-80 md:w-96 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 flex flex-col z-50 max-h-[70vh]"
    >
      {/* Chat header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative">
            <img 
              src={agent.avatar} 
              alt={agent.name} 
              className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';
              }}
            />
            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${agent.isActive ? 'bg-chat-active' : 'bg-chat-inactive'}`}></div>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium">{agent.name}</div>
            <div className="text-xs text-gray-500">
              {agent.isActive ? 'Online' : agent.lastSeen ? `Last seen ${agent.lastSeen}` : 'Offline'}
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat input */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-end space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="resize-none min-h-[56px] max-h-24"
          />
          <div className="flex flex-col space-y-2">
            <Button
              type="button"
              onClick={triggerFileInput}
              className="rounded-full h-9 w-9 p-0 flex items-center justify-center"
              variant="outline"
              disabled={isUploading}
            >
              <Paperclip size={18} />
            </Button>
            <Button
              type="button"
              onClick={handleSendMessage}
              className="rounded-full h-9 w-9 p-0 flex items-center justify-center"
              disabled={input.trim() === '' || isUploading}
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
        />
        {isUploading && (
          <div className="text-xs text-gray-500 mt-1">Uploading...</div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatWindow;
