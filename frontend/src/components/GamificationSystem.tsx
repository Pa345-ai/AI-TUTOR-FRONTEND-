"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Star, Zap, Target, Crown, Medal, Flame, Award, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface UserStats {
  level: number;
  xp: number;
  xpToNext: number;
  streak: number;
  totalStudyTime: number; // minutes
  achievements: Achievement[];
  badges: Badge[];
  rank: number;
  weeklyXP: number;
  monthlyXP: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earned: boolean;
  earnedAt?: Date;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  level: number;
  xp: number;
  streak: number;
  avatar?: string;
}

export function GamificationSystem() {
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    xpToNext: 100,
    streak: 0,
    totalStudyTime: 0,
    achievements: [],
    badges: [],
    rank: 1,
    weeklyXP: 0,
    monthlyXP: 0
  });
  
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);

  // Initialize achievements and badges
  useEffect(() => {
    const achievements: Achievement[] = [
      {
        id: 'first_lesson',
        title: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🎯',
        rarity: 'common',
        unlocked: false,
        progress: 0,
        maxProgress: 1
      },
      {
        id: 'week_streak',
        title: 'Dedicated Learner',
        description: 'Study for 7 days in a row',
        icon: '🔥',
        rarity: 'rare',
        unlocked: false,
        progress: 0,
        maxProgress: 7
      },
      {
        id: 'quiz_master',
        title: 'Quiz Master',
        description: 'Score 100% on 10 quizzes',
        icon: '🧠',
        rarity: 'epic',
        unlocked: false,
        progress: 0,
        maxProgress: 10
      },
      {
        id: 'speed_demon',
        title: 'Speed Demon',
        description: 'Complete a lesson in under 5 minutes',
        icon: '⚡',
        rarity: 'rare',
        unlocked: false,
        progress: 0,
        maxProgress: 1
      },
      {
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Get 100% accuracy on 50 questions',
        icon: '💎',
        rarity: 'legendary',
        unlocked: false,
        progress: 0,
        maxProgress: 50
      }
    ];

    const badges: Badge[] = [
      {
        id: 'early_bird',
        name: 'Early Bird',
        description: 'Study before 8 AM',
        icon: '🌅',
        color: 'text-yellow-500',
        earned: false
      },
      {
        id: 'night_owl',
        name: 'Night Owl',
        description: 'Study after 10 PM',
        icon: '🦉',
        color: 'text-purple-500',
        earned: false
      },
      {
        id: 'weekend_warrior',
        name: 'Weekend Warrior',
        description: 'Study on weekends',
        icon: '⚔️',
        color: 'text-blue-500',
        earned: false
      },
      {
        id: 'social_learner',
        name: 'Social Learner',
        description: 'Study with friends',
        icon: '👥',
        color: 'text-green-500',
        earned: false
      }
    ];

    setUserStats(prev => ({
      ...prev,
      achievements,
      badges
    }));

    // Mock leaderboard data
    setLeaderboard([
      { rank: 1, username: 'Alex Johnson', level: 15, xp: 2500, streak: 12, avatar: '👨‍💻' },
      { rank: 2, username: 'Sarah Chen', level: 14, xp: 2300, streak: 8, avatar: '👩‍🔬' },
      { rank: 3, username: 'Mike Wilson', level: 13, xp: 2100, streak: 15, avatar: '👨‍🎓' },
      { rank: 4, username: 'Emma Davis', level: 12, xp: 1900, streak: 6, avatar: '👩‍💼' },
      { rank: 5, username: 'You', level: 1, xp: 0, streak: 0, avatar: '👤' }
    ]);
  }, []);

  // Add XP and check for level up
  const addXP = useCallback((amount: number, source: string) => {
    setUserStats(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      const xpToNext = newLevel * 100 - newXP;
      
      // Check for level up
      if (newLevel > prev.level) {
        setRecentAchievements(prev => [...prev, {
          id: 'level_up',
          title: 'Level Up!',
          description: `Reached level ${newLevel}`,
          icon: '🎉',
          rarity: 'epic',
          unlocked: true,
          progress: 1,
          maxProgress: 1
        }]);
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNext,
        weeklyXP: prev.weeklyXP + amount,
        monthlyXP: prev.monthlyXP + amount
      };
    });
  }, []);

  // Unlock achievement
  const unlockAchievement = useCallback((achievementId: string) => {
    setUserStats(prev => ({
      ...prev,
      achievements: prev.achievements.map(achievement => {
        if (achievement.id === achievementId && !achievement.unlocked) {
          setRecentAchievements(prev => [...prev, { ...achievement, unlocked: true, unlockedAt: new Date() }]);
          return { ...achievement, unlocked: true, unlockedAt: new Date() };
        }
        return achievement;
      })
    }));
  }, []);

  // Earn badge
  const earnBadge = useCallback((badgeId: string) => {
    setUserStats(prev => ({
      ...prev,
      badges: prev.badges.map(badge => {
        if (badge.id === badgeId && !badge.earned) {
          return { ...badge, earned: true, earnedAt: new Date() };
        }
        return badge;
      })
    }));
  }, []);

  // Get rarity color
  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get level color
  const getLevelColor = (level: number) => {
    if (level >= 20) return 'text-red-600';
    if (level >= 15) return 'text-purple-600';
    if (level >= 10) return 'text-blue-600';
    if (level >= 5) return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Trophy className="h-8 w-8 text-yellow-600" />
          Gamification Hub
        </h1>
        <p className="text-gray-600">Track your progress, earn achievements, and compete with friends</p>
      </div>

      {/* User Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Level</p>
              <p className="text-3xl font-bold">{userStats.level}</p>
            </div>
            <Crown className="h-8 w-8 text-yellow-300" />
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-sm">
              <span>{userStats.xp} XP</span>
              <span>{userStats.xpToNext} to next</span>
            </div>
            <Progress value={(userStats.xp % 100) / 100 * 100} className="mt-1 h-2" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Streak</p>
              <p className="text-3xl font-bold">{userStats.streak}</p>
            </div>
            <Flame className="h-8 w-8 text-orange-300" />
          </div>
          <p className="text-sm text-orange-100 mt-1">days in a row</p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Study Time</p>
              <p className="text-3xl font-bold">{userStats.totalStudyTime}m</p>
            </div>
            <Target className="h-8 w-8 text-green-300" />
          </div>
          <p className="text-sm text-green-100 mt-1">total minutes</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Rank</p>
              <p className="text-3xl font-bold">#{userStats.rank}</p>
            </div>
            <Medal className="h-8 w-8 text-purple-300" />
          </div>
          <p className="text-sm text-purple-100 mt-1">global leaderboard</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button onClick={() => addXP(50, 'lesson')} className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Complete Lesson (+50 XP)
        </Button>
        <Button onClick={() => addXP(25, 'quiz')} variant="outline" className="flex items-center gap-2">
          <Star className="h-4 w-4" />
          Take Quiz (+25 XP)
        </Button>
        <Button onClick={() => setShowAchievements(true)} variant="outline" className="flex items-center gap-2">
          <Award className="h-4 w-4" />
          View Achievements
        </Button>
        <Button onClick={() => setShowLeaderboard(true)} variant="outline" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Leaderboard
        </Button>
      </div>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Recent Achievements
          </h3>
          <div className="space-y-2">
            {recentAchievements.slice(-3).map((achievement, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-white rounded">
                <span className="text-2xl">{achievement.icon}</span>
                <div>
                  <p className="font-medium">{achievement.title}</p>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Progress */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Weekly Progress
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <div key={day} className="text-center">
              <p className="text-sm text-gray-600 mb-1">{day}</p>
              <div className="h-16 bg-gray-100 rounded flex items-end">
                <div 
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${Math.random() * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{Math.floor(Math.random() * 100)} XP</p>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Modal */}
      {showAchievements && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Achievements</h2>
              <Button onClick={() => setShowAchievements(false)} variant="outline">Close</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userStats.achievements.map((achievement) => (
                <div key={achievement.id} className={`p-4 rounded-lg border ${achievement.unlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                      {achievement.rarity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Leaderboard</h2>
              <Button onClick={() => setShowLeaderboard(false)} variant="outline">Close</Button>
            </div>
            <div className="space-y-2">
              {leaderboard.map((entry) => (
                <div key={entry.rank} className={`flex items-center gap-4 p-3 rounded-lg ${entry.username === 'You' ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{entry.avatar}</span>
                    <span className="font-bold text-lg">#{entry.rank}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{entry.username}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Crown className="h-4 w-4" />
                        Level {entry.level}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        {entry.xp} XP
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="h-4 w-4" />
                        {entry.streak} day streak
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
