import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AssetDetail from './pages/AssetDetail';
import CreateAsset from './pages/CreateAsset';

function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem('jwt_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
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
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;