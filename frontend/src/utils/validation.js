export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email) => {
  if (!email.trim()) {
    return "Adresse mail obligatoire";
  }
  if (!emailRegex.test(email)) {
    return "Veuillez entrer une adresse mail valide";
  }
  return "";
};

export const validatePassword = (password, minLength = 6) => {
  if (!password) {
    return "Mot de passe obligatoire";
  }
  if (password.length < minLength) {
    return `Le mot de passe doit contenir au moins ${minLength} caractères`;
  }
  return "";
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return "Veuillez confirmer votre mot de passe";
  }
  if (password !== confirmPassword) {
    return "Les mots de passe ne correspondent pas";
  }
  return "";
};

export const validateRequired = (value, fieldName) => {
  if (!value.trim()) {
    return `${fieldName} obligatoire`;
  }
  return "";
};

export const validatePostalCode = (postalCode) => {
  if (!postalCode.trim()) {
    return "Code postal obligatoire";
  }
  if (!/^\d{5}$/.test(postalCode)) {
    return "Le code postal doit contenir 5 chiffres";
  }
  return "";
};

export const validateCity = (city) => {
  if (!city.trim()) {
    return "Ville obligatoire";
  }
  if (/\d/.test(city)) {
    return "La ville ne doit pas contenir de chiffres";
  }
  return "";
};
