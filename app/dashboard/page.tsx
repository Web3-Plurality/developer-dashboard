"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import ProjectCard from "@/components/ProjectCard"
import Link from "next/link"
import { useProjects } from "@/contexts/ProjectContext"
import { useEffect } from "react"
import axios from "axios"

export default function DashboardPage() {
  const { projects } = useProjects()

const getClientApps = async()=>{
  const url = "https://app.plurality.local:443/crm/client";
  const clientId = localStorage.getItem("clientId")
  const response = await axios.get(url + "/" + clientId)
  console.log(response)
}
  useEffect(()=>{

    getClientApps()
    

  },[])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Developer Dashboard</h1>
      <Link href="/add-project">
        <Button className="mb-4 rounded-full">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </div>
  )
}

