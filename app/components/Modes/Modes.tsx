import styles from './Modes.module.scss';
import { FaMoon } from "react-icons/fa"; // Icon for Light mode
import { LuSun } from "react-icons/lu"; // Icon for Dark mode
import { useFetcher } from '@remix-run/react';
import { useForm, getFormProps } from '@conform-to/react';
import { useState } from 'react';
import { useOptimisticThemeMode } from '~/routes/resources/theme-switch';

// Global variable to hold the theme mode
let currentTheme = 'light'; // Default theme

const Modes = () => {
  const fetcher = useFetcher(); // For submitting the form
  const resolvedTheme = useOptimisticThemeMode() ||currentTheme; // Fallback to 'dark' if undefined
  const [form] = useForm({ id: 'theme-switch' }); // Create the form

  // State to manage button text and icon
  const [buttonState, setButtonState] = useState(resolvedTheme === 'dark' ? 'Light' : 'Dark');

  // Toggle theme and submit the form
  const toggleMode = () => {
    // Determine the new mode based on the current resolvedTheme
    const newMode = resolvedTheme === 'dark' ? 'light' : 'dark';
    currentTheme=newMode
    // Submit the form programmatically
    fetcher.submit(
      {
        theme: newMode, // Send the newMode
      },
      {
        method: 'post',
        action: '/', // Your action path in Remix
      }
    );

    // Update the button state immediately to reflect the next mode
    setButtonState(newMode === 'dark' ? 'Light' : 'Dark');
  };

  // Use resolvedTheme to determine the button icon
  const buttonIcon = resolvedTheme === "light" ? <FaMoon /> : <LuSun />;

  return (
    <fetcher.Form method="POST" {...getFormProps(form)} action="/">
      <input type="hidden" name="theme" value={resolvedTheme === 'dark' ? 'light' : 'dark'} />

      <div
        className={`${styles.button} ${resolvedTheme === "light" ? styles.dark : styles.light}`}
        onClick={toggleMode}
      >
        <div className={styles.mode}>{buttonState}</div> {/* Show the state that is being toggled */}
        <div className={styles.icon}>{buttonIcon}</div>
      </div>
    </fetcher.Form>
  );
};

export default Modes;
