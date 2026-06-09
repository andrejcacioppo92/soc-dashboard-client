import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import './index.css';
import App from './App.jsx';

// avvolgo l'app nel Provider Redux così tutti i componenti possono accedere allo store
// senza il Provider gli hook useSelector e useDispatch non funzionerebbero
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>
);