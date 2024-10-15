import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Meta_Roles } from '../../decorators/role-protected.decorator';

@Injectable()
export class UserRoleSocketGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const validRoles: string[] = this.reflector.get(
            Meta_Roles,
            context.getHandler(),
        );
        if (!validRoles || validRoles.length === 0) return true;

        const client = context.switchToWs().getClient();
        const user = client.data.user;  // Access user from socket data

        if (!user) {
            throw new BadRequestException('User not found');
        }

        for (const role of user.roles) {
            if (validRoles.includes(role)) {
                return true;
            }
        }
        throw new ForbiddenException(`Socket-El usuario '${user.nombre} ${user.apellidoPaterno} ${user.apellidoMaterno}' necesita un rol permitido.`);
    }
}
