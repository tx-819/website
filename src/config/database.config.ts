import { toNumber } from 'lodash';

import { ContentFactory } from '@/database/factories/content.factory';
import ContentSeeder from '@/database/seeders/content.seeder';
import UserSeeder from '@/database/seeders/user.seeder';
import { createDbConfig } from '@/modules/database/config';

import { UserFactory } from '../database/factories/user.factory';

export const database = createDbConfig((configure) => ({
    common: {
        synchronize: true,
    },
    connections: [
        {
            // 以下为mysql配置
            type: 'mysql',
            host: configure.env.get('DB_HOST', '127.0.0.1'),
            port: configure.env.get('DB_PORT', (v) => toNumber(v), 3306),
            username: configure.env.get('DB_USERNAME', 'root'),
            password: configure.env.get('DB_PASSWORD', ''),
            database: configure.env.get('DB_NAME', '3rapp'),
            factories: [UserFactory, ContentFactory],
            seeders: [UserSeeder, ContentSeeder],
        },
        // {
        // 以下为sqlite配置
        // type: 'better-sqlite3',
        // database: resolve(__dirname, configure.env.get('DB_PATH', '../../database.db')),
        // },
    ],
}));
