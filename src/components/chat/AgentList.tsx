
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';

// Agent interface with unreadCount property
export interface Agent {
  id: string;
  name: string;
  avatar: string;
  isActive: boolean;
  lastSeen?: string;
  unreadCount?: number;
}

interface AgentListProps {
  agents: Agent[];
  isOpen: boolean;
  onClose: () => void;
  onAgentSelect: (agent: Agent) => void;
}

const AgentList: React.FC<AgentListProps> = ({ 
  agents, 
  isOpen, 
  onClose, 
  onAgentSelect 
}) => {
  if (!isOpen) return null;
  
  // Separate active from inactive agents
  const activeAgents = agents.filter(agent => agent.isActive);
  const inactiveAgents = agents.filter(agent => !agent.isActive);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
      className="fixed right-4 bottom-20 w-72 bg-white dark:bg-gray-900 rounded-lg shadow-chat backdrop-blur-sm bg-opacity-95 dark:bg-opacity-90 border border-gray-100 dark:border-gray-800 overflow-hidden z-50"
    >
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <h3 className="font-medium text-sm">Active Agents</h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div className="max-h-96 overflow-y-auto p-2">
        {activeAgents.length > 0 ? (
          <div className="mb-4">
            <div className="agent-list space-y-1">
              {activeAgents.map((agent) => (
                <AgentItem 
                  key={agent.id} 
                  agent={agent} 
                  onClick={() => onAgentSelect(agent)} 
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="p-2 text-sm text-gray-500 text-center">No agents currently active</div>
        )}
        
        {inactiveAgents.length > 0 && (
          <>
            <div className="px-2 py-1 text-xs font-medium text-gray-400 dark:text-gray-500">
              Inactive
            </div>
            <div className="agent-list space-y-1">
              {inactiveAgents.map((agent) => (
                <AgentItem 
                  key={agent.id} 
                  agent={agent} 
                  onClick={() => onAgentSelect(agent)} 
                />
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

// Agent list item component with unread messages badge
const AgentItem: React.FC<{ agent: Agent; onClick: () => void }> = ({ agent, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="agent-item flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 relative"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={agent.avatar} 
          alt={agent.name} 
          className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-gray-700"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';
          }}
        />
        <div className={cn(
          "agent-status-indicator absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-900",
          agent.isActive ? "bg-chat-active animate-pulse-subtle" : "bg-chat-inactive"
        )} />
      </div>
      <div className="ml-3 flex-1">
        <div className="text-sm font-medium">{agent.name}</div>
        <div className="text-xs text-gray-500">
          {agent.isActive ? 'Online' : agent.lastSeen ? `Last seen ${agent.lastSeen}` : 'Offline'}
        </div>
      </div>
      
      {/* Unread messages badge */}
      {agent.unreadCount && agent.unreadCount > 0 && (
        <div className="flex items-center justify-center min-w-5 h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full">
          {agent.unreadCount > 99 ? '99+' : agent.unreadCount}
        </div>
      )}
    </motion.div>
  );
};

export default AgentList;
