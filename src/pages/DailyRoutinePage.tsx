
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getRoutineByDosha } from '@/data/routineData';
import { Calendar, Clock, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';

const DailyRoutinePage: React.FC = () => {
  const { user } = useAuth();
  const dosha = user?.dosha || 'tridosha';
  const routine = getRoutineByDosha(dosha);
  
  const [selectedRoutine, setSelectedRoutine] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  
  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold font-playfair text-ayur-secondary mb-1">Daily Routine</h1>
        <p className="text-gray-600">Personalized for your {dosha.toUpperCase()} constitution</p>
      </motion.div>
      
      <Card className="p-4 bg-white shadow-md rounded-xl mb-6">
        <h2 className="font-medium mb-2">{routine.dosha} Routine</h2>
        <p className="text-sm text-gray-600 mb-4">{routine.description}</p>
        
        <Tabs defaultValue="morning" value={selectedRoutine} onValueChange={(value) => setSelectedRoutine(value as any)}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="morning">Morning</TabsTrigger>
            <TabsTrigger value="afternoon">Afternoon</TabsTrigger>
            <TabsTrigger value="evening">Evening</TabsTrigger>
          </TabsList>
          
          <TabsContent value="morning" className="mt-0">
            <RoutineTimeline activities={routine.morning} />
          </TabsContent>
          
          <TabsContent value="afternoon" className="mt-0">
            <RoutineTimeline activities={routine.afternoon} />
          </TabsContent>
          
          <TabsContent value="evening" className="mt-0">
            <RoutineTimeline activities={routine.evening} />
          </TabsContent>
        </Tabs>
      </Card>
      
      <div className="space-y-6">
        <DoshaRoutineTips dosha={dosha} />
      </div>
    </div>
  );
};

const RoutineTimeline: React.FC<{ activities: any[] }> = ({ activities }) => {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex gap-4"
        >
          <div className="flex flex-col items-center">
            <div className="bg-ayur-primary text-white rounded-full w-8 h-8 flex items-center justify-center">
              <Clock size={15} />
            </div>
            {index < activities.length - 1 && (
              <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
            )}
          </div>
          
          <div className="flex-1 pb-4">
            <div className="flex justify-between items-start">
              <h3 className="font-medium">{activity.activity}</h3>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const DoshaRoutineTips: React.FC<{ dosha: string }> = ({ dosha }) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="morning-tips">
        <AccordionTrigger className="py-3 px-4 bg-ayur-light rounded-lg hover:no-underline">
          <div className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-ayur-primary" />
            <span className="font-medium">Morning Routine Tips</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pt-2">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check size={16} className="text-ayur-primary mt-0.5" />
              <span className="text-sm">Wake up early to sync with natural rhythms</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="text-ayur-primary mt-0.5" />
              <span className="text-sm">Start with a glass of warm water to cleanse the system</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="text-ayur-primary mt-0.5" />
              <span className="text-sm">Practice oil pulling for 5-10 minutes</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="text-ayur-primary mt-0.5" />
              <span className="text-sm">Allow 30 minutes for yoga and meditation</span>
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="afternoon-tips" className="mt-3">
        <AccordionTrigger className="py-3 px-4 bg-ayur-light rounded-lg hover:no-underline">
          <div className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-ayur-primary" />
            <span className="font-medium">Afternoon Routine Tips</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pt-2">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check size={16} className="text-ayur-primary mt-0.5" />
              <span className="text-sm">Eat lunch as your largest meal of the day</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="text-ayur-primary mt-0.5" />
              <span className="text-sm">Take a short walk after meals to aid digestion</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="text-ayur-primary mt-0.5" />
              <span className="text-sm">Avoid heavy, difficult tasks right after eating</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="text-ayur-primary mt-0.5" />
              <span className="text-sm">Stay hydrated with room temperature water</span>
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="evening-tips" className="mt-3">
        <AccordionTrigger className="py-3 px-4 bg-ayur-light rounded-lg hover:no-underline">
          <div className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-ayur-primary" />
            <span className="font-medium">Evening Routine Tips</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pt-2">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check size={16} className="text-ayur-primary mt-0.5" />
              <span className="text-sm">Eat a light dinner at least 3 hours before bed</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="text-ayur-primary mt-0.5" />
              <span className="text-sm">Take a gentle walk after dinner</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="text-ayur-primary mt-0.5" />
              <span className="text-sm">Avoid screens 1-2 hours before bedtime</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="text-ayur-primary mt-0.5" />
              <span className="text-sm">Practice gentle stretching or meditation before sleep</span>
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default DailyRoutinePage;
