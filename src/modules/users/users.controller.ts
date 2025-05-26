import { Controller, Get, Request, UseGuards, Param, Res, Put, Body, Delete, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from 'express';
import { UsersService } from "./users.service";
import { AuthGuard } from "src/auth/auth.guard";
import { HttpResponseModel, ToggleStatusModel, UserDTO } from "src/core/dtos";
import { User } from "src/core/models";
import { boolean } from "drizzle-orm/gel-core";

@Controller('api/users')
@ApiTags('Users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    async getAll(@Request() req: any) {
        const users = await this.usersService.findAll();
        return HttpResponseModel.okResponse<User[]>(users);
    }

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
    @ApiResponse({ type: boolean })
    async toggleActiveStatus(@Param('id') id: string, @Body() data: ToggleStatusModel) {
        const result = await this.usersService.toggleActiveStatus(id, data);
        return HttpResponseModel.okResponse(result);
    }
}