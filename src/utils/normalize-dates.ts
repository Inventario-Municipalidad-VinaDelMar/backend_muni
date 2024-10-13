import { format, fromZonedTime } from 'date-fns-tz';
const chileTimezone = 'America/Santiago';


const createDate = (year: number, month: number, day: number): Date => {
    return new Date(year, month - 1, day);
};

export const normalize = (date: string) => {
    return createDate(
        parseInt(date.split('-')[0]),
        parseInt(date.split('-')[1]),
        parseInt(date.split('-')[2]),
    );
}

export const dateToString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses van de 0 a 11, se ajusta sumando 1
    const day = String(date.getDate()).padStart(2, '0'); // Se ajusta a dos dígitos

    return `${year}-${month}-${day}`;
}

export const currentFecha = (fechaString?: string): string => {
    let date: Date;

    if (fechaString) {
        // Crear la fecha a partir del string proporcionado
        date = new Date(fechaString);

        // Verificar si la fecha es válida
        if (isNaN(date.getTime())) {
            throw new Error('Fecha inválida proporcionada.');
        }
    } else {
        // Usar la fecha actual si no se proporcionó un string
        date = new Date();
    }

    return dateToString(date); // Convertir la fecha a string en formato YYYY-MM-DD
}


export const getHoraInicioChile = (): string => {
    const now = new Date();
    const horaEnChile = fromZonedTime(now, chileTimezone);
    return format(horaEnChile, 'HH:mm:ss');
};