import { Link } from 'react-router-dom';

/** Shared dark navigation bar from the original home screen. */
export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-[999] h-[70px] bg-ink bg-[url('/assets/home/BG-texture.png')]">
      <nav className="mx-auto flex h-full w-full items-center justify-between px-3 sm:px-6 lg:w-1/2" aria-label="Main navigation">
        <a
          href="http://www.e-lawsolutions.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-full items-center"
          aria-label="Visit the ELSA website"
        >
          <span className="ml-[10px] block h-[60px] w-[50px] bg-[url('/assets/home/logo.png')] bg-[length:40px] bg-[position:5px_5px] bg-no-repeat" />
        </a>
        <Link
          to="/"
          className="hidden font-oswald text-[15px] text-white hover:text-brand sm:block sm:text-[17px]"
        >
          HOME
        </Link>
        <a
          href="http://www.e-lawsolutions.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 font-oswald text-[13px] text-white hover:text-brand sm:text-[17px]"
        >
          GO TO ELSA WEBSITE &raquo;
        </a>
      </nav>
    </header>
  );
}
