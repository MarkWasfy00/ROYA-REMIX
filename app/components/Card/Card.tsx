import styles from './Card.module.scss'
import { Server } from '../../utils/server';
import { Link } from '@remix-run/react';

interface Card {
  project: {
    id: number;
    name: string;
    description: string;
    image: string;
    category_name: string;
  }
}


const Card: React.FC<Card> = ({  project }) => {
  return (
    <div className={styles.card}>
        <div className={styles.top}>
            <img src={`${Server.media}${project.image}`} alt={project.name} width={600} height={300} />
        </div>
        <div className={styles.bot}>
            <div className={styles.title}>{project.name}</div>
            <div className={styles.description}>{project.description}</div>
            <Link className={styles.linker} to={`/${project.category_name}/${project.id}`}>
              <button className={styles.link}>VIEW</button>
            </Link>   
        </div>
    </div>
  )
}

export default Card