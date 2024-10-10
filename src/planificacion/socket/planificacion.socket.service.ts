import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { PlanificacionService } from '../rest/planificacion.service';
import { GetPlanificacionDto } from '../dto/rest/planificacion/get-planificacion.dto';
import { normalizeDates, weekDates } from 'src/utils';
import { PlanificacionSemanaDto } from '../dto/socket';
import { IPlanificacionSemanal } from '../interface/planificacion-semanal.interface';

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

    async notifyPlanificacionSemanalUpdate(planificacionSemanal: IPlanificacionSemanal[]) {
        if (this.wss) {
            const fecha = normalizeDates.normalize(planificacionSemanal[0].fecha);
            const { start, end } = weekDates.getStartAndEndOfWeek(fecha);
            const room = `planificacion-${start}-${end}`;
            console.log({ room })
            this.wss.to(room).emit('loadAdminPlanificacionManage', planificacionSemanal);
        } else {
            console.error('WebSocket server not initialized - To emit planificacion semanal update ');
            throw new BadRequestException();
        }
    }

    async getPlanificacionByFecha(getPlanificacionDto: GetPlanificacionDto) {
        if (this.wss) {
            const planificacion = await this.planificacionService.findByFecha(getPlanificacionDto)
            return planificacion;
        } else {
            console.error('WebSocket server not initialized - To emit planificacion ');
            throw new BadRequestException();
        }
    }

    async getPlanificacionBySemana(planificacionSemanaDto: PlanificacionSemanaDto) {
        const { inicio, fin } = planificacionSemanaDto;

        const planificacionSemanal = await this.planificacionService.getPlanificacionBySemana(
            normalizeDates.normalize(inicio),
            normalizeDates.normalize(fin),
        );
        return planificacionSemanal;
    }

    async notifyEnvioUpdate() {
        if (this.wss) {
            const fechaActual = normalizeDates.currentFecha();
            const planificacion = await this.planificacionService.findByFecha({ fecha: fechaActual })
            this.wss.emit('loadPlanificacion', planificacion);
        } else {
            console.error('WebSocket server not initialized - To notify a envio has been started ');
            throw new BadRequestException();
        }
    }
}
