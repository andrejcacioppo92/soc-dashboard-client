import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../config';

// thunk per il login, gestisce la chiamata async al back-end
// se le credenziali sono giuste salvo il token in sessionStorage e nello stato
export const loginUtente = createAsyncThunk(
    'auth/login',
    async ({ username, password }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                return rejectWithValue('Credenziali non valide');
            }

            const data = await response.json();
            sessionStorage.setItem('jwt_token', data.token);
            return { token: data.token, username };
        } catch {
            return rejectWithValue('Errore di connessione al server');
        }
    }
);

// thunk per recuperare il profilo dell'utente loggato
// uso il token già presente in sessionStorage per autenticare la richiesta
export const fetchMioProfilo = createAsyncThunk(
    'auth/fetchProfilo',
    async (_, { rejectWithValue }) => {
        try {
            const token = sessionStorage.getItem('jwt_token');
            if (!token) {
                return rejectWithValue('Token mancante');
            }

            const response = await fetch(`${API_BASE_URL}/api/users/me`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) {
                return rejectWithValue('Sessione scaduta');
            }

            return await response.json();
        } catch {
            return rejectWithValue('Errore di rete');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: sessionStorage.getItem('jwt_token') || null,
        utente: null,
        loading: false,
        errore: null,
    },
    reducers: {
        // logout sincrono, basta togliere il token e svuotare lo stato
        logout: (state) => {
            sessionStorage.removeItem('jwt_token');
            state.token = null;
            state.utente = null;
            state.errore = null;
        },
        // pulisce solo l'errore quando l'utente inizia a digitare di nuovo
        pulisciErrore: (state) => {
            state.errore = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUtente.pending, (state) => {
                state.loading = true;
                state.errore = null;
            })
            .addCase(loginUtente.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
            })
            .addCase(loginUtente.rejected, (state, action) => {
                state.loading = false;
                state.errore = action.payload;
            })
            .addCase(fetchMioProfilo.fulfilled, (state, action) => {
                state.utente = action.payload;
            })
            .addCase(fetchMioProfilo.rejected, (state) => {
                // se il profilo non si carica vuol dire token scaduto, faccio logout
                sessionStorage.removeItem('jwt_token');
                state.token = null;
                state.utente = null;
            });
    },
});

export const { logout, pulisciErrore } = authSlice.actions;
export default authSlice.reducer;