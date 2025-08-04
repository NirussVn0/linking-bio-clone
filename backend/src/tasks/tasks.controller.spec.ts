import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskStatus, TaskPriority } from '../schemas/task.schema';
import { Types } from 'mongoose';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTask = {
    _id: new Types.ObjectId(),
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    userId: new Types.ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getStats: jest.fn(),
  };

  const mockRequest = {
    user: {
      _id: new Types.ObjectId().toString(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto = {
        title: 'New Task',
        description: 'New Description',
        priority: TaskPriority.HIGH,
      };

      mockTasksService.create.mockResolvedValue(mockTask);

      const result = await controller.create(createTaskDto, mockRequest);
      
      expect(service.create).toHaveBeenCalledWith(createTaskDto, mockRequest.user._id);
      expect(result).toEqual(mockTask);
    });
  });

  describe('findAll', () => {
    it('should return paginated tasks', async () => {
      const mockResponse = {
        tasks: [mockTask],
        total: 1,
        page: 1,
        totalPages: 1,
      };

      mockTasksService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(mockRequest, 1, 10);
      
      expect(service.findAll).toHaveBeenCalledWith(mockRequest.user._id, 1, 10, undefined, undefined);
      expect(result).toEqual(mockResponse);
    });

    it('should handle filters', async () => {
      const mockResponse = {
        tasks: [mockTask],
        total: 1,
        page: 1,
        totalPages: 1,
      };

      mockTasksService.findAll.mockResolvedValue(mockResponse);

      await controller.findAll(mockRequest, 1, 10, TaskStatus.TODO, TaskPriority.HIGH);
      
      expect(service.findAll).toHaveBeenCalledWith(
        mockRequest.user._id, 
        1, 
        10, 
        TaskStatus.TODO, 
        TaskPriority.HIGH
      );
    });
  });

  describe('findOne', () => {
    it('should return a single task', async () => {
      const taskId = mockTask._id.toString();
      
      mockTasksService.findOne.mockResolvedValue(mockTask);

      const result = await controller.findOne(taskId, mockRequest);
      
      expect(service.findOne).toHaveBeenCalledWith(taskId, mockRequest.user._id);
      expect(result).toEqual(mockTask);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const taskId = mockTask._id.toString();
      const updateDto = { title: 'Updated Task' };
      const updatedTask = { ...mockTask, ...updateDto };

      mockTasksService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(taskId, updateDto, mockRequest);
      
      expect(service.update).toHaveBeenCalledWith(taskId, updateDto, mockRequest.user._id);
      expect(result).toEqual(updatedTask);
    });
  });

  describe('remove', () => {
    it('should delete a task', async () => {
      const taskId = mockTask._id.toString();

      mockTasksService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(taskId, mockRequest);
      
      expect(service.remove).toHaveBeenCalledWith(taskId, mockRequest.user._id);
      expect(result).toBeUndefined();
    });
  });

  describe('getStats', () => {
    it('should return task statistics', async () => {
      const mockStats = {
        total: 10,
        completed: 5,
        inProgress: 3,
        todo: 2,
      };

      mockTasksService.getStats.mockResolvedValue(mockStats);

      const result = await controller.getStats(mockRequest);
      
      expect(service.getStats).toHaveBeenCalledWith(mockRequest.user._id);
      expect(result).toEqual(mockStats);
    });
  });
});
