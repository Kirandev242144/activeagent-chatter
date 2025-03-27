
import React from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  mediaUrl?: string;
  mediaType?: 'image' | 'file';
  read: boolean; // Added read status flag
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUserMessage = message.sender === 'user';
  
  return (
    <div 
      className={cn(
        "flex w-full my-2",
        isUserMessage ? "justify-end" : "justify-start"
      )}
    >
      <div 
        className={cn(
          "max-w-[80%] rounded-lg p-3 shadow-sm",
          isUserMessage 
            ? "bg-chat-icon text-white rounded-tr-none" 
            : "bg-chat-bubble dark:bg-gray-700 dark:text-white rounded-tl-none"
        )}
      >
        {message.mediaUrl && message.mediaType === 'image' && (
          <div className="mb-2">
            <img 
              src={message.mediaUrl} 
              alt="Shared media" 
              className="max-w-full rounded-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';
              }}
            />
          </div>
        )}
        
        {message.mediaUrl && message.mediaType === 'file' && (
          <div className="mb-2 flex items-center space-x-2 p-2 rounded-md bg-gray-100 dark:bg-gray-600">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <a 
              href={message.mediaUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 dark:text-blue-300 underline text-sm"
            >
              Attached file
            </a>
          </div>
        )}
        
        <p className="break-words">{message.content}</p>
        <div className={cn(
          "text-xs mt-1",
          isUserMessage ? "text-gray-100" : "text-gray-500 dark:text-gray-400"
        )}>
          {format(message.timestamp, 'h:mm a')}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
