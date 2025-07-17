/**
 * Validates a password according to the following rules:
 * - Minimum 8 characters
 * - At least one capital letter
 * - At least one number
 * - At least one special character (_, -, @, #)
 * - No other special characters allowed
 *
 *@param password The password to validate
 *@returns Validation result
 */

type PasswordValidationResult = {
  isValid: boolean;
  message?: string;
};

export const validatePassword = (
  password: string
): PasswordValidationResult => {
  // Check minimum length
  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long",
    };
  }

  // Check for capital letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one capital letter",
    };
  }

  // Check for number
  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number",
    };
  }

  // Check for allowed special characters
  const allowedSpecialChars = /[_\-@#]/;
  if (!allowedSpecialChars.test(password)) {
    return {
      isValid: false,
      message:
        "Password must contain at least one special character (_, -, @, #)",
    };
  }

  // Check for any other special characters
  const otherSpecialChars = /[^A-Za-z0-9_\-@#]/;
  if (otherSpecialChars.test(password)) {
    return {
      isValid: false,
      message:
        "Password can only contain letters, numbers, and special characters (_, -, @, #)",
    };
  }

  return { isValid: true };
};
