import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientDetails from './pages/PatientDetails';
import PatientNew from './pages/PatientNew';
import Documents from './pages/Documents';
import DocumentDetails from './pages/DocumentDetails';
import DocumentNew from './pages/DocumentNew';
import PublicDocument from './pages/PublicDocument';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useApp();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  const { initialize } = useApp();
  
  useEffect(() => {
    initialize();
  }, [initialize]);
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/documents/:id/sign" element={<PublicDocument />} />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/patients"
        element={
          <ProtectedRoute>
            <Patients />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/patients/new"
        element={
          <ProtectedRoute>
            <PatientNew />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/patients/:id"
        element={
          <ProtectedRoute>
            <PatientDetails />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/documents/new"
        element={
          <ProtectedRoute>
            <DocumentNew />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/documents/:id"
        element={
          <ProtectedRoute>
            <DocumentDetails />
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;