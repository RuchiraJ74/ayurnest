
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { doshaQuestions, calculateDosha } from '@/data/doshaData';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const DoshaTest: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'vata' | 'pitta' | 'kapha'>>({});
  const [selectedOption, setSelectedOption] = useState<'vata' | 'pitta' | 'kapha' | null>(null);
  const { updateUserDosha } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const totalQuestions = doshaQuestions.length;
  const progress = ((currentQuestion) / totalQuestions) * 100;
  
  const handleOptionSelect = (value: 'vata' | 'pitta' | 'kapha') => {
    setSelectedOption(value);
  };
  
  const handleNext = () => {
    if (selectedOption === null) {
      toast({
        title: "Please select an option",
        description: "Choose an answer before continuing",
        variant: "destructive"
      });
      return;
    }
    
    // Save the answer
    const newAnswers = { ...answers, [currentQuestion]: selectedOption };
    setAnswers(newAnswers);
    
    // Reset selection for next question
    setSelectedOption(null);
    
    // If last question, calculate result
    if (currentQuestion === totalQuestions - 1) {
      const doshaResult = calculateDosha(newAnswers);
      updateUserDosha(doshaResult);
      navigate('/dosha-result');
    } else {
      // Move to next question
      setCurrentQuestion(prev => prev + 1);
    }
  };
  
  const currentQuestionData = doshaQuestions[currentQuestion];
  
  return (
    <div className="min-h-screen flex flex-col bg-ayur-light p-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center max-w-md mx-auto w-full pt-6"
      >
        <div className="w-full mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {totalQuestions}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 w-full mb-8">
          <h2 className="text-xl font-bold mb-6 text-center font-playfair text-ayur-secondary">
            {currentQuestionData.question}
          </h2>
          
          <RadioGroup
            value={selectedOption || ""}
            onValueChange={(value) => handleOptionSelect(value as 'vata' | 'pitta' | 'kapha')}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem id="vata" value="vata" />
              <Label htmlFor="vata" className="flex-1 cursor-pointer">
                {currentQuestionData.options.vata}
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem id="pitta" value="pitta" />
              <Label htmlFor="pitta" className="flex-1 cursor-pointer">
                {currentQuestionData.options.pitta}
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50 transition-colors">
              <RadioGroupItem id="kapha" value="kapha" />
              <Label htmlFor="kapha" className="flex-1 cursor-pointer">
                {currentQuestionData.options.kapha}
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <Button 
          onClick={handleNext} 
          className="ayur-button w-full py-6"
          disabled={selectedOption === null}
        >
          {currentQuestion === totalQuestions - 1 ? "See My Results" : "Next Question"}
        </Button>
        
        <p className="text-center text-gray-500 text-sm mt-6 max-w-xs">
          This assessment helps determine your Ayurvedic constitution (Dosha) for personalized recommendations.
        </p>
      </motion.div>
    </div>
  );
};

export default DoshaTest;
