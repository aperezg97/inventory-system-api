import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Employees')
@Controller('api/v1/employees')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class EmployeesController {}
