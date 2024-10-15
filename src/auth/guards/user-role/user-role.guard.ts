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
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const validRoles: string[] = this.reflector.get(
            Meta_Roles,
            context.getHandler(),
        );
        if (!validRoles || validRoles.length === 0) return true;

        const req = context.switchToHttp().getRequest();
        const user = req.user as User;

        if (!user) {
            throw new BadRequestException('User not found');
        }

        for (const role of user.roles) {
            if (validRoles.includes(role)) {
                return true;
            }
        }
        throw new ForbiddenException(`Rest-El usuario '${user.nombre} ${user.apellidoPaterno} ${user.apellidoMaterno}' necesita un rol permitido.`);
    }
}
