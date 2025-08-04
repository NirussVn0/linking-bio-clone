'use client';

import { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority } from '@gun-lol-clone/shared';
import TaskList from '@/components/tasks/TaskList';
import TaskForm from '@/components/tasks/TaskForm';
import TaskStats from '@/components/tasks/TaskStats';
import AnimatedButton from '@/components/ui/AnimatedButton';

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<{
    status?: TaskStatus;
    priority?: TaskPriority;
  }>({});

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      if (filter.priority) params.append('priority', filter.priority);

      const response = await fetch(`/api/tasks?${params}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: any) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks(prev => [newTask, ...prev]);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdateTask = async (id: string, taskData: any) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
        setEditingTask(null);
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setTasks(prev => prev.filter(task => task.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold gradient-text">Task Dashboard</h1>
          <AnimatedButton onClick={() => setShowForm(true)}>
            Create Task
          </AnimatedButton>
        </div>

        <TaskStats />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="glass p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Filters</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={filter.status || ''}
                    onChange={(e) => setFilter(prev => ({ 
                      ...prev, 
                      status: e.target.value as TaskStatus || undefined 
                    }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2"
                  >
                    <option value="">All</option>
                    <option value={TaskStatus.TODO}>To Do</option>
                    <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                    <option value={TaskStatus.COMPLETED}>Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <select
                    value={filter.priority || ''}
                    onChange={(e) => setFilter(prev => ({ 
                      ...prev, 
                      priority: e.target.value as TaskPriority || undefined 
                    }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2"
                  >
                    <option value="">All</option>
                    <option value={TaskPriority.LOW}>Low</option>
                    <option value={TaskPriority.MEDIUM}>Medium</option>
                    <option value={TaskPriority.HIGH}>High</option>
                    <option value={TaskPriority.URGENT}>Urgent</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <TaskList
              tasks={tasks}
              loading={loading}
              onEdit={setEditingTask}
              onDelete={handleDeleteTask}
              onStatusChange={(id, status) => handleUpdateTask(id, { status })}
            />
          </div>
        </div>

        {(showForm || editingTask) && (
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? 
              (data) => handleUpdateTask(editingTask.id, data) : 
              handleCreateTask
            }
            onCancel={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
