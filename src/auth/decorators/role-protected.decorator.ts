import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces';

export const Meta_Roles = 'roles';

export const RoleProtected = (...args: ValidRoles[]) => {
    return SetMetadata(Meta_Roles, args);
};
