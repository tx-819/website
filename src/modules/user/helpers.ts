import bcrypt from 'bcrypt';

import { Configure } from '../config/configure';

import { getUserConfig } from './config';

/**
 * 加密明文密码
 * @param configure
 * @param password
 */
export const encrypt = async (configure: Configure, password: string) => {
    const hash = (await getUserConfig<number>(configure, 'hash')) || 10;
    return bcrypt.hashSync(password, hash);
};

/**
 * 验证密码
 * @param password
 * @param hashed
 */
export const decrypt = (password: string, hashed: string) => {
    return bcrypt.compareSync(password, hashed);
};
