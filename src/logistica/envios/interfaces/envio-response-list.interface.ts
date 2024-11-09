interface ProductoOnEnvio {
    cantidad: number;
    producto: string;
    productoId: string;
    urlImagen: string;
}

interface EntregaResponse {
    comedorSolidario: string;
    comedorDireccion: string;
    realizador: string;
    realizadorId: string;
    productosEntregados: number;
}

interface IncidenteResponse {
    id: string;
    fecha: string;
    hora: string;
    descripcion: string;
    type: string;
    causeCloseEnvio: boolean;
    evidenciaFotograficaUrl?: string;
    productosAfectados: ProductoOnEnvio[]
}

interface EnvioResponseList {
    autorizante: string;
    solicitante: string;
    productos: ProductoOnEnvio[];
    entregas: EntregaResponse[];
    incidentes: IncidenteResponse[];
    // Otras propiedades según sea necesario
}