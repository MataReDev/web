import jwt_decode from "jwt-decode";

function decodeToken(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const decoded = JSON.parse(atob(base64));
  return decoded;
}

// Fonction pour enregistrer un token d'authentification
export function saveAuthToken(token) {
  document.cookie = "authToken=" + token + "; path=/";
}

// Fonction pour supprimer un token d'authentification
export function deleteAuthToken() {
  document.cookie =
    "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export function getAuthToken() {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith("authToken=")) {
      return cookie.substring("authToken=".length);
    }
  }
  return null;
}

export function getUsernameFromToken() {
  const token = getAuthToken();
  if (!token) {
    console.error("Le JWT est absent dans les cookies.");
    return null;
  }
  const decodedToken = decodeToken(token);
  console.log('mathys',decodedToken);
  return decodedToken.username;
}

export function getIsAdmin() {
  const token = getAuthToken();
  if (!token) {
    return false;
  }
  const decodedToken = decodeToken(token);
  return decodedToken.isAdmin;
}
