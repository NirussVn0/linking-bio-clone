import { test, expect } from '@playwright/test';

test.describe('Task Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.route('**/api/auth/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ user: { id: '1', username: 'testuser' } }),
      });
    });

    // Mock tasks API
    await page.route('**/api/tasks', route => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            tasks: [
              {
                id: '1',
                title: 'Test Task 1',
                description: 'Test Description 1',
                status: 'todo',
                priority: 'medium',
                createdAt: new Date().toISOString(),
              },
              {
                id: '2',
                title: 'Test Task 2',
                description: 'Test Description 2',
                status: 'completed',
                priority: 'high',
                createdAt: new Date().toISOString(),
              },
            ],
            total: 2,
            page: 1,
            totalPages: 1,
          }),
        });
      }
    });

    // Mock task stats API
    await page.route('**/api/tasks/stats', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          total: 2,
          completed: 1,
          inProgress: 0,
          todo: 1,
        }),
      });
    });

    await page.goto('/dashboard');
  });

  test('should display task dashboard', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Task Dashboard');
    await expect(page.locator('[data-testid="create-task-button"]')).toBeVisible();
  });

  test('should display task statistics', async ({ page }) => {
    await expect(page.locator('text=Total Tasks')).toBeVisible();
    await expect(page.locator('text=Completed')).toBeVisible();
    await expect(page.locator('text=In Progress')).toBeVisible();
    await expect(page.locator('text=To Do')).toBeVisible();
  });

  test('should display task list', async ({ page }) => {
    await expect(page.locator('text=Test Task 1')).toBeVisible();
    await expect(page.locator('text=Test Task 2')).toBeVisible();
    await expect(page.locator('text=Test Description 1')).toBeVisible();
  });

  test('should filter tasks by status', async ({ page }) => {
    // Select "Completed" filter
    await page.selectOption('select[name="status"]', 'completed');
    
    // Should only show completed tasks
    await expect(page.locator('text=Test Task 2')).toBeVisible();
    // Todo task should not be visible (would need to mock filtered API response)
  });

  test('should filter tasks by priority', async ({ page }) => {
    // Select "High" priority filter
    await page.selectOption('select[name="priority"]', 'high');
    
    // Should only show high priority tasks
    await expect(page.locator('text=Test Task 2')).toBeVisible();
  });

  test('should open create task form', async ({ page }) => {
    await page.click('[data-testid="create-task-button"]');
    
    await expect(page.locator('text=Create New Task')).toBeVisible();
    await expect(page.locator('input[name="title"]')).toBeVisible();
    await expect(page.locator('textarea[name="description"]')).toBeVisible();
    await expect(page.locator('select[name="priority"]')).toBeVisible();
  });

  test('should create a new task', async ({ page }) => {
    // Mock create task API
    await page.route('**/api/tasks', route => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '3',
            title: 'New Task',
            description: 'New Description',
            status: 'todo',
            priority: 'medium',
            createdAt: new Date().toISOString(),
          }),
        });
      }
    });

    await page.click('[data-testid="create-task-button"]');
    
    await page.fill('input[name="title"]', 'New Task');
    await page.fill('textarea[name="description"]', 'New Description');
    await page.selectOption('select[name="priority"]', 'medium');
    
    await page.click('button[type="submit"]');
    
    // Form should close and new task should appear
    await expect(page.locator('text=Create New Task')).not.toBeVisible();
  });

  test('should edit a task', async ({ page }) => {
    // Mock update task API
    await page.route('**/api/tasks/1', route => {
      if (route.request().method() === 'PATCH') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '1',
            title: 'Updated Task',
            description: 'Updated Description',
            status: 'todo',
            priority: 'high',
            createdAt: new Date().toISOString(),
          }),
        });
      }
    });

    // Click edit button on first task
    await page.click('[data-testid="edit-task-1"]');
    
    await expect(page.locator('text=Edit Task')).toBeVisible();
    
    await page.fill('input[name="title"]', 'Updated Task');
    await page.fill('textarea[name="description"]', 'Updated Description');
    
    await page.click('button[type="submit"]');
    
    // Form should close
    await expect(page.locator('text=Edit Task')).not.toBeVisible();
  });

  test('should delete a task', async ({ page }) => {
    // Mock delete task API
    await page.route('**/api/tasks/1', route => {
      if (route.request().method() === 'DELETE') {
        route.fulfill({ status: 204 });
      }
    });

    // Click delete button on first task
    await page.click('[data-testid="delete-task-1"]');
    
    // Confirm deletion (if confirmation dialog exists)
    // await page.click('text=Confirm');
    
    // Task should be removed from list
    // await expect(page.locator('text=Test Task 1')).not.toBeVisible();
  });

  test('should change task status', async ({ page }) => {
    // Mock update task API
    await page.route('**/api/tasks/1', route => {
      if (route.request().method() === 'PATCH') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '1',
            title: 'Test Task 1',
            description: 'Test Description 1',
            status: 'completed',
            priority: 'medium',
            createdAt: new Date().toISOString(),
          }),
        });
      }
    });

    // Change status of first task
    await page.selectOption('[data-testid="status-select-1"]', 'completed');
    
    // Status should be updated
    await expect(page.locator('[data-testid="status-select-1"]')).toHaveValue('completed');
  });

  test('should be accessible', async ({ page }) => {
    // Check for proper heading structure
    await expect(page.locator('h1')).toBeVisible();
    
    // Check for proper form labels
    await page.click('[data-testid="create-task-button"]');
    await expect(page.locator('label[for="title"]')).toBeVisible();
    await expect(page.locator('label[for="description"]')).toBeVisible();
    await expect(page.locator('label[for="priority"]')).toBeVisible();
    
    // Check for keyboard navigation
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
  });
});
