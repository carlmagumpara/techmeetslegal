import { useCallback, useState } from 'react';

const ENDPOINT =
  import.meta.env.VITE_TRIAL_REGISTRATIONS_URL ||
  'https://e-lawsolutions.com/trial_registrations';

const EMPTY = {
  first_name: '', last_name: '', email: '', phone: '',
  company_name: '', position: '', message: '',
};

/** Owns registration values, submission and the four legacy modal states. */
export function useTrialFlow(clientType) {
  const [values, setValues] = useState({ ...EMPTY });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [modal, setModal] = useState(null);

  const handleChange = useCallback((event) => {
    const { id, value } = event.target;
    setValues((current) => ({ ...current, [id]: value }));
    setErrors((current) => ({ ...current, [id]: undefined }));
  }, []);

  const submit = useCallback(async (termsAccepted) => {
    setBusy(true);
    setErrors({});
    const payload = new URLSearchParams({
      'trial_registration[client_type]': clientType,
      'trial_registration[first_name]': values.first_name,
      'trial_registration[last_name]': values.last_name,
      'trial_registration[email]': values.email,
      'trial_registration[phone]': values.phone,
      'trial_registration[company_name]': values.company_name,
      'trial_registration[position]': values.position,
      'trial_registration[message]': values.message,
      terms_accepted: String(termsAccepted),
    });

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: payload,
      });
      const data = await response.json();
      if (data.action === 'open_terms_modal') {
        setModal('terms');
      } else if (data.action === 'open_thankyou_modal') {
        setModal('thankyou');
        setValues({ ...EMPTY });
      } else if (data.errors) {
        setErrors(data.errors);
      }
      return data;
    } catch {
      setErrors({ form: 'Unable to submit right now. Please try again.' });
      return null;
    } finally {
      setBusy(false);
    }
  }, [clientType, values]);

  return {
    values,
    errors,
    busy,
    modal,
    setModal,
    handleChange,
    submit,
  };
}
