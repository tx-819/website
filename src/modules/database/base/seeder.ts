import { isNil } from 'lodash';
import { Ora } from 'ora';
import { DataSource, EntityManager, EntityTarget, ObjectLiteral } from 'typeorm';

import { Configure } from '@/modules/config/configure';

import { panic } from '@/modules/core/helpers';

import {
    DbFactory,
    DbFactoryOption,
    Seeder,
    SeederConstructor,
    SeederLoadParams,
    SeederOptions,
} from '../commands/types';
import { factoryBuilder } from '../helpers';
import { DbConfig } from '../types';

/**
 * 数据填充基类
 */
export abstract class BaseSeeder implements Seeder {
    protected dataSource: DataSource;

    protected em: EntityManager;

    protected connection = 'default';

    protected configure: Configure;

    protected ignoreLock = false;

    protected truncates: EntityTarget<ObjectLiteral>[] = [];

    protected factories: {
        [entityName: string]: DbFactoryOption<any, any>;
    };

    constructor(
        protected readonly spinner: Ora,
        protected readonly args: SeederOptions,
    ) {}

    /**
     * 清空原数据并重新加载数据
     * @param params
     */
    async load(params: SeederLoadParams): Promise<any> {
        const { factorier, factories, dataSource, em, connection, configure, ignoreLock } = params;
        this.connection = connection;
        this.dataSource = dataSource;
        this.em = em;
        this.configure = configure;
        this.ignoreLock = ignoreLock;
        if (this.ignoreLock) {
            for (const truncate of this.truncates) {
                await this.em.clear(truncate);
            }
        }
        this.factories = factories;
        const result = await this.run(factorier, this.dataSource);
        return result;
    }

    protected async getDbConfig() {
        const { connections = [] }: DbConfig = await this.configure.get<DbConfig>('database');
        const dbConfig = connections.find(({ name }) => name === this.connection);
        if (isNil(dbConfig)) panic(`Database connection named ${this.connection} not exists!`);
        return dbConfig;
    }

    /**
     * 运行seeder的关键方法
     * @param factorier
     * @param dataSource
     * @param em
     */
    protected abstract run(
        factorier?: DbFactory,
        dataSource?: DataSource,
        em?: EntityManager,
    ): Promise<any>;

    /**
     * 运行子seeder
     * @param SubSeeder
     */
    protected async call(SubSeeder: SeederConstructor) {
        const subSeeder: Seeder = new SubSeeder(this.spinner, this.args);
        await subSeeder.load({
            connection: this.connection,
            dataSource: this.dataSource,
            em: this.em,
            configure: this.configure,
            ignoreLock: this.ignoreLock,
            factories: this.factories,
            factorier: factoryBuilder(this.configure, this.dataSource, this.factories),
        });
    }
}
