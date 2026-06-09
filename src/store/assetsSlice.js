import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// thunk per recuperare la lista degli asset dal back-end
// il token lo prendo da sessionStorage per autenticare la richiesta
export const fetchAssets = createAsyncThunk(
    'assets/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const token = sessionStorage.getItem('jwt_token');
            const response = await fetch('http://localhost:8080/api/assets', {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) {
                return rejectWithValue('Impossibile caricare gli asset');
            }

            return await response.json();
        } catch {
            return rejectWithValue('Errore di rete');
        }
    }
);

// thunk per creare un nuovo asset, server o firewall
// l'endpoint cambia in base al tipo che l'utente ha scelto nel form
export const creaAsset = createAsyncThunk(
    'assets/crea',
    async ({ tipo, dati }, { rejectWithValue }) => {
        try {
            const token = sessionStorage.getItem('jwt_token');
            const endpoint = tipo === 'SERVER'
                ? 'http://localhost:8080/api/assets/servers'
                : 'http://localhost:8080/api/assets/firewalls';

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dati),
            });

            if (response.status === 409) {
                return rejectWithValue('IP già registrato a un altro asset');
            }
            if (!response.ok) {
                return rejectWithValue('Errore nella creazione asset');
            }

            return await response.json();
        } catch {
            return rejectWithValue('Errore di rete');
        }
    }
);

const assetsSlice = createSlice({
    name: 'assets',
    initialState: {
        lista: [],
        loading: false,
        errore: null,
    },
    reducers: {
        pulisciErroreAssets: (state) => {
            state.errore = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAssets.pending, (state) => {
                state.loading = true;
                state.errore = null;
            })
            .addCase(fetchAssets.fulfilled, (state, action) => {
                state.loading = false;
                state.lista = action.payload;
            })
            .addCase(fetchAssets.rejected, (state, action) => {
                state.loading = false;
                state.errore = action.payload;
            })
            .addCase(creaAsset.fulfilled, (state, action) => {
                // appena creo l'asset lo aggiungo alla lista così evito di rifare la fetch
                state.lista.push(action.payload);
            })
            .addCase(creaAsset.rejected, (state, action) => {
                state.errore = action.payload;
            });
    },
});

export const { pulisciErroreAssets } = assetsSlice.actions;
export default assetsSlice.reducer;