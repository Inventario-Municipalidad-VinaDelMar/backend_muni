import {
    ExecutionContext,
    InternalServerErrorException,
    createParamDecorator,
} from '@nestjs/common';
import { User } from '../entities/user.entity';

export const GetUserWs = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const client = ctx.switchToWs().getClient(); // Obtén el cliente del contexto de WebSocket
        const user = client.data.user as User; // Asegúrate de que el usuario esté almacenado en el cliente

        if (!user) {
            throw new InternalServerErrorException('Usuario no encontrado (request SOCKET)');
        }

        return !data ? user : user[data];
    },
);
