
export interface TandaResponse {
    id: string;

    //relaciones
    bodega: string;
    producto: string;
    ubicacion: string;
    productoId: string;
    //propiedades
    cantidadIngresada: number;
    cantidadActual: number;
    fechaLlegada: Date;
    fechaVencimiento: Date;
}