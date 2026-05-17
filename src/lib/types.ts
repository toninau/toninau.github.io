export type Result<T> = { isValid: true; value: T } | { isValid: false; message: string };
