import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    SerializeOptions,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Depends } from '@/modules/restful/decorators';
import { DeleteDto, PaginateDto } from '@/modules/restful/dtos';

import { Guest } from '@/modules/user/decorators';

import { ContentModule } from '../content.module';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { CategoryService } from '../services';

@ApiTags('分类操作')
@Depends(ContentModule)
@Controller('categories')
export class CategoryController {
    constructor(protected service: CategoryService) {}

    /**
     * 查询分类树
     */
    @Get('tree')
    @Guest()
    @SerializeOptions({ groups: ['category-tree'] })
    async tree() {
        return this.service.findTrees();
    }

    /**
     * 分页查询分类列表
     * @param options
     */
    @Get()
    @Guest()
    @SerializeOptions({ groups: ['category-list'] })
    async list(
        @Query()
        options: PaginateDto,
    ) {
        return this.service.paginate(options);
    }

    /**
     * 分页详解查询
     * @param id
     */
    @Get(':id')
    @Guest()
    @SerializeOptions({ groups: ['category-detail'] })
    async detail(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.service.detail(id);
    }

    /**
     * 新增分类
     * @param data
     */
    @Post()
    @ApiBearerAuth()
    @SerializeOptions({ groups: ['category-detail'] })
    async store(
        @Body()
        data: CreateCategoryDto,
    ) {
        return this.service.create(data);
    }

    /**
     * 更新分类
     * @param data
     */
    @Patch()
    @ApiBearerAuth()
    @SerializeOptions({ groups: ['category-detail'] })
    async update(
        @Body()
        data: UpdateCategoryDto,
    ) {
        return this.service.update(data);
    }

    /**
     * 批量删除分类
     * @param data
     */
    @Delete()
    @ApiBearerAuth()
    @SerializeOptions({ groups: ['category-list'] })
    async delete(
        @Body()
        data: DeleteDto,
    ) {
        const { ids } = data;
        return this.service.delete(ids);
    }
}
