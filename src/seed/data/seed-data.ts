
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

export interface SeedComedorSolidario {
    nombre: string;
    direccion: string;
    latitud: string;
    longitud: string;
    sector: string;
}

interface SeedData {
    // envios: SeedEnvio[];
    comedores: SeedComedorSolidario[];
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
    comedores: [
        //Comedor 1
        {
            nombre: 'OLLITA DORADA',
            direccion: 'LUIS HURTADO LOPEZ #115 LOS ALMENDROS',
            sector: 'ACHUPALLAS',
            latitud: '-33.018921',
            longitud: '-71.499817',
        },
        //Comedor 2
        {
            nombre: 'JV FLORECER DE LOS ALMENDROS',
            direccion: 'PLAZA AL COSTADO DE PABLO DE ROCA 137, V INDEPENDENCIA',
            sector: 'ACHUPALLAS',
            latitud: '-33.02013020471302',
            longitud: '-71.49845982883564',
        },
        //Comedor 3
        {
            nombre: 'LAS ALMENDRITAS',
            direccion: 'LUIS HURTADO LOPEZ 381',
            sector: 'ACHUPALLAS',
            latitud: '-33.01797457573182',
            longitud: '-71.49349471534256',
        },
        //Comedor 4

        {
            nombre: 'JV VILLA ROGIERS',
            direccion: 'CALLE L1-SEDE JV',
            sector: 'ACHUPALLAS',
            latitud: '-33.01820772718678,',
            longitud: '-71.49206319999999',
        },
        //Comedor 5
        {
            nombre: 'FE Y ESPERANZA-PUNTO Y COMA',
            direccion: 'PANORAMA 322',
            sector: 'ACHUPALLAS',
            latitud: '-33.01417180325375',
            longitud: '-71.49632219260211',
        },
        // Comedor 6
        {
            nombre: 'JV LOMAS CHORRILLOS',
            direccion: 'AV.VALDIVIA 214',
            sector: 'CHORRILLOS',
            latitud: '-33.04118372192504',
            longitud: '-71.52837'
        },
        // Comedor 7
        {
            nombre: 'VICTOR JARA',
            direccion: 'CARLOS PEZOA VELIZ 177. ACHUPALLAS.',
            sector: 'ACHUPALLAS',
            latitud: '-33.01802627973306',
            longitud: '-71.49852568650694'
        },
        // Comedor 8
        {
            nombre: 'LAS MAMASITAS(VICENTE HUIDOBRO)',
            direccion: 'VICENTE HUIDOBRO 201, ACHUPALLAS, PARADERO 10, ACHUPALLAS',
            sector: 'ACHUPALLAS',
            latitud: '-33.02031873418742',
            longitud: '-71.4971350883564'
        },
        // Comedor 9
        {
            nombre: 'PREVENCION VIÑA',
            direccion: 'SAN ANTONIO 945',
            sector: 'PLAN',
            latitud: '-33.012669',
            longitud: '-71.5430749'
        },
        // Comedor 10
        {
            nombre: 'SEDE COMITE NUEVO REENCUENTRO ',
            direccion: 'BELLAVISTA NORTE, AVENIDA LA PRADERA',
            sector: 'ACHUPALLAS',
            latitud: '-33.014976573354176',
            longitud: '-71.49162091534254'
        },
        // Comedor 11
        {
            nombre: 'VILLA LA PRADERA',
            direccion: 'VILLA LA PRADERA SN',
            sector: 'ACHUPALLAS-CAMPAMENTO MANUEL BUSTOS',
            latitud: '-33.022119',
            longitud: '-71.488827'
        },
        // Comedor 12
        {
            nombre: 'VILLA LAS AMERICAS',
            direccion: 'PASAJE CHILE SIN NUMERO ESQUINA CALLE LA LUNA',
            sector: 'ACHUPALLAS-CAMPAMENTO MANUEL BUSTOS',
            latitud: '-33.01779845669651',
            longitud: '-71.49389261726698'
        },
        // Comedor 13
        {
            nombre: 'ESPERANZA NUEVA',
            direccion: 'RIO MAULE 84, MANUEL BUSTOS',
            sector: 'ACHUPALLAS-CAMPAMENTO MANUEL BUSTOS',
            latitud: '-33.0208594605485',
            longitud: '-71.48629675767128'
        },
        // Comedor 14
        {
            nombre: 'CASA ANITA AGUAYO',
            direccion: 'CALLE HUASCO CASA 65',
            sector: 'ACHUPALLAS-M BUSTOS',
            latitud: '-33.01684859995823',
            longitud: '-71.4922381865069'
        },
        // Comedor 15

        {
            nombre: 'MARIA MEDINA',
            direccion: 'CALLE ESPERNZA SN (FINAL DE VILLA ROGIERS)',
            sector: 'ACHUPALLAS-MANUEL BUSTOS',
            latitud: '-33.01779828168736',
            longitud: '-71.48888777301383'
        },
        // Comedor 16
        {
            nombre: 'MUJERES DE BARRIO',
            direccion: 'AV.LA LUNA ESQUINA CALLE LOS MANANTIALES N74,CAMPAMENTO MANUEL BUSTOS',
            sector: 'ACHUPALLAS-MANUEL BUSTOS',
            latitud: '-33.02755765375387',
            longitud: '-71.51308897493789'
        },
        // Comedor 17
        {
            nombre: 'LOMAS LAS PALMAS',
            direccion: 'AV.MANUEL VIDAL 1000,CASA 1, POB.LOMAS LAS PALMAS,CHORRILLOS',
            sector: 'CHORRILLOS',
            latitud: '-33.04683362633646',
            longitud: '-71.52692547301383'
        },
        // Comedor 18
        {
            nombre: 'FUNDACION CHILENOS POR LA FRATERNIDAD',
            direccion: 'PASAJE LAJA SN',
            sector: 'FORESTAL',
            latitud: '-33.04600849777212',
            longitud: '-71.5450043865069'
        },
        // Comedor 19
        {
            nombre: 'RIO SAN PEDRO',
            direccion: 'RIO SAN PEDRO 155',
            sector: 'FORESTAL',
            latitud: '-33.0592217308158',
            longitud: '-71.55809916931489'
        },
        // Comedor 20
        {
            nombre: 'OLLA DEL PUEBLO',
            direccion: 'PLAZA DE PEDRO VALDIVIA',
            sector: 'MIRAFLORES',
            latitud: '-33.02755765375387',
            longitud: '-71.51299241541713'
        },
        // Comedor 21
        {
            nombre: 'NACIONES UNIDAS',
            direccion: 'EL MAITEN 6 MIRAFLORES ALTO',
            sector: 'MIRAFLORES',
            latitud: '-33.033591524289314',
            longitud: '-71.51954513260897'
        },
        // Comedor 22
        {
            nombre: 'JUNTA DE VECINOS VILLA DULCE NORTE- NUEVA OLLA EN LA UV 74',
            direccion: 'VILLA DULCE, CARDENAL SAMORE, JV 74',
            sector: 'VIÑA ORIENTE',
            latitud: '-33.02956596329226',
            longitud: '-71.5029558693149'
        },
        // Comedor 23
        {
            nombre: 'CREANDO REDES',
            direccion: 'CALLE ISLA RIESCO 117/D FORESAL POB PTO AYSEN(DETRAS DE GARITA 404-405) , CASA PARTICULAR.',
            sector: 'FORESTAL',
            latitud: '-33.02201023581348',
            longitud: '-71.56063421911638'
        },
        // Comedor 24
        {
            nombre: 'VILLAMOUR',
            direccion: 'LAS MARAVILLAS CASA 20(CAMINO DE TIERRA)',
            sector: 'REÑACA ALTO',
            latitud: '-33.00756066771922',
            longitud: '-71.48533107910902'
        },
        // Comedor 25
        {
            nombre: 'JUNTA DE VECINOS SANTA JULIA NORTE',
            direccion: 'CALLE ESTADIO CON LAS FLORES',
            sector: 'SANTA JULIA',
            latitud: '-33.000884',
            longitud: '-71.504869'
        },
        // Comedor 26
        {
            nombre: 'CLUB DEPORTIVO PASO LOS ANDES',
            direccion: 'CALLE DIONISIO HERNANDEZ ,SEDE CLUB PASO LOS ANDES',
            sector: 'SANTA JULIA',
            latitud: '-33.00404674308334',
            longitud: '-71.5050486775972'
        },
        // Comedor 27
        {
            nombre: 'A PURO PULMON',
            direccion: 'PASAJE LOS ALELIES 14, PARADERO 6 DE SANTA JULIA',
            sector: 'SANTA JULIA',
            latitud: '-33.0062694249265',
            longitud: '-71.50041835530257'
        },
        // Comedor 28
        {
            nombre: 'BANQUETERIA PASTENES',
            direccion: 'LOS JAZMINES 23 PARADERO 6 1/2 SANTA JULIA (ENTRE CALLES LAS BANDURRIAS Y LAS AZUCENAS)',
            sector: 'SANTA JULIA',
            latitud: '-33.009943380050444',
            longitud: '-71.501158371164'
        },
        // Comedor 29
        {
            nombre: 'ELEONOR',
            direccion: 'VIOLETA PARRA #27. SANTA JULIA.',
            sector: 'SANTA JULIA',
            latitud: '-33.00404649264259',
            longitud: '-71.50170077116428'
        },
        // Comedor 30
        {
            nombre: 'CHOCOLATERA',
            direccion: 'CARDENAL SAMORE 46',
            sector: 'VIÑA ORIENTE',
            latitud: '-33.024786257601704',
            longitud: '-71.50273201520854'
        },
        // Comedor 31
        {
            nombre: 'YABRICOYA',
            direccion: 'TIMAR SN',
            sector: 'VIÑA ORIENTE',
            latitud: '-33.03200899929608',
            longitud: ' -71.49128545110038'
        },
        // Comedor 32
        {
            nombre: 'CANTERA 2',
            direccion: 'ESCALA CONGO 1150 LAS TORRES',
            sector: 'VIÑA ORIENTE',
            latitud: '-33.02545652169052',
            longitud: '-71.47706846082828'
        },
        // Comedor 33
        {
            nombre: 'REMAR SOS',
            direccion: 'CALBUCO 395',
            sector: 'VIÑA ORIENTE',
            latitud: '-33.030694',
            longitud: '-71.499032'
        },
        // Comedor 34
        {
            nombre: 'ENTRE CERROS',
            direccion: 'PASAJE LAS ROCAS 23',
            sector: 'VIÑA ORIENTE',
            latitud: '-33.0247954524728',
            longitud: '-71.5081944669041'
        },
        // Comedor 35
        {
            nombre: 'EJERCITO DE SALVACION',
            direccion: 'CLAVE 483',
            sector: 'VIÑA ORIENTE',
            latitud: '-33.029726372693844',
            longitud: '-71.49247163881542'
        },
        // Comedor 36
        {
            nombre: 'SEDE COMUNITARIA EL OLIVAR',
            direccion: 'TAMARUGAL SN',
            sector: 'VIÑA ORIENTE',
            latitud: '-33.022226170372406',
            longitud: '-71.49352692838035'
        },
        // Comedor 37
        {
            nombre: 'CANAL BEAGLE',
            direccion: 'C. BEAGLE ISLA GUAFO 255',
            sector: 'VIÑA ORIENTE',
            latitud: '-33.03825198161875',
            longitud: '-71.51014080305022'
        },
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
                { cantidadPlanificada: 100, producto: 'Sandwich' },
                { cantidadPlanificada: 25, producto: 'Agua Mineral' },
                { cantidadPlanificada: 150, producto: 'Tenedor de Mesa' },
            ]
        },
        {
            fecha: '',
            // fecha: '2024-10-2',
            detalles: [
                { cantidadPlanificada: 15, producto: 'Arroz Largo Fino' },
                { cantidadPlanificada: 88, producto: 'Sandwich' },
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
            descripcion: 'Fideos en forma de corbata, ideales para ensaladas y platos frios.',
            urlImagen: 'https://carozziexport.com/assets/img/products/_large/101302_CAROZZI_CORBATA_80_25X400_GR.jpg',

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
            descripcion: 'Arroz con cascara conservada, rico en fibra y nutrientes.',
            urlImagen: 'https://assets.tmecosys.com/image/upload/t_web767x639/img/recipe/ras/Assets/a0426521-e822-4653-b77e-a83670388cd9/Derivates/2ee94377-3c62-42a7-b36f-b40e587e6bd3.jpg',

        },

        // Legumbres
        {
            nombre: 'Lentejas',
            descripcion: 'Legumbres ricas en proteinas y fibra, ideales para sopas y guisos.',
            urlImagen: 'https://t1.uc.ltmcdn.com/es/posts/0/2/7/como_cocinar_lentejas_23720_600.jpg',

        },
        {
            nombre: 'Garbanzos',
            descripcion: 'Legumbres versatiles para hummus, ensaladas y guisos.',
            urlImagen: 'https://content.cuerpomente.com/medio/2022/08/30/garbanzos-al-horno-receta-clasica_bdd177fa_1200x1200.jpg',

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
            descripcion: 'Tuberculos versatiles para pure, fritas o cocidas.',
            urlImagen: 'https://feriaadomicilio.cl/wp-content/uploads/2019/11/papas-5-k.jpg',

        },

        // Cubiertos
        {
            nombre: 'Cuchillo de Mesa',
            descripcion: 'Cuchillo basico para cortar alimentos en la mesa.',
            urlImagen: 'https://steward.cl/10311-large_default/set-12-cuchillo-mesa-celebration-inox-180.jpg',

        },
        {
            nombre: 'Tenedor de Mesa',
            descripcion: 'Tenedor estandar para comidas.',
            urlImagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtYbvKbAjm3n8-1l_RAcddQ17MxWm5qU1kMA&s',

        },
        {
            nombre: 'Cuchara de Mesa',
            descripcion: 'Cuchara estandar para comidas liquidas.',
            urlImagen: 'https://cdnx.jumpseller.com/santa-mariana/image/7682407/resize/610/610?1609339753',

        },

        // Limpiezas
        {
            nombre: 'Detergente Liquido',
            descripcion: 'Detergente liquido para lavar ropa y vajilla.',
            urlImagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpsY5OeGT095gGI7r6fy81Uk1rX9GxkSnJJQ&s',

        },
        {
            nombre: 'Esponja de Cocina',
            descripcion: 'Esponja suave y resistente para lavar platos y utensilios.',
            urlImagen: 'https://rgc.cl/wp-content/uploads/2023/06/esponja-acanalada-con-fibra-abrasiva-600x630-1.jpg',

        },

        // Lacteos
        {
            nombre: 'Leche Entera',
            descripcion: 'Leche fresca y entera, rica en calcio y vitaminas.',
            urlImagen: 'https://jumbo.vteximg.com.br/arquivos/ids/687146/Leche-entera-1-L.jpg?v=638240207835200000',

        },
        {
            nombre: 'Queso',
            descripcion: 'Queso madurado, ideal para sandwiches y platos horneados.',
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

        // Panaderia
        {
            nombre: 'Pan de Molde',
            descripcion: 'Pan suave y esponjoso, perfecto para tostadas y sandwiches.',
            urlImagen: 'https://metroio.vtexassets.com/arquivos/ids/251368-800-auto',

        },
        {
            nombre: 'Sandwich',
            descripcion: 'Ideal para desayunos y meriendas.',
            urlImagen: 'https://www.gob.mx/cms/uploads/image/file/761647/WhatsApp_Image_2022-11-01_at_2.23.08_PM.jpeg',

        },
    ],

    tandas: [
        // Fideos

        { cantidadIngresada: 200, fechaVencimiento: '2024-12-01', productoNombre: 'Fideos Corbatas Carozzi', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-12-05', productoNombre: 'Fideos Corbatas Carozzi', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-12-10', productoNombre: 'Fideos Corbatas Carozzi', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-12-15', productoNombre: 'Fideos Corbatas Carozzi', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-12-20', productoNombre: 'Fideos Corbatas Carozzi', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },

        { cantidadIngresada: 200, fechaVencimiento: '2024-12-01', productoNombre: 'Fideos Spaghetti Carozzi', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-12-05', productoNombre: 'Fideos Spaghetti Carozzi', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-12-10', productoNombre: 'Fideos Spaghetti Carozzi', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-12-15', productoNombre: 'Fideos Spaghetti Carozzi', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-12-20', productoNombre: 'Fideos Spaghetti Carozzi', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },
        // Arroz
        { cantidadIngresada: 200, fechaVencimiento: '2024-12-01', productoNombre: 'Arroz Largo Fino', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-12-05', productoNombre: 'Arroz Largo Fino', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-12-10', productoNombre: 'Arroz Largo Fino', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-12-15', productoNombre: 'Arroz Largo Fino', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-12-20', productoNombre: 'Arroz Largo Fino', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },

        { cantidadIngresada: 200, fechaVencimiento: '2024-12-01', productoNombre: 'Arroz Integral', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-12-05', productoNombre: 'Arroz Integral', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-12-10', productoNombre: 'Arroz Integral', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-12-15', productoNombre: 'Arroz Integral', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-12-20', productoNombre: 'Arroz Integral', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },
        // Legumbres
        { cantidadIngresada: 200, fechaVencimiento: '2024-12-01', productoNombre: 'Lentejas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-12-05', productoNombre: 'Lentejas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-12-10', productoNombre: 'Lentejas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-12-15', productoNombre: 'Lentejas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-12-20', productoNombre: 'Lentejas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },

        { cantidadIngresada: 200, fechaVencimiento: '2024-12-01', productoNombre: 'Garbanzos', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-12-05', productoNombre: 'Garbanzos', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-12-10', productoNombre: 'Garbanzos', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-12-15', productoNombre: 'Garbanzos', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-12-20', productoNombre: 'Garbanzos', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },
        // Frutas
        { cantidadIngresada: 200, fechaVencimiento: '2024-12-01', productoNombre: 'Manzanas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-12-05', productoNombre: 'Manzanas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-12-10', productoNombre: 'Manzanas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-12-15', productoNombre: 'Manzanas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-12-20', productoNombre: 'Manzanas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },

        { cantidadIngresada: 200, fechaVencimiento: '2024-12-01', productoNombre: 'Bananas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-12-05', productoNombre: 'Bananas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-12-10', productoNombre: 'Bananas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-12-15', productoNombre: 'Bananas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-12-20', productoNombre: 'Bananas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },
        // Verduras   
        { cantidadIngresada: 200, fechaVencimiento: '2024-12-01', productoNombre: 'Zanahorias', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-12-05', productoNombre: 'Zanahorias', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-12-10', productoNombre: 'Zanahorias', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-12-15', productoNombre: 'Zanahorias', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-12-20', productoNombre: 'Zanahorias', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },

        { cantidadIngresada: 200, fechaVencimiento: '2024-12-01', productoNombre: 'Papas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-12-05', productoNombre: 'Papas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-12-10', productoNombre: 'Papas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-12-15', productoNombre: 'Papas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-12-20', productoNombre: 'Papas', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },
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
        { cantidadIngresada: 200, fechaVencimiento: '2024-12-01', productoNombre: 'Detergente Liquido', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-12-05', productoNombre: 'Detergente Liquido', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-12-10', productoNombre: 'Detergente Liquido', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-12-15', productoNombre: 'Detergente Liquido', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-12-20', productoNombre: 'Detergente Liquido', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },

        { cantidadIngresada: 200, fechaVencimiento: null, productoNombre: 'Esponja de Cocina', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: null, productoNombre: 'Esponja de Cocina', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: null, productoNombre: 'Esponja de Cocina', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: null, productoNombre: 'Esponja de Cocina', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: null, productoNombre: 'Esponja de Cocina', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },
        // Lacteos
        { cantidadIngresada: 200, fechaVencimiento: '2024-12-01', productoNombre: 'Leche Entera', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-12-05', productoNombre: 'Leche Entera', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-12-10', productoNombre: 'Leche Entera', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-12-15', productoNombre: 'Leche Entera', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-12-20', productoNombre: 'Leche Entera', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },

        { cantidadIngresada: 200, fechaVencimiento: '2024-12-01', productoNombre: 'Queso', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-12-05', productoNombre: 'Queso', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-12-10', productoNombre: 'Queso', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-12-15', productoNombre: 'Queso', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-12-20', productoNombre: 'Queso', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },
        // Bebidas
        { cantidadIngresada: 200, fechaVencimiento: '2024-12-01', productoNombre: 'Jugo de Naranja', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-12-05', productoNombre: 'Jugo de Naranja', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-12-10', productoNombre: 'Jugo de Naranja', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-12-15', productoNombre: 'Jugo de Naranja', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-12-20', productoNombre: 'Jugo de Naranja', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },

        { cantidadIngresada: 200, fechaVencimiento: '2024-12-01', productoNombre: 'Agua Mineral', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-12-05', productoNombre: 'Agua Mineral', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-12-10', productoNombre: 'Agua Mineral', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-12-15', productoNombre: 'Agua Mineral', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-12-20', productoNombre: 'Agua Mineral', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },
        // Panaderia

        { cantidadIngresada: 200, fechaVencimiento: '2024-12-01', productoNombre: 'Pan de Molde', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-12-05', productoNombre: 'Pan de Molde', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-12-10', productoNombre: 'Pan de Molde', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-12-15', productoNombre: 'Pan de Molde', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-12-20', productoNombre: 'Pan de Molde', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },

        { cantidadIngresada: 200, fechaVencimiento: '2024-12-01', productoNombre: 'Sandwich', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 1' },
        { cantidadIngresada: 150, fechaVencimiento: '2024-12-05', productoNombre: 'Sandwich', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Rojo, Piso 2' },
        { cantidadIngresada: 100, fechaVencimiento: '2024-12-10', productoNombre: 'Sandwich', bodegaNombre: 'Bodega A', ubicacionNombre: 'Rack Azul, Piso 1' },
        { cantidadIngresada: 250, fechaVencimiento: '2024-12-15', productoNombre: 'Sandwich', bodegaNombre: 'Bodega A', ubicacionNombre: 'Almacenaje Centro bodega' },
        { cantidadIngresada: 180, fechaVencimiento: '2024-12-20', productoNombre: 'Sandwich', bodegaNombre: 'Bodega A', ubicacionNombre: 'Sector A' },
    ]



}

