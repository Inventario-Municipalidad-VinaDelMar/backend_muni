export function getCurrentWeekDates(): string[] {
    const today = new Date();

    // Calcular el número del día de la semana (0=domingo, 1=lunes, ..., 6=sábado)
    const dayOfWeek = today.getDay();

    // Calcular la fecha del lunes de esta semana
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));  // Si es domingo, retrocede a lunes pasado

    // Generar las fechas de lunes a viernes
    const weekDates: string[] = [];
    for (let i = 0; i < 5; i++) {
        const currentDate = new Date(monday);
        currentDate.setDate(monday.getDate() + i);
        weekDates.push(currentDate.toISOString().split('T')[0]); // Formato YYYY-MM-DD
    }

    return weekDates;
}

export const getStartAndEndOfWeek = (
    date: Date,
): { start: string; end: string } => {

    // Copia la fecha para no modificar la original
    const start = new Date(date);


    // Ajusta al inicio de la semana (lunes)
    const day = date.getUTCDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day; // 1 = lunes, 0 = domingo, -6 = sábado
    start.setDate(date.getDate() + diffToMonday);

    // Crear una nueva fecha para el final de la semana (domingo)
    const end = new Date(start);
    end.setDate(start.getDate() + 4);

    // Formatea las fechas como cadenas en formato YYYY-MM-DD
    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];

    return { start: startStr, end: endStr };
};
