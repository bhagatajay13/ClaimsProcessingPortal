import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ClaimsDashboard from './pages/ClaimsDashboard';
import ClaimDetails from './pages/ClaimDetails';
import DocumentWorkspace from './pages/DocumentWorkspace';
import Dashboard from './pages/Dashboard';

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-[#F7F8FC]">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Header />
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/claims" element={<ClaimsDashboard />} />
            <Route path="/claims/:claimId" element={<ClaimDetails />} />
            <Route path="/claims/:claimId/document/:documentId" element={<DocumentWorkspace />} />
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