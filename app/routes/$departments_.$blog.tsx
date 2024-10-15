import { Server } from "~/utils/server";
import styles from "../styles/pages/blog.module.scss"
import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import ReactMarkdown from 'react-markdown';
import { useTheme } from "./resources/theme-switch";



interface ProjectContent {
  status: string;
  project: Project
}

interface Project {
  id: number;
  name: string;
  description: string;
  image: string;
  category_name: string;
  content: string;
  createdAt: string;
}

function formatTimestamp(isoString: string): string {
  const date: Date = new Date(isoString);

  // Get day, month, year, etc., with proper options for formatting
  const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric', 
      second: 'numeric', 
      hour12: true 
  };
  
  // Convert to a human-readable format
  return date.toLocaleDateString('en-US', options);
}

export const loader: LoaderFunction = async ({ request, params, context }) => {
  const { departments, blog } = params

  const response = await fetch(`${Server.apiv1}/project-id/${blog}`, { cache: "force-cache" })
  const projects: ProjectContent = await response.json()
  if (projects.status) {
    return redirect("/404")
  }
  
  return projects.project
};

export const meta: MetaFunction =  ({ data }) => {
  const project = data as Project
  const theme = useTheme()

  return [
    { title: project.name },
    { name: "description", content: project.description },
    { name: "theme-color", content: theme === "dark" ? "#262626": "#fff" },
  ];
};



const Blog = ({ params }: { params: { department: string; blog: string } }) => {
  const project = useLoaderData<Project>()

  
  return (
    <section className={styles.section}>
      <div className={styles.cover}>
        <img src={`${Server.media}${project.image}`} alt={project.name}  width={900} height={300} />
      </div>
      <div className={styles.blog}>
        <div className={styles.title}>{project.name}</div>
        <div className={styles.date}>{ formatTimestamp(project.createdAt)}</div>
        <div className={styles.description}>
          <ReactMarkdown>{project.content}</ReactMarkdown>
        </div>
      </div>
    </section>
  )
}

export default Blog