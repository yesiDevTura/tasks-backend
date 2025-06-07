export class ValidationUtils {
  public static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  public static isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined;
  }

  public static isEmptyString(value: string): boolean {
    return value.trim().length === 0;
  }

  public static isStringWithinLength(value: string, maxLength: number): boolean {
    return value.length <= maxLength;
  }

  public static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public static isValidPassword(password: string): boolean {
    // La contraseña debe tener al menos una letra y un número
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return hasLetter && hasNumber;
  }
}