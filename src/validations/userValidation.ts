/** @format */
// validators.ts

// Define an interface for the input data structure
interface SignupData {
  clerkId: string;
  name: string;
  email: string;
  isStudent: boolean;
  isAdmin: boolean;
}

// Define an interface for the validation response structure
interface ValidationResponse {
  valid: boolean;
  message?: string;
}

// Main validation function
function validateSignupData(data: SignupData): ValidationResponse {
  const { name, email, isStudent, isAdmin } = data;

  // Validate name length
  if (!name || name.length < 3) {
    return { valid: false, message: 'Name must be at least 3 characters long' };
  }

  // Validate email format
  if (!email || !validateEmail(email)) {
    return { valid: false, message: 'Invalid email format' };
  }

  // Validate isStudent and isAdmin as boolean values
  if (typeof isStudent !== 'boolean' || typeof isAdmin !== 'boolean') {
    return {
      valid: false,
      message: 'isStudent and isAdmin must be boolean values',
    };
  }

  // All validations passed
  return { valid: true };
}

// Email validation helper function
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export { validateSignupData, SignupData, ValidationResponse };
