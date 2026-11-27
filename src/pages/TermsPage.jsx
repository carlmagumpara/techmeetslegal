import { Link } from 'react-router-dom';
import TermsContent from '../components/TermsContent.jsx';

export default function TermsPage() {
  return (
    <div className="min-h-screen overflow-y-auto bg-brand bg-[url('/assets/home/BG-texture.png')]">
      <nav className="mx-auto flex w-full max-w-[900px] items-center justify-between px-5 py-6">
        <Link to="/" className="font-oswald text-[18px] text-white hover:underline">
          &laquo; BACK TO HOME
        </Link>
        <a
          href="http://www.e-lawsolutions.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-oswald text-[15px] text-white hover:underline"
        >
          GO TO ELSA WEBSITE &raquo;
        </a>
      </nav>
      <main className="mx-auto mb-12 w-[92%] max-w-[700px] bg-white shadow-xl">
        <TermsContent />
      </main>
    </div>
  );
}
