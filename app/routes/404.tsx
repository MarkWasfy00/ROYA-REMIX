import { MetaFunction } from '@remix-run/react';
import styles from '../styles/pages/404.module.scss'
import { useTheme } from './resources/theme-switch';

export const meta: MetaFunction =  () => {
  const theme = useTheme()
  return [
    { title: "Page Not Found" },
    { name: "description", content: "Error 404" },
    { name: "theme-color", content: theme === "dark" ? "#262626": "#fff" },
  ];
};



const error = () => {
  return (
    <main className={styles.container}>
      <section className={styles.notfound}>404 | Page Not Found</section>
    </main>
  )
}

export default error