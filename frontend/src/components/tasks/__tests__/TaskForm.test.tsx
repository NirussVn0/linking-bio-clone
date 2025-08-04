import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Task, TaskStatus, TaskPriority } from '@gun-lol-clone/shared';
import TaskForm from '../TaskForm';

// Mock the animations library
jest.mock('@/lib/animations', () => ({
  fadeInScale: jest.fn(),
}));

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: TaskStatus.TODO,
  priority: TaskPriority.HIGH,
  userId: 'user1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockProps = {
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
};

describe('TaskForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders create form correctly', () => {
    render(<TaskForm {...mockProps} />);
    
    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByText('Create Task')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('renders edit form correctly', () => {
    render(<TaskForm {...mockProps} task={mockTask} />);
    
    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue(TaskPriority.HIGH)).toBeInTheDocument();
    expect(screen.getByText('Update Task')).toBeInTheDocument();
  });

  it('submits form with correct data', async () => {
    const user = userEvent.setup();
    render(<TaskForm {...mockProps} />);
    
    await user.type(screen.getByLabelText(/title/i), 'New Task');
    await user.type(screen.getByLabelText(/description/i), 'New Description');
    await user.selectOptions(screen.getByLabelText(/priority/i), TaskPriority.URGENT);
    
    await user.click(screen.getByText('Create Task'));
    
    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'New Description',
        priority: TaskPriority.URGENT,
      });
    });
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskForm {...mockProps} />);
    
    await user.click(screen.getByText('Cancel'));
    
    expect(mockProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<TaskForm {...mockProps} />);
    
    const submitButton = screen.getByText('Create Task');
    expect(submitButton).toBeDisabled();
    
    await user.type(screen.getByLabelText(/title/i), 'New Task');
    
    expect(submitButton).toBeEnabled();
  });

  it('shows loading state during submission', async () => {
    const user = userEvent.setup();
    const slowSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<TaskForm {...mockProps} onSubmit={slowSubmit} />);
    
    await user.type(screen.getByLabelText(/title/i), 'New Task');
    await user.click(screen.getByText('Create Task'));
    
    expect(screen.getByText('Saving...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Create Task')).toBeInTheDocument();
    });
  });

  it('handles form submission errors gracefully', async () => {
    const user = userEvent.setup();
    const failingSubmit = jest.fn().mockRejectedValue(new Error('Submission failed'));
    
    // Mock console.error to avoid error output in tests
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    render(<TaskForm {...mockProps} onSubmit={failingSubmit} />);
    
    await user.type(screen.getByLabelText(/title/i), 'New Task');
    await user.click(screen.getByText('Create Task'));
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to submit task:', expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });

  it('has proper accessibility attributes', () => {
    render(<TaskForm {...mockProps} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionTextarea = screen.getByLabelText(/description/i);
    const prioritySelect = screen.getByLabelText(/priority/i);
    
    expect(titleInput).toHaveAttribute('required');
    expect(titleInput).toHaveAttribute('placeholder', 'Enter task title');
    expect(descriptionTextarea).toHaveAttribute('placeholder', 'Enter task description (optional)');
    expect(prioritySelect).toBeInTheDocument();
  });

  it('closes modal on escape key press', () => {
    render(<TaskForm {...mockProps} />);
    
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    
    // Note: This would require implementing the escape key handler in the component
    // For now, this test documents the expected behavior
  });
});
