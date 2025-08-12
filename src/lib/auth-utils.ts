// Simple password hashing utility for admin authentication
export const hashPassword = async (password: string): Promise<string> => {
  // Using Web Crypto API for simple hashing
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
};

// Default admin password setup - should be changed in production
export const DEFAULT_ADMIN_PASSWORD = 'SCAdmin2025';
