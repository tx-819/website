/**
 * 用户列表查询排序方式
 */
export enum UserOrderType {
    CREATED = 'createdAt',
    UPDATED = 'updatedAt',
}

/**
 * 用户请求DTO验证组
 */
export enum UserValidateGroups {
    USER_CREATE = 'user-create',
    USER_UPDATE = 'user-update',
    USER_REGISTER = 'user-register',
    ACCOUNT_UPDATE = 'account-update',
    CHANGE_PASSWORD = 'change-password',
}

export const ALLOW_GUEST = 'allowGuest';
