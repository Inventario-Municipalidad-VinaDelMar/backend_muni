import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

// export const middleWareSocketAuth = async (socket: Socket, next: (err?: ExtendedError) => void, jwtService: JwtService) => {
//     const token = socket.handshake.headers['authentication'] as string;

//     if (!token) {
//         return next(new UnauthorizedException('Token not provided'));
//     }

//     try {
//         const decoded = jwtService.verify(token);
//         const user = await this.userRepository.findOne({ where: { id: decoded.id } });

//         if (!user) {
//             throw new UnauthorizedException('Token not valid');
//         }

//         if (!user.isActive) {
//             throw new UnauthorizedException('Usuario inactivo, hable con un administrador.');
//         }
//         socket.data.user = decoded; // Guardamos los datos del usuario en el socket
//         // console.log(`Socket-Conexion con: ${JSON.stringify(user.nombre)} ${JSON.stringify(user.apellidoPaterno)}`);
//         next(); // Permitir la conexión
//     } catch (error) {
//         return next(new UnauthorizedException('Token not valid'));
//     }
// }

@Injectable()
export class MiddleWareWs {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async socketAuth(socket: Socket, next: (err?: ExtendedError) => void) {
        const token = socket.handshake.headers['authentication'] as string;

        if (!token) {
            return next(new UnauthorizedException('Token not provided'));
        }

        try {
            const decoded = this.jwtService.verify(token);
            const user = await this.userRepository.findOne({ where: { id: decoded.id } });

            if (!user) {
                throw new UnauthorizedException('Token not valid');
            }

            if (!user.isActive) {
                throw new UnauthorizedException('Usuario inactivo, hable con un administrador.');
            }
            socket.data.user = decoded; // Guardamos los datos del usuario en el socket
            // console.log(`Socket-Conexion con: ${JSON.stringify(user.nombre)} ${JSON.stringify(user.apellidoPaterno)}`);
            next(); // Permitir la conexión
        } catch (error) {
            return next(new UnauthorizedException('Token not valid'));
        }
    }

}
