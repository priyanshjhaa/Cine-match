// Advanced mood-based movie recommendation system with color psychology
import React, { useState } from 'react'

const MoodQuiz = ({ onMoodDetected }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isComplete, setIsComplete] = useState(false)

  const questions = [
    {
      id: 1,
      question: "How energetic do you feel right now?",
      type: "scale",
      scale: [
        { value: 1, label: "Very tired/drained" },
        { value: 2, label: "Somewhat low energy" },
        { value: 3, label: "Neutral" },
        { value: 4, label: "Somewhat energetic" },
        { value: 5, label: "Very energetic/excited" }
      ],
      weight: 0.15
    },
    {
      id: 2,
      question: "How would you describe your overall mood?",
      type: "scale",
      scale: [
        { value: 1, label: "Very negative/down" },
        { value: 2, label: "Somewhat negative" },
        { value: 3, label: "Neutral" },
        { value: 4, label: "Somewhat positive" },
        { value: 5, label: "Very positive/happy" }
      ],
      weight: 0.25 // Highest weight - most important
    },
    {
      id: 3,
      question: "How stressed or anxious do you feel?",
      type: "scale",
      scale: [
        { value: 1, label: "Very stressed/anxious" },
        { value: 2, label: "Somewhat stressed" },
        { value: 3, label: "Neutral" },
        { value: 4, label: "Somewhat calm" },
        { value: 5, label: "Very calm/relaxed" }
      ],
      weight: 0.20
    },
    {
      id: 4,
      question: "What type of experience are you seeking?",
      type: "multiple",
      options: [
        { value: "escape", label: "Escape from reality", moodMapping: ["happy", "excited", "adventurous"] },
        { value: "reflect", label: "Reflect and think deeply", moodMapping: ["calm", "contemplative"] },
        { value: "thrill", label: "Get thrilled or excited", moodMapping: ["excited", "adventurous"] },
        { value: "comfort", label: "Feel comforted", moodMapping: ["calm", "nostalgic"] }
      ],
      weight: 0.15
    },
    {
      id: 5,
      question: "How focused do you feel mentally?",
      type: "scale",
      scale: [
        { value: 1, label: "Very scattered/unfocused" },
        { value: 2, label: "Somewhat unfocused" },
        { value: 3, label: "Neutral" },
        { value: 4, label: "Somewhat focused" },
        { value: 5, label: "Very focused/sharp" }
      ],
      weight: 0.10
    },
    {
      id: 6,
      question: "How social do you feel?",
      type: "multiple",
      options: [
        { value: "alone", label: "Want to be alone", moodMapping: ["calm", "contemplative"] },
        { value: "intimate", label: "Want intimate connection", moodMapping: ["romantic", "nostalgic"] },
        { value: "group", label: "Want group experiences", moodMapping: ["happy", "excited"] },
        { value: "neutral", label: "No preference", moodMapping: ["neutral"] }
      ],
      weight: 0.10
    },
    {
      id: 7,
      question: "How much emotional intensity do you want?",
      type: "scale",
      scale: [
        { value: 1, label: "Very light/simple" },
        { value: 2, label: "Somewhat light" },
        { value: 3, label: "Moderate" },
        { value: 4, label: "Somewhat intense" },
        { value: 5, label: "Very intense/dramatic" }
      ],
      weight: 0.15
    },
    {
      id: 8,
      question: "What describes your current emotional state best?",
      type: "multiple",
      options: [
        { value: "joyful", label: "Joyful and optimistic", moodMapping: ["happy"] },
        { value: "melancholy", label: "Sad or melancholy", moodMapping: ["sad"] },
        { value: "angry", label: "Frustrated or angry", moodMapping: ["angry"] },
        { value: "fearful", label: "Scared or anxious", moodMapping: ["scared"] },
        { value: "excited", label: "Thrilled and energetic", moodMapping: ["excited"] },
        { value: "peaceful", label: "Calm and peaceful", moodMapping: ["calm"] }
      ],
      weight: 0.20
    }
  ];

  // Enhanced mood calculation algorithm with 10 mood categories
  const calculateMood = (answers) => {
    console.log("🧠 Starting enhanced mood calculation with answers:", answers);
    
    // Initialize mood scores for all 10 categories
    const moodScores = {
      happy: 0,
      sad: 0,
      excited: 0,
      calm: 0,
      angry: 0,
      scared: 0,
      romantic: 0,
      adventurous: 0,
      contemplative: 0,
      nostalgic: 0
    };

    // Process each answer with weighted scoring
    Object.keys(answers).forEach(qIndexStr => {
      const qIndex = parseInt(qIndexStr);
      const answer = answers[qIndex];
      const question = questions[qIndex];
      
      if (answer && question && question.weight) {
        console.log(`Processing Q${qIndex + 1}:`, question.question, "Answer:", answer);
        
        // For scale-type questions
        if (question.type === "scale" && answer.moodMapping) {
          answer.moodMapping.forEach(mood => {
            if (mood in moodScores) {
              moodScores[mood] += question.weight * (answer.value / 5); // Normalize to 0-1
            }
          });
        }
        
        // For multiple-choice questions
        if (question.type === "multiple" && answer.moodMapping) {
          answer.moodMapping.forEach(mood => {
            if (mood in moodScores) {
              moodScores[mood] += question.weight;
            }
          });
        }
      }
    });

    console.log("📊 Mood scores:", moodScores);

    // Find the dominant mood
    const dominantMood = Object.keys(moodScores).reduce((a, b) =>
      moodScores[a] > moodScores[b] ? a : b
    );

    // Calculate confidence based on score distribution
    const totalScore = Object.values(moodScores).reduce((sum, score) => sum + score, 0);
    const confidence = totalScore > 0 ? Math.round((moodScores[dominantMood] / totalScore) * 100) : 0;

    console.log("🎯 Mood analysis complete:", {
      dominantMood,
      scores: moodScores,
      confidence
    });

    return {
      mood: dominantMood,
      scores: moodScores,
      confidence
    };
  };

  const handleAnswer = (option) => {
    console.log("🔍 Processing answer:", option);
    
    const newAnswers = { ...answers };
    newAnswers[currentQuestion] = option;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate mood with enhanced algorithm
      const moodResult = calculateMood(newAnswers);
      console.log("🎭 Final mood result:", moodResult);
      setIsComplete(true);
      onMoodDetected(moodResult);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">✨</div>
        <h3 className="text-2xl font-bold text-white mb-4">
          Mood Analysis Complete!
        </h3>
        <p className="text-gray-300 mb-6">
          Finding movies perfectly matched to your psychological profile...
        </p>
        <button 
          onClick={resetQuiz}
          className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
        >
          Take Quiz Again
        </button>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-teal-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-4">
          {question.question}
        </h3>
      </div>

      {/* Options */}
      <div className="space-y-4">
        {question.type === "scale" ? (
          // Scale questions (1-5 rating)
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => handleAnswer({ value, moodMapping: question.moodMapping })}
                className="w-16 h-16 bg-white/5 hover:bg-teal-500 border border-gray-600 hover:border-teal-400 rounded-full transition-all duration-300 text-white hover:scale-110 flex items-center justify-center text-xl font-bold"
              >
                {value}
              </button>
            ))}
          </div>
        ) : (
          // Multiple choice questions
          question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="w-full p-6 text-left bg-white/5 hover:bg-white/10 border border-gray-600 hover:border-teal-400 rounded-xl transition-all duration-300 text-white hover:scale-105 group"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <span className="text-lg font-medium">{option.label}</span>
                </div>
                
                <div className="text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </div>
              </div>
            </button>
          ))
        )}
      </div>
      
      {/* Enhanced Survey Note */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          Based on psychological mood analysis and emotional intelligence research
        </p>
      </div>
    </div>
  )
}

export default MoodQuiz
