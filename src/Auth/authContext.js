// Fonction pour enregistrer un token d'authentification
export function saveAuthToken(token) {
  localStorage.setItem('authToken', token);
}

// Fonction pour supprimer un token d'authentification
export function deleteAuthToken() {
  localStorage.removeItem('authToken');
}

// Fonction pour récupérer un token d'authentification
export function getAuthToken() {
  return localStorage.getItem('authToken');
}