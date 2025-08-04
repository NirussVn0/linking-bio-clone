import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from '../schemas/task.schema';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<TaskDocument> {
    const task = new this.taskModel({
      ...createTaskDto,
      userId: new Types.ObjectId(userId),
    });
    return task.save();
  }

  async findAll(
    userId: string,
    page = 1,
    limit = 10,
    status?: string,
    priority?: string,
  ): Promise<{ tasks: TaskDocument[]; total: number; page: number; totalPages: number }> {
    const query: any = { userId: new Types.ObjectId(userId) };
    
    if (status) {
      query.status = status;
    }
    
    if (priority) {
      query.priority = priority;
    }

    const skip = (page - 1) * limit;
    
    const [tasks, total] = await Promise.all([
      this.taskModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.taskModel.countDocuments(query),
    ]);

    return {
      tasks,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string): Promise<TaskDocument> {
    const task = await this.taskModel.findById(id);
    
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    
    if (task.userId.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }
    
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<TaskDocument> {
    const task = await this.findOne(id, userId);
    
    Object.assign(task, updateTaskDto);
    
    if (updateTaskDto.status === 'completed' && !task.completedAt) {
      task.completedAt = new Date();
    } else if (updateTaskDto.status !== 'completed') {
      task.completedAt = undefined;
    }
    
    return task.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.taskModel.findByIdAndDelete(id);
  }

  async getStats(userId: string): Promise<{
    total: number;
    completed: number;
    inProgress: number;
    todo: number;
  }> {
    const userObjectId = new Types.ObjectId(userId);
    
    const [total, completed, inProgress, todo] = await Promise.all([
      this.taskModel.countDocuments({ userId: userObjectId }),
      this.taskModel.countDocuments({ userId: userObjectId, status: 'completed' }),
      this.taskModel.countDocuments({ userId: userObjectId, status: 'in_progress' }),
      this.taskModel.countDocuments({ userId: userObjectId, status: 'todo' }),
    ]);

    return { total, completed, inProgress, todo };
  }
}
