import { useEffect, useState } from 'react';

export default function Loader({ label = 'Loading...' }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setHidden(true);
    };
    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish, { once: true });
    // Fallback for cached assets / stalled third-party embeds.
    const timer = window.setTimeout(finish, 1400);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('load', finish);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-brand bg-[url('/assets/new_lawyer/backgrounds/BG-texture.png')]"
      role="status"
      aria-live="polite"
    >
      <img className="h-20 w-20" src="/assets/ELSA_Preloader_v2.gif" alt="" />
      <h2 className="mt-4 text-center text-white">{label}</h2>
    </div>
  );
}
