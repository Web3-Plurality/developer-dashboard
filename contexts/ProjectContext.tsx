"use client"
import React, { createContext, useState, useContext, type ReactNode } from "react"

interface Project {
  clientAppId: string,
  clientSecret: string
}

interface ProjectContextType {
  project: Project
  addProject: (project: Project) => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [project, setProject] = useState<Project | null>(null)

  const addProject = (project: Project) => {
    setProject(project)
  }

  return <ProjectContext.Provider value={{ project, addProject }}>{children}</ProjectContext.Provider>
}

export function useProjects() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider")
  }
  return context
}

