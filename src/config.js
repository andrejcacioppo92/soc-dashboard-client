// configurazione centralizzata delle URL dell'API
// così se domani cambia il dominio del back-end modifico solo questo file
// in sviluppo locale legge da .env, fallback a localhost se la variabile manca
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';