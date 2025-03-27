
import { motion } from 'framer-motion';
import ChatIcon from '@/components/chat/ChatIcon';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm backdrop-blur-sm bg-opacity-80 dark:bg-opacity-30 p-8 border border-gray-100 dark:border-gray-700"
        >
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white"
            >
              Active Agent Dashboard
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-4 text-lg text-gray-600 dark:text-gray-300"
            >
              Monitor and chat with your agents in real-time
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-12 flex flex-col items-center"
          >
            <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Dashboard Overview</h2>
              <p className="text-gray-600 dark:text-gray-300">
                This is a placeholder for your dashboard content. Click the chat icon in the bottom right 
                to see active and inactive agents.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Fixed chat icon in the bottom right */}
      <div className="fixed bottom-6 right-6 z-50">
        <ChatIcon />
      </div>
    </div>
  );
};

export default Index;
