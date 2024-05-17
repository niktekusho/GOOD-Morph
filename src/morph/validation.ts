export type ValidationSuccess<T> = {
  failed: false;
  valid: true;
  sanitized: T;
};

export function createSuccess<T>(sanitized: T): ValidationSuccess<T> {
  return {
    failed: false,
    sanitized,
    valid: true,
  };
}

export function createError(errors: ValidationErrorDetail[]): ValidationError {
  return {
    failed: true,
    valid: false,
    errors,
  };
}

export type ValidationError = {
  failed: true;
  valid: false;
  errors: ValidationErrorDetail[];
};

export type ValidationResult<T> = ValidationError | ValidationSuccess<T>;

export type ValidationErrorDetail = {
  cause: string;
};

export function isRecord(arg: unknown): arg is Record<string, unknown> {
  return arg != null && typeof arg === "object" && !Array.isArray(arg);
}

export function isNotBlankString(str: string) {
  return str.trim().length > 0;
}

export function isBlankString(str: string) {
  return str.trim().length === 0;
}
