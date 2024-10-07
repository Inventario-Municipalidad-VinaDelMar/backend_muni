import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

export const middleWareSocketAuth = (socket: Socket, next: (err?: ExtendedError) => void, jwtService: JwtService) => {

    const token = socket.handshake.headers['authentication'] as string;

    if (!token) {
        return next(new UnauthorizedException('Token not provided'));
    }

    try {
        const decoded = jwtService.verify(token);
        socket.data.user = decoded; // Guardamos los datos del usuario en el socket
        next(); // Permitir la conexión
    } catch (error) {
        return next(new UnauthorizedException('Token not valid'));
    }
}
