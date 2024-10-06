import styles from './Recent.module.scss'

const Recent = () => {
  return (
    <section className={styles.container}>
        {/* <div className={styles.title}>Recent Projects</div> */}
        <div className={styles.projects}>
            <div className={styles.project}>
                <img src="https://roya-technology.com/media/project_images/ivan-bandura-lZCHy8PLyyo-unsplash_6RlVZoY.jpg" alt="" />
            </div>
            <div className={styles.project}>
                <img src="https://roya-technology.com/media/project_images/ivan-bandura-lZCHy8PLyyo-unsplash_6RlVZoY.jpg" alt="" />
            </div>
            <div className={styles.project}>
                <img src="https://roya-technology.com/media/project_images/ivan-bandura-lZCHy8PLyyo-unsplash_6RlVZoY.jpg" alt="" />
            </div>
            <div className={styles.project}>
                <img src="https://roya-technology.com/media/project_images/ivan-bandura-lZCHy8PLyyo-unsplash_6RlVZoY.jpg" alt="" />
            </div>
            <div className={styles.project}>
                <img src="https://roya-technology.com/media/project_images/ivan-bandura-lZCHy8PLyyo-unsplash_6RlVZoY.jpg" alt="" />
            </div>
        </div>
    </section>
  )
}

export default Recent