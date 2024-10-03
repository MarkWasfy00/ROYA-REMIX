import { MetaFunction } from '@remix-run/react';
import styles from '../styles/pages/404.module.scss'

export const meta: MetaFunction =  () => {

  return [
    { title: "Page Not Found" },
    { name: "description", content: "Error 404" },
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