import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import InquiryList from './pages/inquiry/InquiryList';
import InquiryDetail from './pages/inquiry/InquiryDetail';
import OfferList from './pages/offer/OfferList';
import OfferDetail from './pages/offer/OfferDetail';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inquiries" element={<InquiryList />} />
          <Route path="/inquiries/:id" element={<InquiryDetail />} />
          <Route path="/offers" element={<OfferList />} />
          <Route path="/offers/:id" element={<OfferDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
