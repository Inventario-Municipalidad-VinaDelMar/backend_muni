

export interface MovimientoResponse {
    id: string;
    cantidadRetirada: number;
    fecha: Date;
    hora: string;
    producto: string;
    productoId: string;
    envioId?: string;
}