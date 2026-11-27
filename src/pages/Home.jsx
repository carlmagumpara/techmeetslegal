import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';

const buttonMotion =
  'relative -top-[45px] inline-block cursor-pointer px-[15px] py-[8px] text-center font-oswald text-[15px] font-bold text-white no-underline transition-transform duration-500 [transition-timing-function:cubic-bezier(0.47,2.02,0.31,-0.36)] hover:scale-120 focus:scale-120 active:scale-120 sm:px-[22px] sm:py-[11px] sm:text-[18px]';

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-brand bg-[url('/assets/home/BG-texture.png')]">
      <Header />
      <main className="mx-auto w-11/12 max-w-[1170px] pt-[90px]">
        <h1 className="relative z-[1] w-full text-center font-oswald-bold text-[30px] font-bold leading-tight text-white sm:text-[45px]">
          TECHNOLOGY
          <br />
          <span className="font-oswald-light font-normal">meets</span> LEGAL PRACTICE
        </h1>

        <img
          className="relative -top-[35px] left-0 z-0 w-full portrait:-left-[30%] portrait:w-[160%] sm:-top-[70px] sm:portrait:left-0 sm:portrait:w-full"
          src="/assets/home/main-banner.png"
          alt="Technology meets legal practice"
        />

        <div className="mx-auto grid w-full max-w-[780px] grid-cols-1 gap-6 pb-16 text-center sm:grid-cols-2 sm:gap-4">
          <div className="-mt-10 sm:mt-[-40px]">
            <img className="mx-auto block w-[100px] sm:w-[140px]" src="/assets/home/nl.png" alt="New lawyer" />
            <Link to="/new-lawyer" className={`${buttonMotion} border-[5px] border-brand-darker bg-brand-dark hover:border-brand-dark hover:bg-brand-darker`}>
              I&apos;M A NEW LAWYER
            </Link>
          </div>
          <div className="sm:mt-[-40px]">
            <img className="mx-auto block w-[100px] sm:w-[140px]" src="/assets/home/pl.png" alt="Practicing lawyer" />
            <Link to="/practicing-lawyer" className={`${buttonMotion} border-[5px] border-gold-dark bg-gold hover:border-gold hover:bg-gold-dark`}>
              I&apos;M A PRACTICING LAWYER
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
