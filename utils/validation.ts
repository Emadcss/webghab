
/**
 * Global Validation Engine for WebGhab Luxury
 * Ensures data integrity and security across all forms.
 */

export const ValidationRules = {
  // Strict Email: No Persian characters, must follow standard format
  email: (val: string) => {
    const persianRegex = /[\u0600-\u06FF]/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (persianRegex.test(val)) return "ایمیل نباید شامل حروف فارسی باشد.";
    if (!emailRegex.test(val)) return "فرمت ایمیل وارد شده صحیح نیست.";
    return null;
  },

  // Password: Min 8 chars, at least one letter and one number
  password: (val: string) => {
    if (val.length < 8) return "رمز عبور باید حداقل ۸ کاراکتر باشد.";
    if (!/(?=.*[A-Za-z])(?=.*\d)/.test(val)) return "رمز عبور باید شامل حروف و اعداد باشد.";
    return null;
  },

  // Phone: Standard Iranian mobile format
  phone: (val: string) => {
    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(val)) return "شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد.";
    return null;
  },

  // National ID: Minimum 10 digits
  nationalId: (val: string) => {
    if (!/^\d{10,}$/.test(val)) return "کد ملی باید حداقل ۱۰ رقم عددی باشد.";
    return null;
  },

  // Postal Code: Minimum 16 digits
  postalCode: (val: string) => {
    if (!/^\d{16,}$/.test(val)) return "کد پستی باید حداقل ۱۶ رقم عددی باشد.";
    return null;
  },

  // Numeric Only (for Plaque, Unit, etc)
  numeric: (val: string, fieldName: string) => {
    if (val && !/^\d+$/.test(val)) return `فیلد ${fieldName} باید فقط شامل عدد باشد.`;
    return null;
  },

  // Required Field
  required: (val: any, fieldName: string) => {
    if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) return `فیلد ${fieldName} الزامی است.`;
    return null;
  }
};

export type ValidationResult = string | null;
