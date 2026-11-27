import { useState } from 'react';
import { Link } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm.jsx';
import TrialModals from '../components/TrialModals.jsx';
import { useTrialFlow } from '../hooks/useTrialFlow.js';

/** Standalone equivalent of nl-form.html / pl-form.html. */
export default function FormPage({ clientType }) {
  const [choice, setChoice] = useState(null);
  const flow = useTrialFlow(clientType);

  return (
    <div className="min-h-screen bg-brand bg-[url('/assets/new_lawyer/backgrounds/BG-texture.png')] pb-16">
      <nav className="mx-auto flex w-full max-w-[700px] items-center justify-between px-5 py-6">
        <Link to="/" className="font-oswald text-[18px] text-white hover:underline">
          &laquo; BACK TO HOME
        </Link>
        <Link to="/terms" className="font-oswald text-[15px] text-white hover:underline">
          TERMS &amp; PRIVACY
        </Link>
      </nav>
      <main className="mx-auto w-[92%] max-w-[700px] bg-[url('/assets/new_lawyer/twelveth-slide/termscondition-background-1.png')] bg-[length:100%_100%] px-5 py-8 sm:px-10">
        <img className="mx-auto mb-6 w-[320px] max-w-full" src="/assets/Signup.png" alt="Sign up for a 30-day trial" />
        <RegistrationForm
          clientType={clientType}
          values={flow.values}
          onChange={flow.handleChange}
          onSubmit={() => flow.submit(false)}
          errors={flow.errors}
          busy={flow.busy}
          standalone
        />
      </main>
      <TrialModals {...flow} choice={choice} setChoice={setChoice} />
    </div>
  );
}
