import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtAuthSocketGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client = context.switchToWs().getClient();
        const token = client.handshake.headers['authentication'];
        if (!token) {
            throw new UnauthorizedException('Token not provided');
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

            client.data.user = user;  // Attach full user information to the socket instance
            // console.log(`Socket-Solicitud por: ${user.nombre} ${user.apellidoPaterno}`);
            return true;
        } catch (error) {
            throw new UnauthorizedException('Token not valid');
        }
    }
}
