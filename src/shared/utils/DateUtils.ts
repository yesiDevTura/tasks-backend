export class DateUtils {
  public static formatDateToISO(date: Date): string {
    return date.toISOString();
  }

  public static formatDateToLocal(date: Date): string {
    return date.toLocaleString();
  }

  public static getDaysDifference(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  public static isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }
}