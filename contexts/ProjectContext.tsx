"use client"

import React, { createContext, useState, useContext, type ReactNode } from "react"

interface Project {
  logo: string | null
  profileName: string
  profileDescription: string
  appUrls: string[]
}

interface ProjectContextType {
  projects: Project[]
  addProject: (project: Project) => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])

  const addProject = (project: Project) => {
    setProjects((prevProjects) => [...prevProjects, project])
  }

  return <ProjectContext.Provider value={{ projects, addProject }}>{children}</ProjectContext.Provider>
}

export function useProjects() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider")
  }
  return context
}

