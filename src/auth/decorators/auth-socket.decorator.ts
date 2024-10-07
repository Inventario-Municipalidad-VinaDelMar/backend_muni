import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthSocketGuard } from '../guards/socket/jwt-auth-socket.guard';
import { RoleProtected } from './role-protected.decorator';
import { ValidRoles } from '../interfaces';
import { UserRoleSocketGuard } from '../guards/user-role/user-role-socket.guard';

export function AuthSocket(...roles: ValidRoles[]) {
    return applyDecorators(
        RoleProtected(...roles),
        UseGuards(JwtAuthSocketGuard),
        UseGuards(UserRoleSocketGuard),
    );
}
