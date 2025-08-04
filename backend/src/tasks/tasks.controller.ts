import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTaskDto: CreateTaskDto, @Req() req: any) {
    return this.tasksService.create(createTaskDto, req.user._id);
  }

  @Get()
  async findAll(
    @Req() req: any,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ) {
    return this.tasksService.findAll(
      req.user._id,
      Number(page),
      Number(limit),
      status,
      priority,
    );
  }

  @Get('stats')
  async getStats(@Req() req: any) {
    return this.tasksService.getStats(req.user._id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    return this.tasksService.findOne(id, req.user._id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: any,
  ) {
    return this.tasksService.update(id, updateTaskDto, req.user._id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.tasksService.remove(id, req.user._id);
  }
}
