import { LoaderFunction, MetaFunction } from '@remix-run/node';
import { redirect, useLoaderData, useParams } from '@remix-run/react';
import Card from '~/components/Card/Card';
import styles from "../../styles/pages/departments.module.scss"
import { Server } from '~/utils/server';
import { useTheme } from '../resources/theme-switch';
import { FaAngleDoubleDown } from "react-icons/fa";
import { useEffect, useState, useRef } from 'react';

interface Projects {
  projects: Project[],
  status: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  image: string;
  category_name: string;
  content: string;
}

type SingleProject = Project[]

export const loader: LoaderFunction = async ({ request, params, context }) => {
  const slug = params.departments  // Get the dynamic `id` from the URL
  const response = await fetch(`${Server.apiv1}/projects/${slug}`, { cache: "force-cache" })
  const projects: Projects = await response.json()

  if (projects.status) {
    return redirect("/404")
  }

  return projects.projects
};

export const meta: MetaFunction = () => {
  const { departments } = useParams()
  const theme = useTheme()

  return [
    { title: departments },
    { name: "description", content: `${departments} Professional solutions for Software Development, Hardware Design, Repair, and Upgrades, delivering expert services to optimize performance and meet your technology needs.` },
    { name: "theme-color", content: theme === "dark" ? "#262626": "#fff" },
  ];
};

const Departments = () => {
  const { departments } = useParams();
  const projects = useLoaderData<SingleProject>();
  const [showArrow, setShowArrow] = useState(true);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]); // Array to hold references to each card

  // Scroll handling logic
  const scrollToNextCard = () => {
    const currentScroll = window.scrollY;
    const nextCard = cardRefs.current.find(
      (ref) => ref && ref.offsetTop > currentScroll + window.innerHeight / 2
    );
    
    if (nextCard) {
      nextCard.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight; // Current scroll position + viewport height
      const documentHeight = document.documentElement.scrollHeight; // Total height of the document
  
      // Set threshold to 100px before reaching the end of the page
      const threshold = 500;
  
      if (scrollPosition >= documentHeight - threshold) {
        setShowArrow(false); // Hide arrow when close to the bottom
      } else {
        setShowArrow(true); // Show arrow when not close to the bottom
      }
    };
  
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className={styles.departments}>
      <div className={styles.title}>{departments}</div>
      <div className={styles.card}>
        {
          projects.map((project, idx) => (
            <div
              key={project.id}
              ref={(el) => (cardRefs.current[idx] = el)} // Assign ref for each card
              className={styles.projectCard}
            >
              <Card project={project} cardNo={idx} />
            </div>
          ))
        }
      </div>

      {
        showArrow && projects.length > 1 && (
          <div className={styles.arrow} onClick={scrollToNextCard}>
            <FaAngleDoubleDown />
          </div>
        )
      }
    </section>
  );
}

export default Departments;
