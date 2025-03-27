
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AgentList, { Agent } from './AgentList';
import { useToast } from '@/hooks/use-toast';

// Temporary mock data for demonstration
const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    isActive: true,
  },
  {
    id: '2',
    name: 'Michael Chen',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    isActive: true,
  },
  {
    id: '3',
    name: 'Emma Williams',
    avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
    isActive: false,
    lastSeen: '2 hours ago',
  },
  {
    id: '4',
    name: 'David Rodriguez',
    avatar: 'https://randomuser.me/api/portraits/men/91.jpg',
    isActive: false,
    lastSeen: 'yesterday',
  },
  {
    id: '5',
    name: 'Alex Turner',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    isActive: true,
  },
  {
    id: '6',
    name: 'Olivia Parker',
    avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
    isActive: false,
    lastSeen: '3 days ago',
  },
];

interface ChatIconProps {
  className?: string;
}

const ChatIcon: React.FC<ChatIconProps> = ({ className }) => {
  const [isAgentListOpen, setIsAgentListOpen] = useState(false);
  const { toast } = useToast();
  
  const toggleAgentList = () => {
    setIsAgentListOpen(!isAgentListOpen);
  };
  
  const handleAgentSelect = (agent: Agent) => {
    // In a real app, this would navigate to a chat with this agent
    // or open a chat window with this agent
    toast({
      title: `Chat with ${agent.name}`,
      description: `You selected to chat with ${agent.name} (${agent.isActive ? 'Active' : 'Inactive'})`,
      duration: 3000,
    });
    
    setIsAgentListOpen(false);
  };

  const activeAgentCount = mockAgents.filter(agent => agent.isActive).length;

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
        
        {/* Badge showing number of active agents */}
        {activeAgentCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/3 bg-chat-active rounded-full">
            {activeAgentCount}
          </span>
        )}
      </motion.button>
      
      <AnimatePresence>
        {isAgentListOpen && (
          <AgentList 
            agents={mockAgents} 
            isOpen={isAgentListOpen} 
            onClose={() => setIsAgentListOpen(false)} 
            onAgentSelect={handleAgentSelect}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatIcon;
