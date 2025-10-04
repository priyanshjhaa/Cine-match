// Quick and fast mood quiz - optimized for speed
import React, { useState } from 'react'

const QuickMoodQuiz = ({ onMoodDetected }) => {
  const [selectedMood, setSelectedMood] = useState(null)

  // Quick mood detection with just one question
  const handleMoodSelection = (mood) => {
    setSelectedMood(mood)
    // Immediately send the result
    onMoodDetected({ mood, confidence: 100 })
  }

  if (selectedMood) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">✨</div>
        <h3 className="text-2xl font-bold text-white mb-4">
          Perfect! Finding your {selectedMood} movies...
        </h3>
        <button 
          onClick={() => setSelectedMood(null)}
          className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
        >
          Choose Different Mood
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-4">
          How are you feeling right now?
        </h3>
        <p className="text-gray-400">
          Choose your current mood for instant movie recommendations
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { mood: 'happy', emoji: '😊', label: 'Happy', color: 'bg-yellow-500' },
          { mood: 'sad', emoji: '😢', label: 'Sad', color: 'bg-blue-500' },
          { mood: 'excited', emoji: '🤩', label: 'Excited', color: 'bg-orange-500' },
          { mood: 'calm', emoji: '😌', label: 'Calm', color: 'bg-green-500' },
          { mood: 'angry', emoji: '😠', label: 'Angry', color: 'bg-red-500' },
          { mood: 'romantic', emoji: '💕', label: 'Romantic', color: 'bg-pink-500' },
          { mood: 'adventurous', emoji: '🗺️', label: 'Adventurous', color: 'bg-purple-500' },
          { mood: 'scared', emoji: '😨', label: 'Scared', color: 'bg-gray-600' },
          { mood: 'contemplative', emoji: '🤔', label: 'Thoughtful', color: 'bg-indigo-500' }
        ].map((option) => (
          <button
            key={option.mood}
            onClick={() => handleMoodSelection(option.mood)}
            className={`p-6 rounded-xl ${option.color} hover:scale-105 transition-all duration-300 text-white font-semibold shadow-lg hover:shadow-xl`}
          >
            <div className="text-4xl mb-2">{option.emoji}</div>
            <div className="text-lg">{option.label}</div>
          </button>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          Instant mood-based recommendations
        </p>
      </div>
    </div>
  )
}

export default QuickMoodQuiz
