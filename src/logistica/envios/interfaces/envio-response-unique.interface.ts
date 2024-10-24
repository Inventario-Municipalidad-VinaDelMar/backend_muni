import { MovimientoResponse } from "src/movimientos/interfaces/movimiento_response.interface";
import { EnvioStatus } from "../entities/envio.entity";
import { User } from "src/auth/entities/user.entity";

export interface EntregaEnvio {
    id: string;
    fecha: string;
    hora: string;
    comedorSolidario: string;
    comedorSolidarioId: string;
    urlActaLegal?: string;
    copiloto: User;
    productosEntregados: ProductoOnEnvio[];
}

export interface ProductoOnEnvio {
    producto: string;
    productoId: string;
    cantidad: number;
    urlImagen: string;
}



export interface EnvioResponseUnique {
    id: string;
    fecha: Date;
    horaInicio: string;
    horaFinalizacion?: string;
    //Quien inicio la creacion del envio
    solicitante: User,
    //Quien aprobo la creacion del envio
    administrador: User,
    status: EnvioStatus;
    movimientos: MovimientoResponse[];
    entregas: EntregaEnvio[];
    cargaInicial: ProductoOnEnvio[];
    cargaActual: ProductoOnEnvio[];
}