import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TasksService } from './tasks.service';
import { Task, TaskDocument, TaskStatus, TaskPriority } from '../schemas/task.schema';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let model: Model<TaskDocument>;

  const mockTask = {
    _id: new Types.ObjectId(),
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    userId: new Types.ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    save: jest.fn(),
  };

  const mockTaskModel = {
    new: jest.fn().mockResolvedValue(mockTask),
    constructor: jest.fn().mockResolvedValue(mockTask),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken(Task.name),
          useValue: mockTaskModel,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    model = module.get<Model<TaskDocument>>(getModelToken(Task.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto = {
        title: 'New Task',
        description: 'New Description',
        priority: TaskPriority.HIGH,
      };
      const userId = new Types.ObjectId().toString();

      mockTaskModel.constructor.mockImplementation(() => ({
        ...mockTask,
        ...createTaskDto,
        userId: new Types.ObjectId(userId),
        save: jest.fn().mockResolvedValue(mockTask),
      }));

      const result = await service.create(createTaskDto, userId);
      expect(result).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return paginated tasks', async () => {
      const userId = new Types.ObjectId().toString();
      const mockTasks = [mockTask];

      mockTaskModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockTasks),
            }),
          }),
        }),
      });

      mockTaskModel.countDocuments.mockResolvedValue(1);

      const result = await service.findAll(userId);
      
      expect(result).toEqual({
        tasks: mockTasks,
        total: 1,
        page: 1,
        totalPages: 1,
      });
    });
  });

  describe('findOne', () => {
    it('should return a task if found and user owns it', async () => {
      const taskId = mockTask._id.toString();
      const userId = mockTask.userId.toString();

      mockTaskModel.findById.mockResolvedValue(mockTask);

      const result = await service.findOne(taskId, userId);
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if task not found', async () => {
      const taskId = new Types.ObjectId().toString();
      const userId = new Types.ObjectId().toString();

      mockTaskModel.findById.mockResolvedValue(null);

      await expect(service.findOne(taskId, userId)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own task', async () => {
      const taskId = mockTask._id.toString();
      const userId = new Types.ObjectId().toString(); // Different user

      mockTaskModel.findById.mockResolvedValue(mockTask);

      await expect(service.findOne(taskId, userId)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const taskId = mockTask._id.toString();
      const userId = mockTask.userId.toString();
      const updateDto = { title: 'Updated Task' };

      mockTaskModel.findById.mockResolvedValue({
        ...mockTask,
        save: jest.fn().mockResolvedValue({ ...mockTask, ...updateDto }),
      });

      const result = await service.update(taskId, updateDto, userId);
      expect(result.title).toBe(updateDto.title);
    });
  });

  describe('remove', () => {
    it('should delete a task', async () => {
      const taskId = mockTask._id.toString();
      const userId = mockTask.userId.toString();

      mockTaskModel.findById.mockResolvedValue(mockTask);
      mockTaskModel.findByIdAndDelete.mockResolvedValue(mockTask);

      await expect(service.remove(taskId, userId)).resolves.not.toThrow();
    });
  });

  describe('getStats', () => {
    it('should return task statistics', async () => {
      const userId = new Types.ObjectId().toString();
      
      mockTaskModel.countDocuments
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(5)  // completed
        .mockResolvedValueOnce(3)  // in_progress
        .mockResolvedValueOnce(2); // todo

      const result = await service.getStats(userId);
      
      expect(result).toEqual({
        total: 10,
        completed: 5,
        inProgress: 3,
        todo: 2,
      });
    });
  });
});
