export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUsername = (username: string): boolean => {
  return username.length >= 3;
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

interface ValidationErrors {
  [key: string]: string;
}

export const validateLoginForm = (username: string, password: string): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (!validateUsername(username)) {
    errors.username = 'Username must be at least 3 characters';
  }
  
  if (!validatePassword(password)) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  return errors;
};

export const validateRegisterForm = (
  name: string,
  email: string,
  username: string,
  password: string,
  confirmPassword: string
): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (!validateName(name)) {
    errors.name = 'Name must be at least 2 characters';
  }
  
  if (!validateEmail(email)) {
    errors.email = 'Invalid email address';
  }
  
  if (!validateUsername(username)) {
    errors.username = 'Username must be at least 3 characters';
  }
  
  if (!validatePassword(password)) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  if (!validatePasswordMatch(password, confirmPassword)) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return errors;
};