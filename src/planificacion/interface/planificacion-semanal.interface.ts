export interface IPlanificacionSemanal {
    id: string;
    fecha: string;
    detalles: IDetalle[];
}

export interface IDetalle {
    id: string;
    producto: string;
    productoId: string;
    cantidadPlanificada: number;
}
