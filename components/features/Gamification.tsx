import React from 'react'
import { useOmniMind } from '../../hooks/useOmniMind'
import { Gamification as GamificationType } from '../../lib/supabase'

interface GamificationProps {
  userId: string
}

export const Gamification: React.FC<GamificationProps> = ({ userId }) => {
  const { gamification } = useOmniMind(userId)

  if (!gamification) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">🎮 Gamification</h3>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎮</div>
          <p className="text-gray-600">Loading gamification data...</p>
        </div>
      </div>
    )
  }

  const getLevelColor = (level: number) => {
    if (level >= 20) return 'text-purple-600 bg-purple-100'
    if (level >= 15) return 'text-blue-600 bg-blue-100'
    if (level >= 10) return 'text-green-600 bg-green-100'
    if (level >= 5) return 'text-yellow-600 bg-yellow-100'
    return 'text-gray-600 bg-gray-100'
  }

  const getNextLevelXP = (currentLevel: number) => {
    return (currentLevel + 1) * 100
  }

  const getXPProgress = () => {
    const currentLevelXP = gamification.level * 100
    const nextLevelXP = getNextLevelXP(gamification.level)
    const progressXP = gamification.xp_total - currentLevelXP
    const neededXP = nextLevelXP - currentLevelXP
    return Math.min(100, (progressXP / neededXP) * 100)
  }

  const getBadgeIcon = (badge: string) => {
    const badgeIcons: { [key: string]: string } = {
      'first_lesson': '🎯',
      'week_streak': '🔥',
      'perfect_quiz': '💯',
      'knowledge_master': '🧠',
      'speed_learner': '⚡',
      'persistent': '💪',
      'explorer': '🗺️',
      'mentor': '👨‍🏫',
      'innovator': '💡',
      'champion': '🏆'
    }
    return badgeIcons[badge] || '🏅'
  }

  const getBadgeName = (badge: string) => {
    const badgeNames: { [key: string]: string } = {
      'first_lesson': 'First Steps',
      'week_streak': 'Week Warrior',
      'perfect_quiz': 'Perfect Score',
      'knowledge_master': 'Knowledge Master',
      'speed_learner': 'Speed Learner',
      'persistent': 'Persistent',
      'explorer': 'Explorer',
      'mentor': 'Mentor',
      'innovator': 'Innovator',
      'champion': 'Champion'
    }
    return badgeNames[badge] || badge
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">🎮 Gamification</h2>

      {/* Level and XP Progress */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Level {gamification.level}</h3>
            <p className="text-gray-600">Total XP: {gamification.xp_total.toLocaleString()}</p>
          </div>
          <div className={`px-4 py-2 rounded-full text-lg font-bold ${getLevelColor(gamification.level)}`}>
            Level {gamification.level}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress to Level {gamification.level + 1}</span>
            <span>{Math.round(getXPProgress())}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${getXPProgress()}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 text-center">
            {gamification.xp_total - (gamification.level * 100)} / {getNextLevelXP(gamification.level) - (gamification.level * 100)} XP needed
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* XP Total */}
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {gamification.xp_total.toLocaleString()}
          </div>
          <div className="text-gray-600">Total XP</div>
        </div>

        {/* Current Level */}
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {gamification.level}
          </div>
          <div className="text-gray-600">Current Level</div>
        </div>

        {/* Streak */}
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {gamification.streak_days}
          </div>
          <div className="text-gray-600">Day Streak</div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">🏆 Achievements & Badges</h3>
        
        {gamification.badges && gamification.badges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gamification.badges.map((badge: string, index: number) => (
              <div key={index} className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="text-4xl mb-2">{getBadgeIcon(badge)}</div>
                <div className="text-sm font-medium text-gray-800">{getBadgeName(badge)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🏅</div>
            <p className="text-gray-600">No badges earned yet. Keep learning to unlock achievements!</p>
          </div>
        )}
      </div>

      {/* Streak Visualization */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">🔥 Learning Streak</h3>
        <div className="flex items-center space-x-4">
          <div className="text-4xl">🔥</div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {gamification.streak_days} days
            </div>
            <div className="text-gray-600">
              {gamification.streak_days >= 7 ? 'Amazing streak! Keep it up! 🎉' :
               gamification.streak_days >= 3 ? 'Great progress! You\'re on fire! 🔥' :
               'Start your learning streak today! 💪'}
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Placeholder */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">🏆 Leaderboard</h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-gray-600 mb-4">Compete with other learners!</p>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl">🥇</div>
              <div className="text-sm text-gray-600">1st Place</div>
              <div className="text-lg font-bold">2,450 XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl">🥈</div>
              <div className="text-sm text-gray-600">2nd Place</div>
              <div className="text-lg font-bold">2,100 XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl">🥉</div>
              <div className="text-sm text-gray-600">3rd Place</div>
              <div className="text-lg font-bold">1,850 XP</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              <strong>Your Rank:</strong> #{Math.floor(Math.random() * 50) + 1} with {gamification.xp_total} XP
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
