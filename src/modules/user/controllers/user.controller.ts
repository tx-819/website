import { Controller, Get, Param, ParseUUIDPipe, Query, SerializeOptions } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { IsNull, Not } from 'typeorm';

import { SelectTrashMode } from '@/modules/database/constants';
import { Depends } from '@/modules/restful/decorators';

import { Guest } from '../decorators';
import { FrontendQueryUserDto } from '../dtos';
import { UserService } from '../services';
import { UserModule } from '../user.module';

@ApiTags('用户查询')
@Depends(UserModule)
@Controller('users')
export class UserController {
    constructor(protected service: UserService) {}

    /**
     * 用户列表
     */
    @Get()
    @Guest()
    @SerializeOptions({ groups: ['user-list'] })
    async list(
        @Query()
        options: FrontendQueryUserDto,
    ) {
        return this.service.list({
            ...options,
            trashed: SelectTrashMode.NONE,
        });
    }

    /**
     * 获取用户信息
     * @param id
     */
    @Get(':id')
    @Guest()
    @SerializeOptions({ groups: ['user-detail'] })
    async detail(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.service.detail(id, async (qb) => qb.andWhere({ deletedAt: Not(IsNull()) }));
    }
}
