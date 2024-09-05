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

export const currentFecha = (): string => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Meses van de 0 a 11, se ajusta sumando 1
    const day = String(today.getDate()).padStart(2, '0'); // Se ajusta a dos dígitos

    return `${year}-${month}-${day}`;
}

export const getHoraInicioChile = (): string => {
    const now = new Date();
    const horaEnChile = fromZonedTime(now, chileTimezone);
    return format(horaEnChile, 'HH:mm:ss');
};