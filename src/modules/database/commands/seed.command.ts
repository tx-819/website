import { Arguments } from 'yargs';

import { CommandItem } from '@/modules/core/types';

import { SeedHandler } from './seed.handler';
import { SeederArguments } from './types';

/**
 * 数据填充命令
 */
export const SeedCommand: CommandItem<any, SeederArguments> = async ({ configure }) => ({
    command: ['db:seed', 'dbs'],
    describe: 'Runs all seeds data.',
    builder: {
        clear: {
            type: 'boolean',
            alias: 'r',
            describe: 'Clear which tables will truncated specified by seeder class.',
            default: true,
        },
        connection: {
            type: 'string',
            alias: 'c',
            describe: 'Connection name of typeorm to connect database.',
        },
        transaction: {
            type: 'boolean',
            alias: 't',
            describe: 'If is seed data in transaction,default is true',
            default: true,
        },
        ignorelock: {
            type: 'boolean',
            alias: 'i',
            describe: 'Ignore seed lock and reset all seeds, not do it in production',
            default: false,
        },
    } as const,

    handler: async (args: Arguments<SeederArguments>) => SeedHandler(configure, args),
});
