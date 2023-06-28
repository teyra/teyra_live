import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LiveUserRoleService } from './live-user-role.service';
import { CreateLiveUserRoleDto } from './dto/create-live-user-role.dto';
import { UpdateLiveUserRoleDto } from './dto/update-live-user-role.dto';

@Controller('live-user-role')
export class LiveUserRoleController {
  constructor(private readonly liveUserRoleService: LiveUserRoleService) {}

  @Post()
  create(@Body() createLiveUserRoleDto: CreateLiveUserRoleDto) {
    return this.liveUserRoleService.create(createLiveUserRoleDto);
  }

  @Get()
  findAll() {
    return this.liveUserRoleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.liveUserRoleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLiveUserRoleDto: UpdateLiveUserRoleDto) {
    return this.liveUserRoleService.update(+id, updateLiveUserRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.liveUserRoleService.remove(+id);
  }
}
