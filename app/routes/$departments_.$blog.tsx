import { Server } from "~/utils/server";
import styles from "../styles/pages/blog.module.scss"
import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import ReactMarkdown from 'react-markdown';

interface ProjectContent {
  status: string;
  project: {
    id: number;
    name: string;
    description: string;
    image: string;
    category_name: string;
    content: string;
  }
}

interface Project {
  id: number;
  name: string;
  description: string;
  image: string;
  category_name: string;
  content: string;
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


  return [
    { title: project.name },
    { name: "description", content: project.description },
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
        <div className={styles.description}>
          <ReactMarkdown>{project.content}</ReactMarkdown>
        </div>
      </div>
    </section>
  )
}

export default Blog