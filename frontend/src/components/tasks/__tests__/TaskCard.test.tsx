import { render, screen, fireEvent } from '@testing-library/react';
import { Task, TaskStatus, TaskPriority } from '@gun-lol-clone/shared';
import TaskCard from '../TaskCard';

// Mock the animations library
jest.mock('@/lib/animations', () => ({
  buttonHover: jest.fn(),
  buttonLeave: jest.fn(),
}));

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: TaskStatus.TODO,
  priority: TaskPriority.MEDIUM,
  userId: 'user1',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
};

const mockProps = {
  task: mockTask,
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onStatusChange: jest.fn(),
};

describe('TaskCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task information correctly', () => {
    render(<TaskCard {...mockProps} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
    expect(screen.getByDisplayValue(TaskStatus.TODO)).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(<TaskCard {...mockProps} />);
    
    const editButton = screen.getByTitle('Edit task');
    fireEvent.click(editButton);
    
    expect(mockProps.onEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<TaskCard {...mockProps} />);
    
    const deleteButton = screen.getByTitle('Delete task');
    fireEvent.click(deleteButton);
    
    expect(mockProps.onDelete).toHaveBeenCalledTimes(1);
  });

  it('calls onStatusChange when status is changed', () => {
    render(<TaskCard {...mockProps} />);
    
    const statusSelect = screen.getByDisplayValue(TaskStatus.TODO);
    fireEvent.change(statusSelect, { target: { value: TaskStatus.COMPLETED } });
    
    expect(mockProps.onStatusChange).toHaveBeenCalledWith(TaskStatus.COMPLETED);
  });

  it('displays correct priority color for urgent tasks', () => {
    const urgentTask = { ...mockTask, priority: TaskPriority.URGENT };
    render(<TaskCard {...mockProps} task={urgentTask} />);
    
    const priorityBadge = screen.getByText('URGENT');
    expect(priorityBadge).toHaveClass('text-red-400');
  });

  it('displays correct status color for completed tasks', () => {
    const completedTask = { ...mockTask, status: TaskStatus.COMPLETED };
    render(<TaskCard {...mockProps} task={completedTask} />);
    
    const statusSelect = screen.getByDisplayValue(TaskStatus.COMPLETED);
    expect(statusSelect).toHaveClass('text-green-400');
  });

  it('formats creation date correctly', () => {
    render(<TaskCard {...mockProps} />);
    
    expect(screen.getByText('1/1/2023')).toBeInTheDocument();
  });

  it('handles tasks without description', () => {
    const taskWithoutDescription = { ...mockTask, description: undefined };
    render(<TaskCard {...mockProps} task={taskWithoutDescription} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<TaskCard {...mockProps} />);
    
    const editButton = screen.getByTitle('Edit task');
    const deleteButton = screen.getByTitle('Delete task');
    
    expect(editButton).toHaveAttribute('title', 'Edit task');
    expect(deleteButton).toHaveAttribute('title', 'Delete task');
  });
});
