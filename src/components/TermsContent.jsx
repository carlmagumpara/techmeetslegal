import sections from '../data/terms.json';

/** The 30-day trial agreement / privacy policy copy from the original page. */
export default function TermsContent({ compact = false }) {
  return (
    <div className={`mx-auto w-full ${compact ? 'max-w-[540px] px-4 py-6' : 'max-w-[700px] px-5 py-10 sm:px-8'}`}>
      <h1 className="text-center text-[25px] font-bold text-[#115f6c]">E-LAW SOLUTIONS APP (ELSA)</h1>
      <hr className="my-4 border-[#115f6c]/30" />
      {sections.slice(1).map(([tag, text], index) => {
        if (!text) return null;
        if (tag === 'h4') {
          return (
            <h2 key={index} className="mt-8 text-left text-[18px] font-bold text-[#115f6c]">
              {text}
            </h2>
          );
        }
        return (
          <p key={index} className="mt-4 text-left font-sans text-[15px] leading-relaxed text-[#333]">
            {text}
          </p>
        );
      })}
    </div>
  );
}
