import { Bodega } from "../entities/bodega.entity";
// import { Categoria } from "../entities/categoria.entity";
import { Producto } from "../entities/producto.entity";
import { Ubicacion } from "../entities/ubicacion.entity";

export interface TandaCreateSchema {
    cantidadIngresada: number;
    cantidadActual: number,
    fechaVencimiento?: string;

    producto: Producto;

    bodega: Bodega;

    ubicacion: Ubicacion;

    // categoria: Categoria;
}