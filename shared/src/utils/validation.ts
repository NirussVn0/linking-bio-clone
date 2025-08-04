export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUsername = (username: string): boolean => {
  return username.length >= 3 && username.length <= 32 && /^[a-zA-Z0-9_]+$/.test(username);
};

export const isValidTaskTitle = (title: string): boolean => {
  return title.trim().length >= 1 && title.length <= 200;
};

export const isValidTaskDescription = (description: string): boolean => {
  return description.length <= 1000;
};

export const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
