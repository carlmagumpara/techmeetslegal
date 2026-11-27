import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import NewLawyer from './pages/NewLawyer.jsx';
import PracticingLawyer from './pages/PracticingLawyer.jsx';
import TermsPage from './pages/TermsPage.jsx';
import FormPage from './pages/FormPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/new-lawyer" element={<NewLawyer />} />
      <Route path="/practicing-lawyer" element={<PracticingLawyer />} />
      <Route path="/new-lawyer/form" element={<FormPage clientType="New Lawyer" />} />
      <Route path="/practicing-lawyer/form" element={<FormPage clientType="Practicing Lawyer" />} />
      <Route path="/terms" element={<TermsPage />} />
      {/* Keep the original static URLs working for existing bookmarks. */}
      <Route path="/index.html" element={<Navigate to="/" replace />} />
      <Route path="/new-lawyer.html" element={<Navigate to="/new-lawyer" replace />} />
      <Route path="/practicing-lawyer.html" element={<Navigate to="/practicing-lawyer" replace />} />
      <Route path="/nl-form.html" element={<Navigate to="/new-lawyer/form" replace />} />
      <Route path="/pl-form.html" element={<Navigate to="/practicing-lawyer/form" replace />} />
      <Route path="/termsandprivacy.html" element={<Navigate to="/terms" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
