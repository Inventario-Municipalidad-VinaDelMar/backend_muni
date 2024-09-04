import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { PlanificacionService } from '../rest/planificacion.service';
import { GetPlanificacionDto } from '../dto/rest/planificacion/get-planificacion.dto';

@Injectable()
export class PlanificacionSocketService {
    private wss: Server;
    setServer(server: Server) {
        this.wss = server;
    }
    constructor(
        @Inject(forwardRef(() => PlanificacionService))
        private readonly planificacionService: PlanificacionService,
    ) { }


    async getPlanificacionByFecha(getPlanificacionDto: GetPlanificacionDto) {
        if (this.wss) {
            const planificacion = await this.planificacionService.findByFecha(getPlanificacionDto)
            return planificacion;
        } else {
            console.error('WebSocket server not initialized - To emit planificacion ');
            throw new BadRequestException();
        }
    }

    async notifyStartedNewEnvio(fecha: string) {
        if (this.wss) {
            const planificacion = await this.planificacionService.findByFecha({ fecha })
            this.wss.emit('loadPlanificacion', planificacion);
        } else {
            console.error('WebSocket server not initialized - To notify a envio has been started ');
            throw new BadRequestException();
        }
    }
}
