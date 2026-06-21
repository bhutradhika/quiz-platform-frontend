export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export interface ValidationRule<T> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  message?: string;
  validate?: (value: T) => boolean;
}

export function validateEmail(email: string): string | null {
  if (!email) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email format";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
}

export function validateUsername(username: string): string | null {
  if (!username) return "Username is required";
  if (username.length < 3) return "Username must be at least 3 characters";
  if (username.length > 20) return "Username must be less than 20 characters";
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username))
    return "Username can only contain letters, numbers, and underscores";
  return null;
}

export function validateField(value: string, rules: ValidationRule<string>[]): string | null {
  for (const rule of rules) {
    if (rule.required && !value) {
      return rule.message || "This field is required";
    }
    if (rule.minLength && value.length < rule.minLength) {
      return rule.message || `Minimum ${rule.minLength} characters required`;
    }
    if (rule.maxLength && value.length > rule.maxLength) {
      return rule.message || `Maximum ${rule.maxLength} characters allowed`;
    }
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message || "Invalid format";
    }
    if (rule.validate && !rule.validate(value)) {
      return rule.message || "Validation failed";
    }
  }
  return null;
}
