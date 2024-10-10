import {  LoaderFunction, MetaFunction } from '@remix-run/node';
import { redirect, useLoaderData, useParams } from '@remix-run/react';
import Card from '~/components/Card/Card';
import styles from "../../styles/pages/departments.module.scss"
import { Server } from '~/utils/server';
import { useTheme } from '../resources/theme-switch';

interface Projects {
  projects: {
    id: number;
    name: string;
    description: string;
    image: string;
    category_name: string;
    content: string;
  }[],
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


const departments = () => {
  const projects = useLoaderData<SingleProject>()

  return (
    <section className={styles.departments}>
      {
        projects.map(project => (
          <Card key={project.id}  project={project} />
        ))
      }
    </section>
  )
}

export default departments