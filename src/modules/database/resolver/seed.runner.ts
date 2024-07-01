import { writeFileSync } from 'fs';
import { resolve } from 'path';

import { Type } from '@nestjs/common';
import { ensureFileSync, readFileSync } from 'fs-extra';

import { get, isNil, set } from 'lodash';
import { DataSource, EntityManager } from 'typeorm';

import YAML from 'yaml';

import { BaseSeeder } from '../base/seeder';
import { DbFactory } from '../commands/types';

/**
 * 默认的Seed Runner
 */
export class SeedRunner extends BaseSeeder {
    /**
     * 运行一个连接的填充类
     * @param _factory
     * @param _dataSource
     * @param _em
     */
    async run(_factory: DbFactory, _dataSource: DataSource, _em: EntityManager): Promise<any> {
        let seeders: Type<any>[] = ((await this.getDbConfig()) as any).seeders ?? [];
        const seedLockFile = resolve(__dirname, '../../../..', 'seed-lock.yml');
        ensureFileSync(seedLockFile);
        const yml = YAML.parse(readFileSync(seedLockFile, 'utf8'));
        const locked = isNil(yml) ? {} : yml;
        const lockNames = get<string[]>(locked, this.connection, []);
        if (!this.ignoreLock) {
            seeders = seeders.filter((s) => !lockNames.includes(s.name));
        }
        for (const seeder of seeders) {
            await this.call(seeder);
        }
        set(
            locked,
            this.connection,
            !this.ignoreLock
                ? [...lockNames, ...seeders.map((s) => s.name)]
                : seeders.map((s) => s.name),
        );
        writeFileSync(seedLockFile, JSON.stringify(locked, null, 4));
    }
}
