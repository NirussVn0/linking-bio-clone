import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TaskStatus, TaskPriority } from '../src/schemas/task.schema';

describe('TasksController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let createdTaskId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Mock authentication for testing
    // In a real scenario, you would authenticate with Discord OAuth
    authToken = 'mock-jwt-token';
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/tasks (POST)', () => {
    it('should create a new task', () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        priority: TaskPriority.HIGH,
      };

      return request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createTaskDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.title).toBe(createTaskDto.title);
          expect(res.body.description).toBe(createTaskDto.description);
          expect(res.body.priority).toBe(createTaskDto.priority);
          expect(res.body.status).toBe(TaskStatus.TODO);
          createdTaskId = res.body._id;
        });
    });

    it('should return 400 for invalid task data', () => {
      const invalidTaskDto = {
        // Missing required title
        description: 'Test Description',
      };

      return request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTaskDto)
        .expect(400);
    });

    it('should return 401 for unauthenticated request', () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };

      return request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskDto)
        .expect(401);
    });
  });

  describe('/tasks (GET)', () => {
    it('should return paginated tasks', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('tasks');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('page');
          expect(res.body).toHaveProperty('totalPages');
          expect(Array.isArray(res.body.tasks)).toBe(true);
        });
    });

    it('should filter tasks by status', () => {
      return request(app.getHttpServer())
        .get('/tasks?status=todo')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          res.body.tasks.forEach((task: any) => {
            expect(task.status).toBe(TaskStatus.TODO);
          });
        });
    });

    it('should filter tasks by priority', () => {
      return request(app.getHttpServer())
        .get('/tasks?priority=high')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          res.body.tasks.forEach((task: any) => {
            expect(task.priority).toBe(TaskPriority.HIGH);
          });
        });
    });
  });

  describe('/tasks/stats (GET)', () => {
    it('should return task statistics', () => {
      return request(app.getHttpServer())
        .get('/tasks/stats')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('completed');
          expect(res.body).toHaveProperty('inProgress');
          expect(res.body).toHaveProperty('todo');
          expect(typeof res.body.total).toBe('number');
        });
    });
  });

  describe('/tasks/:id (GET)', () => {
    it('should return a specific task', () => {
      return request(app.getHttpServer())
        .get(`/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body._id).toBe(createdTaskId);
          expect(res.body.title).toBe('Test Task');
        });
    });

    it('should return 404 for non-existent task', () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      
      return request(app.getHttpServer())
        .get(`/tasks/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('/tasks/:id (PATCH)', () => {
    it('should update a task', () => {
      const updateDto = {
        title: 'Updated Task Title',
        status: TaskStatus.IN_PROGRESS,
      };

      return request(app.getHttpServer())
        .patch(`/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe(updateDto.title);
          expect(res.body.status).toBe(updateDto.status);
        });
    });
  });

  describe('/tasks/:id (DELETE)', () => {
    it('should delete a task', () => {
      return request(app.getHttpServer())
        .delete(`/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);
    });

    it('should return 404 when trying to get deleted task', () => {
      return request(app.getHttpServer())
        .get(`/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
