
interface SeedBodega {
    nombre: string;
    direccion: string;
    nombreEncargado: string;
}
interface SeedCategoria {
    nombre: string;
    urlImagen: string;
}
interface SeedUbicacion {
    descripcion: string;
    // idBodega: string;
}
interface SeedProducto {
    nombre: string;
    descripcion: string;
    urlImagen?: string;
    categoriaNombre: string;
    // idCategoria: string;
}
interface SeedTanda {
    cantidadIngresada: number;
    fechaVencimiento: string;
    productoNombre: string;
    categoriaNombre: string;
    bodegaNombre: string;
    ubicacionNombre: string;
    // idCategoria: string;
    // idBodega: string;
    // idProducto: string;
    // idUbicacion: string;
}

interface SeedPlanificacionDetalle {
    cantidadPlanificada: number;
    categoria: string;
}
interface SeedPlanificacion {
    fecha: string;
    detalles: SeedPlanificacionDetalle[];
}

interface SeedData {
    planificaciones: SeedPlanificacion[];
    //inventario
    ubicaciones: SeedUbicacion[];
    categorias: SeedCategoria[];
    bodegas: SeedBodega[];
    productos: SeedProducto[];
    tandas: SeedTanda[];
}

export const initialData: SeedData = {
    planificaciones: [
        {
            fecha: '2024-09-02',
            detalles: [
                { cantidadPlanificada: 10, categoria: 'Fideos' },
                { cantidadPlanificada: 100, categoria: 'Panadería' },
                { cantidadPlanificada: 25, categoria: 'Bebidas' },
                { cantidadPlanificada: 150, categoria: 'Cubiertos' },
            ]
        },
        {
            fecha: '2024-09-03',
            detalles: [
                { cantidadPlanificada: 30, categoria: 'Fideos' },
                { cantidadPlanificada: 100, categoria: 'Panadería' },
                { cantidadPlanificada: 25, categoria: 'Bebidas' },
                { cantidadPlanificada: 150, categoria: 'Cubiertos' },
            ]
        },
        {
            fecha: '2024-09-04',
            detalles: [
                { cantidadPlanificada: 15, categoria: 'Arroz' },
                { cantidadPlanificada: 88, categoria: 'Panadería' },
                { cantidadPlanificada: 25, categoria: 'Bebidas' },
                { cantidadPlanificada: 150, categoria: 'Cubiertos' },
            ]
        },
        {
            fecha: '2024-09-05',
            detalles: [
                { cantidadPlanificada: 10, categoria: 'Legumbres' },
                { cantidadPlanificada: 90, categoria: 'Panadería' },
                { cantidadPlanificada: 20, categoria: 'Bebidas' },
                { cantidadPlanificada: 100, categoria: 'Cubiertos' },
            ]
        },
        {
            fecha: '2024-09-06',
            detalles: [
                { cantidadPlanificada: 10, categoria: 'Fideos' },
                { cantidadPlanificada: 100, categoria: 'Panadería' },
                { cantidadPlanificada: 33, categoria: 'Bebidas' },
                { cantidadPlanificada: 109, categoria: 'Cubiertos' },
                { cantidadPlanificada: 30, categoria: 'Lacteos' },
            ]
        },
    ],
    bodegas: [
        { nombre: 'Bodega A', direccion: 'Miraflores Centro', nombreEncargado: 'Franco Mangini' }
    ],
    categorias: [
        { nombre: 'Fideos', urlImagen: 'https://www.seidlaboratory.com.ec/wp-content/uploads/elementor/thumbs/shutterstock_289384985-1gg-qcpocbo1h7mvwn6c3wr4na3j5sl1re7qb71ap0fsus.jpg' },
        { nombre: 'Arroz', urlImagen: 'https://www.lafallera.es/wp-content/uploads/2023/04/Coccio%CC%81n-para-el-arroz-largo-pasos-y-trucos.jpg' },
        { nombre: 'Legumbres', urlImagen: 'https://i.blogs.es/23a158/legumbres/450_1000.jpg' },
        { nombre: 'Frutas', urlImagen: 'https://s1.abcstatics.com/abc/www/multimedia/ciencia/2023/03/31/frutas-kfNH-RL11aJz79VzsPThFeaE6g5L-1200x840@abc.jpg' },
        { nombre: 'Verduras', urlImagen: 'https://s2.abcstatics.com/abc/www/multimedia/bienestar/2024/04/30/verduras-pocas-calorias-R3Vfbjx9Nok0nxp9QObH7xH-1200x840@diario_abc.jpg' },
        { nombre: 'Cubiertos', urlImagen: 'https://eurohome.cl/cdn/shop/products/0302.914-5_1800x.jpg?v=1637683715' },
        { nombre: 'Limpiezas', urlImagen: 'https://img.freepik.com/fotos-premium/productos-limpieza-hogar_863013-118483.jpg' },
        { nombre: 'Lacteos', urlImagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSd0mC4D1jBdvVqztgmqI9vETiNwTx94Q4gA&s' },
        { nombre: 'Bebidas', urlImagen: 'https://www.dietdoctor.com/wp-content/uploads/2017/04/Guide_Drinks_16x9b.jpg' },
        { nombre: 'Panadería', urlImagen: 'https://thefoodtech.com/wp-content/uploads/2023/10/PANADERIA-PRINCIPAL-1.jpg' },
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
            urlImagen: 'https://www.carozzi.com/wp-content/uploads/2021/06/Farfalle.png',
            categoriaNombre: 'Fideos'
        },
        {
            nombre: 'Fideos Spaghetti Carozzi',
            descripcion: 'Fideos largos y delgados, perfectos para acompañar con salsas.',
            urlImagen: 'https://www.carozzi.com/wp-content/uploads/2021/06/Spaghetti.png',
            categoriaNombre: 'Fideos'
        },

        // Arroz
        {
            nombre: 'Arroz Largo Fino',
            descripcion: 'Arroz de grano largo, ideal para guarniciones y ensaladas.',
            urlImagen: 'https://www.lafallera.es/wp-content/uploads/2023/04/Coccio%CC%81n-para-el-arroz-largo-pasos-y-trucos.jpg',
            categoriaNombre: 'Arroz'
        },
        {
            nombre: 'Arroz Integral',
            descripcion: 'Arroz con cáscara conservada, rico en fibra y nutrientes.',
            urlImagen: 'https://www.naturalezapop.com/wp-content/uploads/2021/09/arroz-integral.jpg',
            categoriaNombre: 'Arroz'
        },

        // Legumbres
        {
            nombre: 'Lentejas',
            descripcion: 'Legumbres ricas en proteínas y fibra, ideales para sopas y guisos.',
            urlImagen: 'https://i.blogs.es/23a158/legumbres/450_1000.jpg',
            categoriaNombre: 'Legumbres'
        },
        {
            nombre: 'Garbanzos',
            descripcion: 'Legumbres versátiles para hummus, ensaladas y guisos.',
            urlImagen: 'https://www.gastroactitud.com/wp-content/uploads/2021/04/garbanzos.jpg',
            categoriaNombre: 'Legumbres'
        },

        // Frutas
        {
            nombre: 'Manzanas',
            descripcion: 'Frutas frescas y crujientes, perfectas para comer solas o en ensaladas.',
            urlImagen: 'https://s1.abcstatics.com/abc/www/multimedia/ciencia/2023/03/31/frutas-kfNH-RL11aJz79VzsPThFeaE6g5L-1200x840@abc.jpg',
            categoriaNombre: 'Frutas'
        },
        {
            nombre: 'Bananas',
            descripcion: 'Frutas dulces y nutritivas, ricas en potasio.',
            urlImagen: 'https://www.bananalink.org.uk/wp-content/uploads/2021/04/bananas.jpeg',
            categoriaNombre: 'Frutas'
        },

        // Verduras
        {
            nombre: 'Zanahorias',
            descripcion: 'Verduras ricas en betacaroteno, ideales para ensaladas y cocidos.',
            urlImagen: 'https://s2.abcstatics.com/abc/www/multimedia/bienestar/2024/04/30/verduras-pocas-calorias-R3Vfbjx9Nok0nxp9QObH7xH-1200x840@diario_abc.jpg',
            categoriaNombre: 'Verduras'
        },
        {
            nombre: 'Papas',
            descripcion: 'Tubérculos versátiles para puré, fritas o cocidas.',
            urlImagen: 'https://www.thespruceeats.com/thmb/dGLQhlG3zK00a9u8osND8XM59Ng=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/easy-roasted-potatoes-recipe-4149362-hero-01-39c63eab8b714ec3a9c768fb7dd82bda.jpg',
            categoriaNombre: 'Verduras'
        },

        // Cubiertos
        {
            nombre: 'Cuchillo de Mesa',
            descripcion: 'Cuchillo básico para cortar alimentos en la mesa.',
            urlImagen: 'https://eurohome.cl/cdn/shop/products/0302.914-5_1800x.jpg?v=1637683715',
            categoriaNombre: 'Cubiertos'
        },
        {
            nombre: 'Tenedor de Mesa',
            descripcion: 'Tenedor estándar para comidas.',
            urlImagen: 'https://cdn.pixabay.com/photo/2016/03/09/09/31/cutlery-1246651_1280.jpg',
            categoriaNombre: 'Cubiertos'
        },

        // Limpiezas
        {
            nombre: 'Detergente Líquido',
            descripcion: 'Detergente líquido para lavar ropa y vajilla.',
            urlImagen: 'https://img.freepik.com/fotos-premium/productos-limpieza-hogar_863013-118483.jpg',
            categoriaNombre: 'Limpiezas'
        },
        {
            nombre: 'Esponja de Cocina',
            descripcion: 'Esponja suave y resistente para lavar platos y utensilios.',
            urlImagen: 'https://cdn.pixabay.com/photo/2015/12/09/17/06/sponge-1080994_1280.jpg',
            categoriaNombre: 'Limpiezas'
        },

        // Lácteos
        {
            nombre: 'Leche Entera',
            descripcion: 'Leche fresca y entera, rica en calcio y vitaminas.',
            urlImagen: 'https://cdn.pixabay.com/photo/2016/11/29/03/53/milk-1867510_1280.jpg',
            categoriaNombre: 'Lacteos'
        },
        {
            nombre: 'Queso Cheddar',
            descripcion: 'Queso madurado, ideal para sándwiches y platos horneados.',
            urlImagen: 'https://cdn.pixabay.com/photo/2016/04/23/14/47/cheese-1349162_1280.jpg',
            categoriaNombre: 'Lacteos'
        },

        // Bebidas
        {
            nombre: 'Jugo de Naranja',
            descripcion: 'Jugo natural de naranja, rico en vitamina C.',
            urlImagen: 'https://cdn.pixabay.com/photo/2017/08/30/12/03/orange-juice-2690576_1280.jpg',
            categoriaNombre: 'Bebidas'
        },
        {
            nombre: 'Agua Mineral',
            descripcion: 'Agua mineral embotellada, ideal para hidratarse.',
            urlImagen: 'https://cdn.pixabay.com/photo/2016/02/12/18/52/bottle-1192062_1280.jpg',
            categoriaNombre: 'Bebidas'
        },

        // Panadería
        {
            nombre: 'Pan de Molde',
            descripcion: 'Pan suave y esponjoso, perfecto para tostadas y sándwiches.',
            urlImagen: 'https://cdn.pixabay.com/photo/2017/06/15/11/32/bread-2403186_1280.jpg',
            categoriaNombre: 'Panadería'
        },
        {
            nombre: 'Croissants',
            descripcion: 'Bollo de hojaldre, ideal para desayunos y meriendas.',
            urlImagen: 'https://cdn.pixabay.com/photo/2017/09/10/19/47/croissant-2731959_1280.jpg',
            categoriaNombre: 'Panadería'
        },
    ],

    tandas: [
        {
            cantidadIngresada: 100,
            fechaVencimiento: '2024-09-15',
            productoNombre: 'Leche Entera',
            categoriaNombre: 'Lacteos',
            bodegaNombre: 'Bodega A',
            ubicacionNombre: 'Rack Rojo, Piso 1'
        },
        {
            cantidadIngresada: 50,
            fechaVencimiento: '2024-09-12',
            productoNombre: 'Pan de Molde',
            categoriaNombre: 'Panadería',
            bodegaNombre: 'Bodega A',
            ubicacionNombre: 'Rack Azul, Piso 2'
        },
        {
            cantidadIngresada: 137,
            fechaVencimiento: '2024-09-15',
            productoNombre: 'Queso Cheddar',
            categoriaNombre: 'Lacteos',
            bodegaNombre: 'Bodega A',
            ubicacionNombre: 'Rack Azul, Piso 3'
        },
        {
            cantidadIngresada: 100,
            fechaVencimiento: '2024-10-25',
            productoNombre: 'Croissants',
            categoriaNombre: 'Panadería',
            bodegaNombre: 'Bodega A',
            ubicacionNombre: 'Sector A'
        },
        {
            cantidadIngresada: 50,
            fechaVencimiento: '2024-10-10',
            productoNombre: 'Jugo de Naranja',
            categoriaNombre: 'Bebidas',
            bodegaNombre: 'Bodega A',
            ubicacionNombre: 'Sector B'
        },
        {
            cantidadIngresada: 1000,
            fechaVencimiento: '2025-06-27',
            productoNombre: 'Fideos Spaghetti Carozzi',
            categoriaNombre: 'Fideos',
            bodegaNombre: 'Bodega A',
            ubicacionNombre: 'Rack Rojo, Piso 2'
        },
        {
            cantidadIngresada: 500,
            fechaVencimiento: '2027-03-10',
            productoNombre: 'Arroz Largo Fino',
            categoriaNombre: 'Arroz',
            bodegaNombre: 'Bodega A',
            ubicacionNombre: 'Rack Rojo, Piso 3'
        },
        {
            cantidadIngresada: 100,
            fechaVencimiento: '2024-12-21',
            productoNombre: 'Manzanas',
            categoriaNombre: 'Frutas',
            bodegaNombre: 'Bodega A',
            ubicacionNombre: 'Sector C'
        },
    ]


}