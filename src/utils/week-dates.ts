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
