'use client';

import { useState, useEffect, useRef } from 'react';
import { staggerFadeIn } from '@/lib/animations';

interface TaskStatsData {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
}

export default function TaskStats() {
  const [stats, setStats] = useState<TaskStatsData>({
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
  });
  const [loading, setLoading] = useState(true);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (!loading && statsRef.current) {
      const cards = statsRef.current.querySelectorAll('.stat-card');
      staggerFadeIn(cards, 100);
    }
  }, [loading]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/tasks/stats', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCompletionRate = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  };

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: '📋',
      color: 'text-blue-400',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: '✅',
      color: 'text-green-400',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: '⏳',
      color: 'text-yellow-400',
    },
    {
      title: 'To Do',
      value: stats.todo,
      icon: '📝',
      color: 'text-gray-400',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="glass p-6 rounded-xl animate-pulse"
          >
            <div className="h-8 bg-white/20 rounded w-1/2 mb-3"></div>
            <div className="h-6 bg-white/10 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={statsRef} className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {statCards.map((stat, index) => (
          <div
            key={stat.title}
            className="stat-card glass p-6 rounded-xl opacity-0"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-300">{stat.title}</h3>
          </div>
        ))}
      </div>

      {stats.total > 0 && (
        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Completion Rate</h3>
            <span className="text-2xl font-bold gradient-text">
              {getCompletionRate()}%
            </span>
          </div>
          
          <div className="w-full bg-white/10 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-1000"
              style={{ width: `${getCompletionRate()}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
