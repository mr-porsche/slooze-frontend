import { Route, Routes } from 'react-router-dom';
import Inventory from './pages/Inventory';
import Dashboard from './pages/Dashboard';
import { Layout } from './components/layout/Layout';
import { AuthPage } from './pages/AuthPage';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<AuthPage />} />
      <Route element={<Layout />}>
        <Route path='/Inventory' element={<Inventory />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
