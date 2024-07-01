import { Entity, ManyToOne, OneToOne } from 'typeorm';
import type { Relation } from 'typeorm';

import { BaseToken } from './base.token';
import { RefreshTokenEntity } from './refresh-token.entity';
import { UserEntity } from './user.entity';

/**
 * 用户认证token模型
 */
@Entity('user_access_tokens')
export class AccessTokenEntity extends BaseToken {
    /**
     * 关联的刷新令牌
     */
    @OneToOne(() => RefreshTokenEntity, (refreshToken) => refreshToken.accessToken, {
        cascade: true,
    })
    refreshToken: RefreshTokenEntity;

    /**
     * 所属用户
     */
    @ManyToOne((type) => UserEntity, (user) => user.accessTokens, {
        onDelete: 'CASCADE',
    })
    user: Relation<UserEntity>;
}
