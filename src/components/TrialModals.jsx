import { Link } from 'react-router-dom';
import TermsContent from './TermsContent.jsx';

function Backdrop({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center overflow-y-auto bg-black/70 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      {children}
    </div>
  );
}

function CloseButton({ onClose }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className="absolute -right-2 -top-3 z-10 h-11 w-11 cursor-pointer"
    >
      <img
        className="h-full w-full"
        src="/assets/new_lawyer/twelveth-slide/close-form.png"
        alt=""
      />
    </button>
  );
}

function ResultModal({ image, onClose }) {
  return (
    <Backdrop onClose={onClose}>
      <div className="relative w-full max-w-[560px] bg-brand bg-[url('/assets/new_lawyer/backgrounds/BG-texture.png')] bg-[length:100%_100%] p-4 text-center">
        <img className="mx-auto w-full max-w-[450px]" src={image} alt="" />
        <Link to="/" className="mx-auto mt-6 block w-[250px] max-w-full">
          <img src="/assets/new_lawyer/twelveth-slide/backtotop.png" alt="Back to top" />
        </Link>
      </div>
    </Backdrop>
  );
}

/** React replacement for the four Bootstrap modals used by the trial flow. */
export default function TrialModals({ modal, setModal, choice, setChoice, busy, submit }) {
  if (!modal) return null;

  if (modal === 'thankyou') {
    return <ResultModal image="/assets/new_lawyer/twelveth-slide/y-rec-2.png" onClose={() => setModal(null)} />;
  }

  if (modal === 'reject') {
    return <ResultModal image="/assets/reject-message.png" onClose={() => setModal(null)} />;
  }

  if (modal === 'choose') {
    return (
      <Backdrop onClose={() => setModal('terms')}>
        <div className="relative w-full max-w-[500px] bg-black/40 p-4">
          <div className="form-3 bounceInDown animated relative bg-[url('/assets/new_lawyer/twelveth-slide/termscondition-background.png')] bg-[length:100%_100%] p-5">
            <CloseButton onClose={() => setModal('terms')} />
            <div className="bg-white p-5 font-sans text-[18px]">
              <p>
                Please <b>&ldquo;Accept&rdquo;</b> the <b>Terms of Use and Privacy Policy</b> to get your <b>30-Day Trial Account.</b>
              </p>
              <div className="mt-4 text-right">
                <button
                  type="button"
                  onClick={() => setModal('terms')}
                  className="h-10 w-20 cursor-pointer bg-[url('/assets/ok-button.png')] bg-[length:100%_100%] bg-no-repeat transition-opacity hover:opacity-80"
                  aria-label="OK"
                />
              </div>
            </div>
          </div>
        </div>
      </Backdrop>
    );
  }

  return (
    <Backdrop onClose={() => setModal(null)}>
      <div className="relative w-full max-w-[700px] bg-[url('/assets/new_lawyer/twelveth-slide/termscondition-background.png')] bg-[length:100%_100%] p-4 sm:p-8">
        <CloseButton onClose={() => setModal(null)} />
        <div className="form-wrapper scroll-pane max-h-[60vh] overflow-y-auto bg-white">
          <TermsContent compact />
        </div>
        <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-end">
          <label className="flex cursor-pointer items-center gap-2 text-[18px] text-white">
            <input
              type="radio"
              name="radio-terms"
              value="accept"
              checked={choice === 'accept'}
              onChange={() => setChoice('accept')}
              className="h-5 w-5 cursor-pointer accent-brand-dark"
            />
            Accept
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-[18px] text-white">
            <input
              type="radio"
              name="radio-terms"
              value="reject"
              checked={choice === 'reject'}
              onChange={() => setChoice('reject')}
              className="h-5 w-5 cursor-pointer accent-brand-dark"
            />
            Reject
          </label>
          <button
            id="btn-terms-submit"
            type="button"
            disabled={busy}
            onClick={async () => {
              if (choice === 'accept') await submit(true);
              else if (choice === 'reject') setModal('reject');
              else setModal('choose');
            }}
            className="h-[50px] w-[100px] cursor-pointer bg-[url('/assets/new_lawyer/twelveth-slide/submit-1.png')] bg-[length:100%_100%] bg-no-repeat transition-transform hover:scale-120 hover:bg-[url('/assets/new_lawyer/twelveth-slide/submit.png')] disabled:opacity-60"
            aria-label="Submit terms decision"
          />
        </div>
      </div>
    </Backdrop>
  );
}
