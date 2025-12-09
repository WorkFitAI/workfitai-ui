// Email validation
export const validateEmail = (email: string): boolean => {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
};

// Password validation
export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  if (password.length < 8) errors.push("Min 8 characters");
  // Uncomment these if you want stricter rules
  // if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
  // if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
  // if (!/[0-9]/.test(password)) errors.push('One number');
  return errors;
};

// Phone validation (VN format or 10-12 digits)
export const validatePhoneNumber = (phone: string): boolean => {
  // Accepts:
  // 0xxxxxxxxx (10 digits starting with 0)
  // +84xxxxxxxxx (11-12 digits starting with +84)
  // Simple check for 10-12 digits
  return /^(\+84|0)[0-9]{9,10}$/.test(phone);
};

// Full name validation
export const validateFullName = (name: string): boolean => {
  return name.trim().length >= 3 && name.trim().length <= 255;
};
