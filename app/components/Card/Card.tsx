import styles from './Card.module.scss';
import { Server } from '../../utils/server';
import { Link } from '@remix-run/react';
import { IoIosArrowRoundForward } from "react-icons/io";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface Card {
  project: {
    id: number;
    name: string;
    description: string;
    image: string;
    category_name: string;
  },
  cardNo: number;
}

const isOdd = (number: number) => {
  return number % 2 !== 0;
};

const Card: React.FC<Card> = ({ project, cardNo }) => {
  const controls = useAnimation(); // For parent animation
  const descriptionControls = useAnimation(); // For child animation
  const [currentScrollY, setCurrentScrollY] = useState(0);
  const [ref, inView] = useInView({
    threshold: 0.1, // Trigger when 30% of the card is visible
  });

  // Debounce the scroll event handler to reduce excessive state updates
  const handleScroll = () => {
    const scrollY = window.scrollY;
    setCurrentScrollY(scrollY);
  };

  useEffect(() => {
    // Add event listener for scroll with throttling
    const throttledScroll = () => {
      let timeout: NodeJS.Timeout;
      return () => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(handleScroll, 100);
      };
    };

    const handleThrottledScroll = throttledScroll();
    window.addEventListener('scroll', handleThrottledScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleThrottledScroll);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Trigger parent and child animations based on inView status
  useEffect(() => {
    if (inView) {
      controls.start('visible'); // Parent animation starts
      descriptionControls.start('visible'); // Child animation starts
    } else {
      controls.start('hidden');
      descriptionControls.start('hidden');
    }
  }, [inView, controls, descriptionControls]);

  // Parent animation variants for scroll effect
  const boxVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // Child (description) animation variants
  const descriptionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.7, ease: "easeOut", delay: 0.5 }, // Adding a delay for sequential effect
    },
  };

  return (
    <motion.div 
      className={`${styles.cardview}`} 
      ref={ref}  // Reference for inView detection
      initial="hidden"
      animate={controls} // Parent animation controls
      variants={boxVariants}
    >
      <div className={`${isOdd(cardNo) ? styles.topreverse : styles.top}`}>
        <img 
          src={`${Server.media}${project.image}`} 
          alt={project.name} 
          width={600} 
          height={300} 
        />
      </div>
      <div className={styles.bot}>
        <div className={styles.title}>{project.name}</div>
        {/* Child motion.div with a separate animation */}
        <motion.div
          initial="hidden"
          animate={descriptionControls} // Child animation controls
          variants={descriptionVariants} // Animation variants for the child
          className={styles.description}
        >
          {project.description}
        </motion.div>
        <Link className={styles.linker} to={`/${project.category_name}/${project.id}`}>
          <div className={styles.number}>
            {(cardNo + 1) >= 10 ? (cardNo + 1) : "0" + (cardNo + 1)}
          </div>
          <div className={styles.readmore}>
            read more
            <IoIosArrowRoundForward />
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default Card;
