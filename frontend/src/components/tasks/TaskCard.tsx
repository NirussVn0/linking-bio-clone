'use client';

import { useRef } from 'react';
import { Task, TaskStatus, TaskPriority } from '@gun-lol-clone/shared';
import { buttonHover, buttonLeave } from '@/lib/animations';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: TaskStatus) => void;
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.URGENT:
        return 'text-red-400 bg-red-400/20';
      case TaskPriority.HIGH:
        return 'text-orange-400 bg-orange-400/20';
      case TaskPriority.MEDIUM:
        return 'text-yellow-400 bg-yellow-400/20';
      case TaskPriority.LOW:
        return 'text-green-400 bg-green-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'text-green-400 bg-green-400/20';
      case TaskStatus.IN_PROGRESS:
        return 'text-blue-400 bg-blue-400/20';
      case TaskStatus.TODO:
        return 'text-gray-400 bg-gray-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const handleCardHover = () => {
    if (cardRef.current) {
      buttonHover(cardRef.current);
    }
  };

  const handleCardLeave = () => {
    if (cardRef.current) {
      buttonLeave(cardRef.current);
    }
  };

  return (
    <div
      ref={cardRef}
      className="task-card glass p-6 rounded-xl opacity-0 cursor-pointer transition-all duration-300"
      onMouseEnter={handleCardHover}
      onMouseLeave={handleCardLeave}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
          {task.description && (
            <p className="text-gray-300 text-sm mb-3">{task.description}</p>
          )}
        </div>
        
        <div className="flex space-x-2 ml-4">
          <button
            onClick={onEdit}
            className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg transition-colors"
            title="Edit task"
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority.toUpperCase()}
          </span>
          
          <select
            value={task.status}
            onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
            className={`px-3 py-1 rounded-full text-xs font-medium border-none outline-none ${getStatusColor(task.status)}`}
          >
            <option value={TaskStatus.TODO}>To Do</option>
            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
            <option value={TaskStatus.COMPLETED}>Completed</option>
          </select>
        </div>

        <div className="text-xs text-gray-400">
          {new Date(task.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
