
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Welcome from '@/components/Welcome';
import AuthForms from '@/components/AuthForms';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface IndexProps {
  initialTab?: 'welcome' | 'login';
}

const Index: React.FC<IndexProps> = ({ initialTab = 'welcome' }) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ayur-light flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="welcome">Welcome</TabsTrigger>
              <TabsTrigger value="login">Sign In</TabsTrigger>
            </TabsList>
            
            <TabsContent value="welcome">
              <Welcome onGetStarted={() => setActiveTab('login')} />
            </TabsContent>
            
            <TabsContent value="login">
              <AuthForms 
                isLogin={isLogin}
                onToggle={() => setIsLogin(!isLogin)}
                onSuccess={() => navigate('/home')} 
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
