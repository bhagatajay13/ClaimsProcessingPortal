import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ClaimsDashboard from './pages/ClaimsDashboard';
import ClaimDetails from './pages/ClaimDetails';

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-[#F7F8FC]">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Header />
        <main className="p-6">
          <Routes>
            <Route path="/" element={<ClaimsDashboard />} />
            <Route path="/claims" element={<ClaimsDashboard />} />
            <Route path="/claims/:claimId" element={<ClaimDetails />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}