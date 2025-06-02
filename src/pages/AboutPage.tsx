
import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Heart, Users, BookOpen, Zap } from 'lucide-react';

const AboutPage: React.FC = () => {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-ayur-primary" />,
      title: "Personalized Dosha Analysis",
      description: "Discover your unique constitution through our comprehensive Ayurvedic assessment."
    },
    {
      icon: <Leaf className="w-8 h-8 text-ayur-primary" />,
      title: "Natural Remedies",
      description: "Access time-tested herbal remedies and treatments tailored to your needs."
    },
    {
      icon: <Heart className="w-8 h-8 text-ayur-primary" />,
      title: "Daily Wellness Routines",
      description: "Follow personalized daily routines designed for your dosha and lifestyle."
    },
    {
      icon: <Users className="w-8 h-8 text-ayur-primary" />,
      title: "Community Support",
      description: "Connect with others on their wellness journey and share experiences."
    },
    {
      icon: <Zap className="w-8 h-8 text-ayur-primary" />,
      title: "Holistic Approach",
      description: "Address mind, body, and spirit through integrated Ayurvedic practices."
    }
  ];

  return (
    <div className="min-h-screen bg-ayur-light p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-playfair font-bold text-ayur-secondary mb-4">
            About AyurNest
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Your sanctuary for authentic Ayurvedic wellness, where ancient wisdom meets modern convenience.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-ayur-secondary mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            AyurNest is dedicated to making the profound wisdom of Ayurveda accessible to everyone. 
            We believe that true wellness comes from understanding and harmonizing with your unique constitution, 
            and we're here to guide you on that journey.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Through personalized dosha analysis, curated remedies, and comprehensive wellness routines, 
            we help you create a balanced lifestyle that nurtures your mind, body, and spirit.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-ayur-secondary mb-6 text-center">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-ayur-secondary mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-ayur-primary/10 rounded-xl p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-ayur-secondary mb-4">The Ayurvedic Approach</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Personalization:</strong> We recognize that each person is unique, with their own constitution (dosha) 
              that requires specific care and attention.
            </p>
            <p>
              <strong>Prevention:</strong> Rather than just treating symptoms, Ayurveda focuses on preventing imbalances 
              before they manifest as health issues.
            </p>
            <p>
              <strong>Natural Healing:</strong> We emphasize the use of natural remedies, herbs, and lifestyle practices 
              that work in harmony with your body's natural healing mechanisms.
            </p>
            <p>
              <strong>Mind-Body Connection:</strong> True wellness encompasses mental, emotional, and spiritual well-being, 
              not just physical health.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6 text-center"
        >
          <h2 className="text-2xl font-semibold text-ayur-secondary mb-4">Join Our Community</h2>
          <p className="text-gray-700 mb-4">
            Embark on your wellness journey with AyurNest and discover the transformative power of Ayurveda. 
            Whether you're new to Ayurvedic practices or looking to deepen your understanding, 
            we're here to support you every step of the way.
          </p>
          <div className="flex items-center justify-center space-x-2 text-ayur-primary">
            <Leaf className="w-5 h-5" />
            <span className="font-medium">Your journey to balanced wellness starts here</span>
            <Leaf className="w-5 h-5" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
