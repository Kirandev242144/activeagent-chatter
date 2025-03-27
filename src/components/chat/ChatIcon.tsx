
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AgentList, { Agent } from './AgentList';
import ChatWindow from './ChatWindow';
import { useToast } from '@/hooks/use-toast';
import { Message } from './ChatMessage';

// Temporary mock data with added unreadCount property
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
    // Clear unread count when selecting an agent
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
    // If message is from agent and user is not currently chatting with this agent,
    // increment the unread count
    if (message.sender === 'agent' && (!selectedAgent || selectedAgent.id !== agentId)) {
      setAgents(prevAgents => 
        prevAgents.map(a => 
          a.id === agentId ? { ...a, unreadCount: (a.unreadCount || 0) + 1 } : a
        )
      );
    }
  };

  // For demo purposes: simulate receiving a new message every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly select an agent to send a message
      const randomIndex = Math.floor(Math.random() * agents.length);
      const randomAgentId = agents[randomIndex].id;
      
      // Skip if this is the currently selected agent
      if (selectedAgent?.id === randomAgentId) return;
      
      // Create a simulated message
      const simulatedMessage: Message = {
        id: Date.now().toString(),
        content: "You have a new message!",
        sender: 'agent',
        timestamp: new Date(),
        read: false
      };
      
      handleNewMessage(randomAgentId, simulatedMessage);
    }, 20000); // Every 20 seconds
    
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
        
        {/* Badge showing total unread messages count rather than just active agents */}
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
                // Mark message as read since chat is open
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
