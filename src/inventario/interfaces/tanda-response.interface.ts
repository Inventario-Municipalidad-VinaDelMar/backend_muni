
export interface TandaResponse {
    id: string;

    //relaciones
    bodega: string;
    ubicacion: string;
    producto: string;
    productoId: string;
    //propiedades
    cantidadIngresada: number;
    cantidadActual: number;
    fechaLlegada: Date;
    fechaVencimiento?: Date;
}