import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMioProfilo } from './store/authSlice';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AssetDetail from './pages/AssetDetail';
import CreateAsset from './pages/CreateAsset';
import Profilo from './pages/Profilo';
import Report from './pages/Report';

// componente che protegge le route private
// se non c'è token in store rimando al login
function ProtectedRoute({ children }) {
  const { token } = useSelector((state) => state.auth);
  return token ? children : <Navigate to="/login" replace />;
}

// carica il profilo utente all'avvio quando c'è un token
// così lo store ha sempre il ruolo aggiornato e le viste si adattano
function AuthBootstrap({ children }) {
  const dispatch = useDispatch();
  const { token, utente } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !utente) {
      dispatch(fetchMioProfilo());
    }
  }, [token, utente, dispatch]);

  return children;
}

export default function App() {
  return (
      <BrowserRouter>
        <AuthBootstrap>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/asset/:id" element={
              <ProtectedRoute>
                <AssetDetail />
              </ProtectedRoute>
            } />
            <Route path="/create-asset" element={
              <ProtectedRoute>
                <CreateAsset />
              </ProtectedRoute>
            } />
            <Route path="/profilo" element={
              <ProtectedRoute>
                <Profilo />
              </ProtectedRoute>
            } />
            <Route path="/report" element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthBootstrap>
      </BrowserRouter>
  );
}