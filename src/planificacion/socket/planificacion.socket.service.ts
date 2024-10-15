import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { PlanificacionService } from '../rest/planificacion.service';
import { GetPlanificacionDto } from '../dto/rest/planificacion/get-planificacion.dto';
import { normalizeDates, weekDates } from 'src/utils';
import { PlanificacionSemanaDto } from '../dto/socket';
import { IPlanificacionSemanal } from '../interface/planificacion-semanal.interface';
import { SolicitudEnvio } from '../entities/solicitud-envio.entity';

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

    async notifySolicitudEnvio(solicitud: SolicitudEnvio) {
        if (this.wss) {
            this.wss.emit('loadSolicitud', solicitud);
        } else {
            console.error('WebSocket server not initialized - To emit solicitud has been created ');
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

    async getSolicitudEnCurso() {
        try {
            const solicitud = await this.planificacionService.getSolicitudEnCurso();
            return solicitud;
        } catch (error) {
            console.log('Error getSolicitudesEnCurso');
            return null;
        }
    }
    async getPlanificacionBySemana(planificacionSemanaDto: PlanificacionSemanaDto) {
        try {
            const { inicio, fin } = planificacionSemanaDto;

            const planificacionSemanal = await this.planificacionService.getPlanificacionBySemana(
                normalizeDates.normalize(inicio),
                normalizeDates.normalize(fin),
            );
            return planificacionSemanal;
        } catch (error) {
            console.log('Error getPlanificacionBySemana');
            return null;
        }
    }

    async notifyEnvioUpdate(fecha?: string) {
        if (this.wss) {
            let fechaActual = fecha;
            if (!fechaActual) {
                console.log('La fecha actual era nulla')
                fechaActual = normalizeDates.currentFecha();
            }
            const planificacion = await this.planificacionService.findByFecha({ fecha: fechaActual })
            this.wss.emit('loadPlanificacion', planificacion);
        } else {
            console.error('WebSocket server not initialized - To notify a envio has been started ');
            throw new BadRequestException();
        }
    }
}
