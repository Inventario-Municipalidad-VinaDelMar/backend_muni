
interface SeedBodega {
    nombre: string;
    direccion: string;
    nombreEncargado: string;
}

interface SeedUser {
    email: string;
    password: string;

    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    rut: string;
    roles?: string[];
}

interface SeedUbicacion {
    descripcion: string;
    // idBodega: string;
}
interface SeedProducto {
    nombre: string;
    descripcion: string;
    urlImagen?: string;
}

interface SeedTanda {
    cantidadIngresada: number;
    fechaVencimiento?: string;
    productoNombre: string;
    bodegaNombre: string;
    ubicacionNombre: string;
}

interface SeedPlanificacionDetalle {
    cantidadPlanificada: number;
    producto: string;
}
export interface SeedPlanificacion {
    fecha: string;
    detalles: SeedPlanificacionDetalle[];
}

interface SeedData {
    users: SeedUser[];
    planificaciones: SeedPlanificacion[];
    //inventario
    ubicaciones: SeedUbicacion[];
    bodegas: SeedBodega[];
    productos: SeedProducto[];
    tandas: SeedTanda[];
}

export const initialData: SeedData = {
    users: [
        { email: 'cristobal@gmail.com', password: 'Abc12345', nombre: 'Cristobal', apellidoPaterno: 'Herrera', apellidoMaterno: 'Rojas', rut: '20440649-9', roles: ['administrador'] },
        { email: 'mangini@gmail.com', password: 'Abc12345', nombre: 'Franco', apellidoPaterno: 'Mangini', apellidoMaterno: 'Tapia', rut: '20175289-2', roles: ['administrador'] },
        { email: 'diego@gmail.com', password: 'Abc12345', nombre: 'Diego', apellidoPaterno: 'Hidalgo', apellidoMaterno: 'Carvajal', rut: '21069070-0', roles: ['administrador'] },
        { email: 'renato@gmail.com', password: 'Abc12345', nombre: 'Renato', apellidoPaterno: 'Plaza', apellidoMaterno: 'Diaz', rut: '20482871-7' },
    ],
    planificaciones: [
        {
            fecha: '',
            // fecha: '2024-09-30',
            detalles: [
                { cantidadPlanificada: 10, producto: 'Fideos Corbatas Carozzi' },
                { cantidadPlanificada: 100, producto: 'Pan de Molde' },
                { cantidadPlanificada: 25, producto: 'Jugo de Naranja' },
                { cantidadPlanificada: 150, producto: 'Tenedor de Mesa' },
            ]
        },
        {
            fecha: '',
            // fecha: '2024-10-1',
            detalles: [
                { cantidadPlanificada: 30, producto: 'Fideos Corbatas Carozzi' },
                { cantidadPlanificada: 100, producto: 'Sanwich' },
                { cantidadPlanificada: 25, producto: 'Agua Mineral' },
                { cantidadPlanificada: 150, producto: 'Tenedor de Mesa' },
            ]
        },
        {
            fecha: '',
            // fecha: '2024-10-2',
            detalles: [
                { cantidadPlanificada: 15, producto: 'Arroz Largo Fino' },
                { cantidadPlanificada: 88, producto: 'Sanwich' },
                { cantidadPlanificada: 25, producto: 'Jugo de Naranja' },
                { cantidadPlanificada: 150, producto: 'Tenedor de Mesa' },
            ]
        },
        {
            fecha: '',
            // fecha: '2024-10-3',
            detalles: [
                { cantidadPlanificada: 10, producto: 'Garbanzos' },
                { cantidadPlanificada: 90, producto: 'Pan de Molde' },
                { cantidadPlanificada: 20, producto: 'Jugo de Naranja' },
                { cantidadPlanificada: 100, producto: 'Cuchara de Mesa' },
            ]
        },
        {
            fecha: '',
            // fecha: '2024-10-4',
            detalles: [
                { cantidadPlanificada: 10, producto: 'Fideos Corbatas Carozzi' },
                { cantidadPlanificada: 100, producto: 'Pan de Molde' },
                { cantidadPlanificada: 33, producto: 'Agua Mineral' },
                { cantidadPlanificada: 109, producto: 'Tenedor de Mesa' },
                { cantidadPlanificada: 30, producto: 'Leche Entera' },
            ]
        },
    ],
    bodegas: [
        { nombre: 'Bodega A', direccion: 'Miraflores Centro', nombreEncargado: 'Franco Mangini' }
    ],

    ubicaciones: [
        { descripcion: 'Rack Rojo, Piso 1' },
        { descripcion: 'Rack Rojo, Piso 2' },
        { descripcion: 'Rack Rojo, Piso 3' },
        { descripcion: 'Rack Azul, Piso 1' },
        { descripcion: 'Rack Azul, Piso 2' },
        { descripcion: 'Rack Azul, Piso 3' },
        { descripcion: 'Almacenaje Centro bodega' },
        { descripcion: 'Sector A' },
        { descripcion: 'Sector B' },
        { descripcion: 'Sector C' },
    ],
    productos: [
        // Fideos
        {
            nombre: 'Fideos Corbatas Carozzi',
            descripcion: 'Fideos en forma de corbata, ideales para ensaladas y platos fríos.',
            urlImagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhWSwLF3tf5H44P_3ncSzPV6Vou4nW4yGPEg&s',

        },
        {
            nombre: 'Fideos Spaghetti Carozzi',
            descripcion: 'Fideos largos y delgados, perfectos para acompañar con salsas.',
            urlImagen: 'https://cdnx.jumpseller.com/serviceshop/image/7953630/Fideos_Spaguetti_N__5__1_Kg_Carozzi.jpg?1655730359',

        },

        // Arroz
        {
            nombre: 'Arroz Largo Fino',
            descripcion: 'Arroz de grano largo, ideal para guarniciones y ensaladas.',
            urlImagen: 'https://comedera.com/wp-content/uploads/sites/9/2019/11/arroz-blanco-cocido.jpg?w=500&h=375&crop=1',

        },
        {
            nombre: 'Arroz Integral',
            descripcion: 'Arroz con cáscara conservada, rico en fibra y nutrientes.',
            urlImagen: 'https://assets.tmecosys.com/image/upload/t_web767x639/img/recipe/ras/Assets/a0426521-e822-4653-b77e-a83670388cd9/Derivates/2ee94377-3c62-42a7-b36f-b40e587e6bd3.jpg',

        },

        // Legumbres
        {
            nombre: 'Lentejas',
            descripcion: 'Legumbres ricas en proteínas y fibra, ideales para sopas y guisos.',
            urlImagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsqTDVZEVxuc-4gmSXtpCZlbV7n1jxpmV47w&s',

        },
        {
            nombre: 'Garbanzos',
            descripcion: 'Legumbres versátiles para hummus, ensaladas y guisos.',
            urlImagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjzteU5TuAxa2c8jJ_xjYqn5F5WawQkAQFoA&s',

        },

        // Frutas
        {
            nombre: 'Manzanas',
            descripcion: 'Frutas frescas y crujientes, perfectas para comer solas o en ensaladas.',
            urlImagen: 'https://5aldia.cl/wp-content/uploads/2018/03/manzana.jpg',

        },
        {
            nombre: 'Bananas',
            descripcion: 'Frutas dulces y nutritivas, ricas en potasio.',
            urlImagen: 'https://images.immediate.co.uk/production/volatile/sites/30/2017/01/Bunch-of-bananas-67e91d5.jpg?quality=90&resize=440,400',

        },

        // Verduras
        {
            nombre: 'Zanahorias',
            descripcion: 'Verduras ricas en betacaroteno, ideales para ensaladas y cocidos.',
            urlImagen: 'https://5aldia.cl/wp-content/uploads/2018/03/zanahoria.jpg',

        },
        {
            nombre: 'Papas',
            descripcion: 'Tubérculos versátiles para puré, fritas o cocidas.',
            urlImagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrSkZPW6XLWrKft-iwB5D7Ime-3pxRPixuXg&s',

        },

        // Cubiertos
        {
            nombre: 'Cuchillo de Mesa',
            descripcion: 'Cuchillo básico para cortar alimentos en la mesa.',
            urlImagen: 'https://steward.cl/10311-large_default/set-12-cuchillo-mesa-celebration-inox-180.jpg',

        },
        {
            nombre: 'Tenedor de Mesa',
            descripcion: 'Tenedor estándar para comidas.',
            urlImagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtYbvKbAjm3n8-1l_RAcddQ17MxWm5qU1kMA&s',

        },
        {
            nombre: 'Cuchara de Mesa',
            descripcion: 'Cuchara estándar para comidas liquidas.',
            urlImagen: 'https://cdnx.jumpseller.com/santa-mariana/image/7682407/resize/610/610?1609339753',

        },

        // Limpiezas
        {
            nombre: 'Detergente Líquido',
            descripcion: 'Detergente líquido para lavar ropa y vajilla.',
            urlImagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpsY5OeGT095gGI7r6fy81Uk1rX9GxkSnJJQ&s',

        },
        {
            nombre: 'Esponja de Cocina',
            descripcion: 'Esponja suave y resistente para lavar platos y utensilios.',
            urlImagen: 'https://rgc.cl/wp-content/uploads/2023/06/esponja-acanalada-con-fibra-abrasiva-600x630-1.jpg',

        },

        // Lácteos
        {
            nombre: 'Leche Entera',
            descripcion: 'Leche fresca y entera, rica en calcio y vitaminas.',
            urlImagen: 'https://jumbo.vteximg.com.br/arquivos/ids/687146/Leche-entera-1-L.jpg?v=638240207835200000',

        },
        {
            nombre: 'Queso',
            descripcion: 'Queso madurado, ideal para sándwiches y platos horneados.',
            urlImagen: 'https://alvicl.vtexassets.com/arquivos/ids/157080/Queso-gauda-laminado.jpg?v=637868443541230000',

        },

        // Bebidas
        {
            nombre: 'Jugo de Naranja',
            descripcion: 'Jugo natural de naranja, rico en vitamina C.',
            urlImagen: 'https://tost.cl/cdn/shop/files/20JUX01_1_1200x.jpg?v=1721845283',

        },
        {
            nombre: 'Agua Mineral',
            descripcion: 'Agua mineral embotellada, ideal para hidratarse.',
            urlImagen: 'https://santaisabel.vtexassets.com/arquivos/ids/175921/Agua-Mineral-sin-Gas-Vital-990-ml.jpg?v=637602368673430000',

        },

        // Panadería
        {
            nombre: 'Pan de Molde',
            descripcion: 'Pan suave y esponjoso, perfecto para tostadas y sándwiches.',
            urlImagen: 'https://jumbo.vtexassets.com/arquivos/ids/682957/Pan-de-molde-blanco-sandwich-700-g.jpg?v=638236666659500000',

        },
        {
            nombre: 'Sanwich',
            descripcion: 'Ideal para desayunos y meriendas.',
            urlImagen: 'https://www.gob.mx/cms/uploads/image/file/761647/WhatsApp_Image_2022-11-01_at_2.23.08_PM.jpeg',

        },
    ],

    tandas: [
        // Fideos

        { cantidadIngresada: 200, fechaVencimiento: '2024-11-01', productoNombre: 'Fideos Corbatas Carozzi', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-11-05', productoNombre: 'Fideos Corbatas Carozzi', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-11-10', productoNombre: 'Fideos Corbatas Carozzi', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-11-15', productoNombre: 'Fideos Corbatas Carozzi', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-11-20', productoNombre: 'Fideos Corbatas Carozzi', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },

        { cantidadIngresada: 200, fechaVencimiento: '2024-11-01', productoNombre: 'Fideos Spaghetti Carozzi', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-11-05', productoNombre: 'Fideos Spaghetti Carozzi', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-11-10', productoNombre: 'Fideos Spaghetti Carozzi', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-11-15', productoNombre: 'Fideos Spaghetti Carozzi', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-11-20', productoNombre: 'Fideos Spaghetti Carozzi', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },
        // Arroz
        { cantidadIngresada: 200, fechaVencimiento: '2024-11-01', productoNombre: 'Arroz Largo Fino', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-11-05', productoNombre: 'Arroz Largo Fino', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-11-10', productoNombre: 'Arroz Largo Fino', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-11-15', productoNombre: 'Arroz Largo Fino', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-11-20', productoNombre: 'Arroz Largo Fino', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },

        { cantidadIngresada: 200, fechaVencimiento: '2024-11-01', productoNombre: 'Arroz Integral', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-11-05', productoNombre: 'Arroz Integral', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-11-10', productoNombre: 'Arroz Integral', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-11-15', productoNombre: 'Arroz Integral', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-11-20', productoNombre: 'Arroz Integral', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },
        // Legumbres
        { cantidadIngresada: 200, fechaVencimiento: '2024-11-01', productoNombre: 'Lentejas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-11-05', productoNombre: 'Lentejas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-11-10', productoNombre: 'Lentejas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-11-15', productoNombre: 'Lentejas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-11-20', productoNombre: 'Lentejas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },

        { cantidadIngresada: 200, fechaVencimiento: '2024-11-01', productoNombre: 'Garbanzos', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-11-05', productoNombre: 'Garbanzos', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-11-10', productoNombre: 'Garbanzos', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-11-15', productoNombre: 'Garbanzos', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-11-20', productoNombre: 'Garbanzos', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },
        // Frutas
        { cantidadIngresada: 200, fechaVencimiento: '2024-11-01', productoNombre: 'Manzanas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-11-05', productoNombre: 'Manzanas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-11-10', productoNombre: 'Manzanas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-11-15', productoNombre: 'Manzanas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-11-20', productoNombre: 'Manzanas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },

        { cantidadIngresada: 200, fechaVencimiento: '2024-11-01', productoNombre: 'Bananas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-11-05', productoNombre: 'Bananas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-11-10', productoNombre: 'Bananas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-11-15', productoNombre: 'Bananas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-11-20', productoNombre: 'Bananas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },
        // Verduras   
        { cantidadIngresada: 200, fechaVencimiento: '2024-11-01', productoNombre: 'Zanahorias', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-11-05', productoNombre: 'Zanahorias', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-11-10', productoNombre: 'Zanahorias', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-11-15', productoNombre: 'Zanahorias', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-11-20', productoNombre: 'Zanahorias', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },

        { cantidadIngresada: 200, fechaVencimiento: '2024-11-01', productoNombre: 'Papas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-11-05', productoNombre: 'Papas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-11-10', productoNombre: 'Papas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-11-15', productoNombre: 'Papas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-11-20', productoNombre: 'Papas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },
        // Cubiertos
        { cantidadIngresada: 200, fechaVencimiento: null, productoNombre: 'Cuchillo de Mesa', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: null, productoNombre: 'Cuchillo de Mesa', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: null, productoNombre: 'Cuchillo de Mesa', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: null, productoNombre: 'Cuchillo de Mesa', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: null, productoNombre: 'Cuchillo de Mesa', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },

        { cantidadIngresada: 200, fechaVencimiento: null, productoNombre: 'Tenedor de Mesa', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: null, productoNombre: 'Tenedor de Mesa', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: null, productoNombre: 'Tenedor de Mesa', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: null, productoNombre: 'Tenedor de Mesa', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: null, productoNombre: 'Tenedor de Mesa', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },

        { cantidadIngresada: 200, fechaVencimiento: null, productoNombre: 'Cuchara de Mesa', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: null, productoNombre: 'Cuchara de Mesa', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: null, productoNombre: 'Cuchara de Mesa', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: null, productoNombre: 'Cuchara de Mesa', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: null, productoNombre: 'Cuchara de Mesa', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },
        // Limpiezas
        { cantidadIngresada: 200, fechaVencimiento: '2024-11-01', productoNombre: 'Detergente Líquido', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-11-05', productoNombre: 'Detergente Líquido', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-11-10', productoNombre: 'Detergente Líquido', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-11-15', productoNombre: 'Detergente Líquido', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-11-20', productoNombre: 'Detergente Líquido', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },

        { cantidadIngresada: 200, fechaVencimiento: null, productoNombre: 'Esponja de Cocina', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: null, productoNombre: 'Esponja de Cocina', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: null, productoNombre: 'Esponja de Cocina', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: null, productoNombre: 'Esponja de Cocina', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: null, productoNombre: 'Esponja de Cocina', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },
        // Lácteos
        { cantidadIngresada: 200, fechaVencimiento: '2024-11-01', productoNombre: 'Leche Entera', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-11-05', productoNombre: 'Leche Entera', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-11-10', productoNombre: 'Leche Entera', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-11-15', productoNombre: 'Leche Entera', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-11-20', productoNombre: 'Leche Entera', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },

        { cantidadIngresada: 200, fechaVencimiento: '2024-11-01', productoNombre: 'Queso', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-11-05', productoNombre: 'Queso', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-11-10', productoNombre: 'Queso', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-11-15', productoNombre: 'Queso', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-11-20', productoNombre: 'Queso', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },
        // Bebidas
        { cantidadIngresada: 200, fechaVencimiento: '2024-11-01', productoNombre: 'Jugo de Naranja', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-11-05', productoNombre: 'Jugo de Naranja', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-11-10', productoNombre: 'Jugo de Naranja', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-11-15', productoNombre: 'Jugo de Naranja', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-11-20', productoNombre: 'Jugo de Naranja', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },

        { cantidadIngresada: 200, fechaVencimiento: '2024-11-01', productoNombre: 'Agua Mineral', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-11-05', productoNombre: 'Agua Mineral', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-11-10', productoNombre: 'Agua Mineral', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-11-15', productoNombre: 'Agua Mineral', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-11-20', productoNombre: 'Agua Mineral', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },
        // Panadería

        { cantidadIngresada: 200, fechaVencimiento: '2024-11-01', productoNombre: 'Pan de Molde', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-11-05', productoNombre: 'Pan de Molde', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-11-10', productoNombre: 'Pan de Molde', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-11-15', productoNombre: 'Pan de Molde', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-11-20', productoNombre: 'Pan de Molde', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },

        { cantidadIngresada: 200, fechaVencimiento: '2024-11-01', productoNombre: 'Sanwich', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-11-05', productoNombre: 'Sanwich', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-11-10', productoNombre: 'Sanwich', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-11-15', productoNombre: 'Sanwich', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-11-20', productoNombre: 'Sanwich', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },
    ]



}

