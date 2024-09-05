export interface EnvioCategoriaResponseQuery {
    id: string
    isComplete: boolean;
    cantidadPlanificada: number;
    categoria: string
    categoriaId: string
    urlImagen: string
}


export interface EnvioResponseQuery {
    id: string;
    status: string;
    categoriasPlanificadas: EnvioCategoriaResponseQuery[],
    //TODO: Añadir el usuario que inicio el envio
}