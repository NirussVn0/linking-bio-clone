'use client';

import { useRef, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority } from '@gun-lol-clone/shared';
import { staggerFadeIn } from '@/lib/animations';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export default function TaskList({
  tasks,
  loading,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && tasks.length > 0 && listRef.current) {
      const cards = listRef.current.querySelectorAll('.task-card');
      staggerFadeIn(cards, 100);
    }
  }, [loading, tasks]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="glass p-6 rounded-xl animate-pulse"
          >
            <div className="h-4 bg-white/20 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-white/10 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-white/10 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
        <p className="text-gray-400">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div ref={listRef} className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={() => onEdit(task)}
          onDelete={() => onDelete(task.id)}
          onStatusChange={(status) => onStatusChange(task.id, status)}
        />
      ))}
    </div>
  );
}
