import { json } from "@remix-run/react";
import { Server } from "./server"

interface Categories {
    categories: {
      id: number;
      name: string;
      description: string;
      image: string;
    }[]
}

export const getCategories = async () => {
    const response = await fetch(`${Server.apiv1}/categories`)
    const category: Categories = await response.json()
    return json(category.categories)
}

//------------------------------------------------------------------------


interface Contact {
    contact: {
      landline: string;
      mobile_number: string;
      twitter_account: string;
      instagram_account: string;
      facebook_account: string;
      linkedin_account: string;
      email: string;
    }[]
}


export const getContact = async () => {
    const response = await fetch(`${Server.apiv1}/contact`)
    const contact: Contact = await response.json()
    return contact.contact[0]
}

//------------------------------------------------------------------------

interface Projects {
    projects: {
      id: number;
      name: string;
      description: string;
      image: string;
      category_name: string;
      content: string;
    }[]
}



export const getProjects = async (departmentName: string) => {
    const response = await fetch(`${Server.apiv1}/projects/${departmentName}`, { cache: "no-cache" })
    const projects: Projects = await response.json()
    return projects.projects
}


export const getAllProjects = async () => {
  const response = await fetch(`${Server.apiv1}/project-all`, { cache: "no-cache" })
  const projects: Projects = await response.json()
  return projects.projects
}

//------------------------------------------------------------------------

interface Project {
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


export const getProject = async (projectId: string) => {
  const response = await fetch(`${Server.apiv1}/project-id/${projectId}`, { cache: "no-cache" })
  const projects: Project = await response.json()
  return projects.project
}



