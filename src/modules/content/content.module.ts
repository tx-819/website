import { Module, ModuleMetadata } from '@nestjs/common';

import { Configure } from '../config/configure';
import { DatabaseModule } from '../database/database.module';

import { addEntities, addSubscribers } from '../database/helpers';

import { UserRepository } from '../user/repositories/user.repository';

import { UserModule } from '../user/user.module';

import { defaultContentConfig } from './config';
import * as entities from './entities';
import { ContentRbac } from './rbac';
import * as repositories from './repositories';
import * as services from './services';
import { PostService } from './services/post.service';
import { SanitizeService } from './services/sanitize.service';
import { SearchService } from './services/search.service';
import * as subscribers from './subscribers';
import { ContentConfig } from './types';

@Module({})
export class ContentModule {
    static async forRoot(configure: Configure) {
        const config = await configure.get<ContentConfig>('content', defaultContentConfig);
        const providers: ModuleMetadata['providers'] = [
            ContentRbac,
            ...Object.values(services),
            ...(await addSubscribers(configure, Object.values(subscribers))),
            {
                provide: PostService,
                inject: [
                    repositories.PostRepository,
                    repositories.CategoryRepository,
                    services.CategoryService,
                    repositories.TagRepository,
                    { token: SearchService, optional: true },
                ],
                useFactory(
                    postRepository: repositories.PostRepository,
                    categoryRepository: repositories.CategoryRepository,
                    categoryService: services.CategoryService,
                    tagRepository: repositories.TagRepository,
                    userRepository: UserRepository,
                    searchService: SearchService,
                ) {
                    return new PostService(
                        postRepository,
                        categoryRepository,
                        categoryService,
                        tagRepository,
                        userRepository,
                        searchService,
                        config.searchType,
                    );
                },
            },
        ];
        const exports: ModuleMetadata['exports'] = [
            ...Object.values(services),
            PostService,
            DatabaseModule.forRepository(Object.values(repositories)),
        ];
        if (config.htmlEnabled) {
            providers.push(SanitizeService);
            exports.push(SanitizeService);
        }
        if (config.searchType === 'meilli') {
            providers.push(SearchService);
            exports.push(SearchService);
        }
        return {
            module: ContentModule,
            imports: [
                UserModule,
                await addEntities(configure, Object.values(entities)),
                DatabaseModule.forRepository(Object.values(repositories)),
            ],
            // controllers: Object.values(controllers),
            providers,
            exports,
        };
    }
}
