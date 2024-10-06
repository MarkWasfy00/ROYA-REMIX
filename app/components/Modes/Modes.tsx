import styles from './Modes.module.scss';
import { FaMoon } from "react-icons/fa"; // Icon for Light mode
import { LuSun } from "react-icons/lu"; // Icon for Dark mode
import { useFetcher } from '@remix-run/react';
import { useForm, getFormProps } from '@conform-to/react';
import { useState } from 'react';
import { Theme } from '~/utils/theme.server';
import { action } from '~/root';
import { ServerOnly } from 'remix-utils/server-only';
import { useRequestInfo } from '~/client/request-info';

const Modes = ({
  userPreference,
}: {
  userPreference?: Theme | null
}) => {
  const fetcher = useFetcher<typeof action>(); // For submitting the form
  const requestInfo = useRequestInfo()

  const [form] = useForm({
    id: 'theme-switch',
    lastResult: fetcher.data?.result,
  });

  const [theme, setTheme] = useState<Theme>(userPreference || 'light');

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  const modeLabel = {
    light: "Dark",
    dark: "Light",
  };


  const buttonIcon = modeLabel[theme] === "Light" ? <LuSun />: <FaMoon />;
  return (
    <fetcher.Form method="POST" {...getFormProps(form)} action="/">
      <ServerOnly>
        {() => (
          <input type="hidden" name="redirectTo" value={requestInfo.path} />
        )}
      </ServerOnly>
      <input type="hidden" name="theme" value={theme} />


      <button
        className={`${styles.button}`}
        type='submit'
        onClick={toggleTheme}
      >
        <div className={styles.mode} >{modeLabel[theme]}</div> {/* Show the state that is being toggled */}
        <div className={styles.icon}>{buttonIcon}</div>
      </button>
    </fetcher.Form>
  );
};

export default Modes;
