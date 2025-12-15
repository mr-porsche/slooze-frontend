import { Route, Routes } from 'react-router-dom';
import Inventory from './pages/Inventory';
import Dashboard from './pages/Dashboard';
import { Layout } from './components/layout/Layout';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Inventory />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
