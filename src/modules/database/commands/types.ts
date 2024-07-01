import { Ora } from 'ora';
import { DataSource, EntityManager, EntityTarget, ObjectType } from 'typeorm';
import { Arguments } from 'yargs';

import { Configure } from '@/modules/config/configure';

import { DataFactory } from '../resolver/data.factory';

/** ****************************** 数据迁移 **************************** */

/**
 * 基础数据库命令参数类型
 */
export type TypeOrmArguments = Arguments<{
    connection?: string;
}>;

/**
 * 创建迁移命令参数
 */
export type MigrationCreateArguments = TypeOrmArguments & MigrationCreateOptions;

/**
 * 创建迁移处理器选项
 */
export interface MigrationCreateOptions {
    name: string;
}

/**
 * 生成迁移命令参数
 */
export type MigrationGenerateArguments = TypeOrmArguments & MigrationGenerateOptions;

/**
 * 生成迁移处理器选项
 */
export interface MigrationGenerateOptions {
    name?: string;
    run?: boolean;
    pretty?: boolean;
    dryrun?: boolean;
    check?: boolean;
}

/**
 * 运行迁移的命令参数
 */
export type MigrationRunArguments = TypeOrmArguments & MigrationRunOptions;

/**
 * 运行迁移处理器选项
 */
export interface MigrationRunOptions extends MigrationRevertOptions {
    refresh?: boolean;
    onlydrop?: boolean;
}

/**
 * 恢复迁移的命令参数
 */
export type MigrationRevertArguments = TypeOrmArguments & MigrationRevertOptions;

/**
 * 恢复迁移处理器选项
 */
export interface MigrationRevertOptions {
    transaction?: string;
    fake?: boolean;
}

/** ****************************** 数据填充Seeder **************************** */

/**
 * 数据填充命令参数
 */
export type SeederArguments = TypeOrmArguments & SeederOptions;

/**
 * 数据填充处理器选项
 */
export interface SeederOptions {
    connection?: string;
    transaction?: boolean;
    ignorelock?: boolean;
}

/**
 * 数据填充类接口
 */
export interface SeederConstructor {
    new (spinner: Ora, args: SeederOptions): Seeder;
}

/**
 * 数据填充类方法对象
 */
export interface Seeder {
    load: (params: SeederLoadParams) => Promise<void>;
}

/**
 * 数据填充类的load函数参数
 */
export interface SeederLoadParams {
    /**
     * 数据库连接名称
     */
    connection: string;
    /**
     * 数据库连接池
     */
    dataSource: DataSource;

    /**
     * EntityManager实例
     */
    em: EntityManager;

    /**
     * 项目配置类
     */
    configure: Configure;

    /**
     * 是否忽略锁定
     */
    ignoreLock: boolean;

    /**
     * Factory解析器
     */
    factorier?: DbFactory;
    /**
     * Factory函数列表
     */
    factories: FactoryOptions;
}

/** ****************************** 数据填充Factory **************************** */
/**
 * Factory解析器
 */
export interface DbFactory {
    <Entity>(
        entity: EntityTarget<Entity>,
    ): <Options>(options?: Options) => DataFactory<Entity, Options>;
}

/**
 * Factory解析后的元数据
 */
export type DbFactoryOption<E, O> = {
    entity: ObjectType<E>;
    handler: DbFactoryHandler<E, O>;
};

/**
 * 数据填充函数映射对象
 */
export type FactoryOptions = {
    [entityName: string]: DbFactoryOption<any, any>;
};

/**
 * Factory处理器
 */
export type DbFactoryHandler<E, O> = (configure: Configure, options: O) => Promise<E>;

/**
 * Factory自定义参数覆盖
 */
export type FactoryOverride<Entity> = {
    [Property in keyof Entity]?: Entity[Property];
};

/**
 * Factory构造器
 */
export type DbFactoryBuilder = (
    configure: Configure,
    dataSource: DataSource,
    factories: {
        [entityName: string]: DbFactoryOption<any, any>;
    },
) => DbFactory;

/**
 * Factory定义器
 */
export type DefineFactory = <E, O>(
    entity: ObjectType<E>,
    handler: DbFactoryHandler<E, O>,
) => () => DbFactoryOption<E, O>;
