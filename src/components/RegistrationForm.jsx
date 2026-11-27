const FIELDS = [
  { id: 'first_name', label: '*First Name', type: 'text' },
  { id: 'last_name', label: '*Last Name', type: 'text' },
  { id: 'email', label: '*Work E-mail', type: 'email' },
  { id: 'phone', label: '*Phone', type: 'tel' },
  { id: 'company_name', label: '*Company Name', type: 'text' },
  { id: 'position', label: '*Position', type: 'text' },
];

/** The 30-day trial form. State is owned by useTrialFlow. */
export default function RegistrationForm({
  clientType,
  values,
  onChange,
  onSubmit,
  errors = {},
  busy = false,
  standalone = false,
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      autoComplete="off"
      className="w-full"
    >
      <input type="hidden" id="client_type" value={clientType} readOnly />
      <div className={standalone ? 'grid grid-cols-1 gap-4 sm:grid-cols-[29%_71%] sm:gap-y-5' : 'space-y-4'}>
        {FIELDS.map((field) => (
          <div key={field.id} id={`${field.id}_group`} className={standalone ? 'contents' : 'flex items-center gap-3'}>
            <label
              htmlFor={field.id}
              className={`font-oswald text-white ${standalone ? 'self-center text-[21px] sm:text-[17px]' : 'w-[29%] shrink-0 text-left text-[17px]'}`}
            >
              {field.label}
            </label>
            <div className={standalone ? '' : 'w-[71%]'}>
              <input
                type={field.type}
                id={field.id}
                name={field.label.replace('*', '')}
                value={values[field.id]}
                onChange={onChange}
                aria-invalid={Boolean(errors[field.id])}
                className={`h-[47px] w-full rounded-none border-[5px] border-brand-dark px-2 text-[18px] font-bold text-brand-dark sm:text-[22px] ${
                  errors[field.id] ? 'border-[#d00000]' : ''
                }`}
              />
              {errors[field.id] && (
                <p className="mt-1 text-[13px] text-white">
                  Required field{field.id === 'email' ? ' (use a valid email address)' : ''}
                </p>
              )}
            </div>
          </div>
        ))}

        <div className={standalone ? 'contents' : 'flex items-center gap-3'}>
          <label
            htmlFor="message"
            className={`font-oswald text-white ${standalone ? 'self-start text-[21px] sm:text-[17px]' : 'w-[29%] shrink-0 text-left text-[17px]'}`}
          >
            Message
          </label>
          <div className={standalone ? '' : 'w-[71%]'}>
            <textarea
              id="message"
              name="Message"
              rows="2"
              value={values.message}
              onChange={onChange}
              className="h-auto w-full rounded-none border-[5px] border-brand-dark px-2 text-[18px] font-bold text-brand-dark sm:text-[22px]"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[420px] text-left text-[14px] font-bold text-white">
          By clicking the &quot;Submit&quot; button, you agree to the 30-day trial agreement Terms of Use and Privacy Policy.
        </p>
        <button
          id="main-submit"
          type="submit"
          disabled={busy}
          aria-label="Submit trial registration"
          className="h-[60px] w-[110px] shrink-0 cursor-pointer bg-[url('/assets/new_lawyer/twelveth-slide/submit-1.png')] bg-[length:100%_100%] bg-no-repeat transition-transform duration-500 hover:scale-120 hover:bg-[url('/assets/new_lawyer/twelveth-slide/submit.png')] disabled:opacity-60"
        />
      </div>
      {errors.form && <p className="mt-3 text-left text-[14px] font-bold text-white">{errors.form}</p>}
    </form>
  );
}
