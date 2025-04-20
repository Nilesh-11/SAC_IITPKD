export const decodeToken = (token) => {
  if (!token) return null;

  try {
    const [, payload] = token.split(".");
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = JSON.parse(atob(base64));

    // Check expiration (optional safety on frontend)
    const now = Math.floor(Date.now() / 1000);
    if (decodedPayload.exp && decodedPayload.exp < now) {
      console.warn("JWT token is expired");
      return null;
    }

    return decodedPayload;
  } catch (error) {
    console.error("Invalid JWT token", error);
    return null;
  }
};

export const validatePassword = (password) => {
  const validations = {
    length: password.length >= 8 && password.length <= 50,
    digit: /[0-9]/.test(password),
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  return validations;
};
