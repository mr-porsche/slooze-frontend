import { Route, Routes } from 'react-router-dom';
import Inventory from './pages/Inventory';
import Dashboard from './pages/Dashboard';
import { Layout } from './components/layout/Layout';
import { AuthPage } from './pages/AuthPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<AuthPage />} />
      <Route element={<Layout />}>
        {/***************** Role based access ***********/}
        {/* Allow Users with Admin, Manager, Store Keeper Roles */}
        <Route
          path='/Inventory'
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Store Keeper']}>
              <Inventory />
            </ProtectedRoute>
          }
        />

        {/* Only Admin and Manager can access Dashboard */}
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Only Admin can access Admin Panel */}
        <Route
          path='/admin'
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
