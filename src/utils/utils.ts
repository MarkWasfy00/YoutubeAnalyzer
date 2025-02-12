export const isTokenExpired = (token: string | null): boolean => {
    if (!token) return true;
    try {
      const decoded = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      return decoded.exp * 1000 < Date.now(); // Compare expiration time with current time
    } catch {
      return true;
    }
  };
  