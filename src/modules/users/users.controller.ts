import { Controller, Get, Request, UseGuards, Param, Res, Put, Body, Delete, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from 'express';
import { UsersService } from "./users.service";
import { AuthGuard } from "src/modules/auth/auth.guard";
import { HttpResponseModel, ToggleStatusModel, UserDTO } from "src/core/dtos";
import { User } from "src/core/models";
import { randomUUID } from "crypto";

@Controller('api/v1/users')
@ApiTags('Users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    async getAll(@Request() req: any) {
        const users = await this.usersService.findAll();
        for (let index = 0; index < 100; index++) {
            users.push(this.generateUser(index));
        }
        return HttpResponseModel.okResponse<User[]>(users);
    }

    generateUser(index: number) {
        return {
            id: randomUUID().toString(),
            firstName: 'User #' + index,
            lastName: 'Demo',
        } as any as User;
    };

    @Get('/:id')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    async findById(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
        const user = await this.usersService.findByID(id);
        if (user) {
            return HttpResponseModel.okResponse<User>(user);
        }
        return HttpResponseModel.notFoundResponse('User not found');
    }

    @Post()
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiBody({ type: UserDTO })
    @ApiResponse({ type: UserDTO })
    async save(@Body() user: User) {
        const result = await this.usersService.insert(user);
        return HttpResponseModel.okResponse(result);
    }

    @Put()
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiBody({ type: UserDTO })
    @ApiResponse({ type: UserDTO })
    async update(@Body() user: User) {
        const result = await this.usersService.update(user);
        return HttpResponseModel.okResponse(result);
    }

    @Patch('/update-status/:id')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiBody({ type: ToggleStatusModel })
    @ApiResponse({ status: 200, description: 'The record has been successfully created.', type: Boolean })
    async toggleActiveStatus(@Param('id') id: string, @Body() data: ToggleStatusModel) {
        const result = await this.usersService.toggleActiveStatus(id, data);
        return HttpResponseModel.okResponse(result);
    }
}