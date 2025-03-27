import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AgentList, { Agent } from './AgentList';
import ChatWindow from './ChatWindow';
import { useToast } from '@/hooks/use-toast';
import { Message } from './ChatMessage';
import { playMessageSound } from '@/utils/notificationSounds';

const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Jake',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    isActive: true,
    unreadCount: 2,
  },
  {
    id: '2',
    name: 'Oscar',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    isActive: true,
    unreadCount: 0,
  },
  {
    id: '3',
    name: 'Merlin',
    avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
    isActive: false,
    lastSeen: '2 hours ago',
    unreadCount: 3,
  },
  {
    id: '4',
    name: 'Casper',
    avatar: 'https://randomuser.me/api/portraits/men/91.jpg',
    isActive: false,
    lastSeen: 'yesterday',
    unreadCount: 0,
  },
  {
    id: '5',
    name: 'Alex Turner',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    isActive: true,
    unreadCount: 1,
  },
  {
    id: '6',
    name: 'Olivia Parker',
    avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
    isActive: false,
    lastSeen: '3 days ago',
    unreadCount: 0,
  },
];

interface ChatIconProps {
  className?: string;
}

const ChatIcon: React.FC<ChatIconProps> = ({ className }) => {
  const [isAgentListOpen, setIsAgentListOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const { toast } = useToast();
  
  const toggleAgentList = () => {
    if (selectedAgent) {
      setSelectedAgent(null);
    } else {
      setIsAgentListOpen(!isAgentListOpen);
    }
  };
  
  const handleAgentSelect = (agent: Agent) => {
    setAgents(prevAgents => 
      prevAgents.map(a => 
        a.id === agent.id ? { ...a, unreadCount: 0 } : a
      )
    );
    setSelectedAgent(agent);
    setIsAgentListOpen(false);
  };

  const handleCloseChat = () => {
    setSelectedAgent(null);
  };

  const handleNewMessage = (agentId: string, message: Message) => {
    if (message.sender === 'agent' && (!selectedAgent || selectedAgent.id !== agentId)) {
      playMessageSound();
      
      setAgents(prevAgents => 
        prevAgents.map(a => 
          a.id === agentId ? { ...a, unreadCount: (a.unreadCount || 0) + 1 } : a
        )
      );
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * agents.length);
      const randomAgentId = agents[randomIndex].id;
      
      if (selectedAgent?.id === randomAgentId) return;
      
      const simulatedMessage: Message = {
        id: Date.now().toString(),
        content: "You have a new message!",
        sender: 'agent',
        timestamp: new Date(),
        read: false
      };
      
      handleNewMessage(randomAgentId, simulatedMessage);
    }, 20000);
    
    return () => clearInterval(interval);
  }, [agents, selectedAgent]);

  const totalUnreadCount = agents.reduce((sum, agent) => sum + (agent.unreadCount || 0), 0);

  return (
    <div className={className}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleAgentList}
        className="chat-icon-button relative p-3 bg-white dark:bg-gray-800 rounded-full shadow-chat-icon text-chat-icon focus:outline-none"
        aria-label="Chat with agents"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="22" 
          height="22" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        
        {totalUnreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/3 bg-red-500 rounded-full">
            {totalUnreadCount}
          </span>
        )}
      </motion.button>
      
      <AnimatePresence>
        {isAgentListOpen && (
          <AgentList 
            agents={agents} 
            isOpen={isAgentListOpen} 
            onClose={() => setIsAgentListOpen(false)} 
            onAgentSelect={handleAgentSelect}
          />
        )}
        
        {selectedAgent && (
          <ChatWindow 
            agent={selectedAgent}
            onClose={handleCloseChat}
            onMessageReceived={(message) => {
              if (message.sender === 'agent') {
                message.read = true;
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatIcon;
