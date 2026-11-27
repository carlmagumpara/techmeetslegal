import { useState } from 'react';
import Loader from '../components/Loader.jsx';
import OrientationNotice from '../components/OrientationNotice.jsx';
import RegistrationForm from '../components/RegistrationForm.jsx';
import TrialModals from '../components/TrialModals.jsx';
import { EXPERIENCE } from '../data/scenes.js';
import { useExperience } from '../hooks/useExperience.js';
import { useTrialFlow } from '../hooks/useTrialFlow.js';
import NewLawyerScene from './generated/NewLawyerScene.jsx';

const config = EXPERIENCE.newLawyer;

export default function NewLawyer() {
  const [choice, setChoice] = useState(null);
  const flow = useTrialFlow(config.clientType);

  useExperience(config);

  return (
    <>
      <Loader />
      <OrientationNotice cover="/assets/cover.png" />
      <NewLawyerScene
        formSlot={
          <RegistrationForm
            clientType={config.clientType}
            values={flow.values}
            onChange={flow.handleChange}
            onSubmit={() => flow.submit(false)}
            errors={flow.errors}
            busy={flow.busy}
          />
        }
      />
      <TrialModals {...flow} choice={choice} setChoice={setChoice} />
    </>
  );
}
