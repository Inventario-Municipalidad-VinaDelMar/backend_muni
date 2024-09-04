
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