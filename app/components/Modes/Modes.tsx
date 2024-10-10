import styles from './Modes.module.scss';
import { FaMoon } from "react-icons/fa"; // Icon for Light mode
import { LuSun } from "react-icons/lu"; // Icon for Dark mode
import { useFetcher } from '@remix-run/react';
import { useForm, getFormProps } from '@conform-to/react';
import { Theme } from '~/utils/theme.server';
import { action } from '~/root';
import { ServerOnly } from 'remix-utils/server-only';
import { useRequestInfo } from '~/client/request-info';
import { useOptimisticThemeMode } from '~/routes/resources/theme-switch';

const Modes = ({
  userPreference,
}: {
  userPreference?: Theme | null
}) => {
  const fetcher = useFetcher<typeof action>(); // For submitting the form
  const requestInfo = useRequestInfo()
  const optimisticMode = useOptimisticThemeMode()
  const mode = optimisticMode ?? userPreference
  const nextMode = mode === 'dark' ? 'light' : mode === 'light' ? 'dark' : "light"

  const [form] = useForm({
    id: 'theme-switch',
    lastResult: fetcher.data?.result,
  });

  return (
    <fetcher.Form method="POST" {...getFormProps(form)} action="/">
      <ServerOnly>
        {() => (
          <input type="hidden" name="redirectTo" value={requestInfo.path} />
        )}
      </ServerOnly>
      <input type="hidden" name="theme" value={nextMode} />


      <button
        className={`${styles.button}`}
        type='submit'
      >
        <div className={styles.mode} >{mode === "light" ? "Dark" : "Light"}</div> {/* Show the state that is being toggled */}
        <div className={styles.icon}>{mode === "light" ? <FaMoon />: <LuSun />}</div>
      </button>
    </fetcher.Form>
  );
};

export default Modes;
