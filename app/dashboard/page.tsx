"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { PlusCircle, Loader2 } from "lucide-react"
import AppCard from "@/components/AppCard"


interface ClientApp {
  logo: string | null
  profileName: string
  profileDescription: string
  domains: string[],
  id: string,
  clientSecret: string,
  streamId: string
}

export default function DashboardPage() {
  const [clientApps, setClientApps] = useState<ClientApp[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const getClientApps = async () => {
    const url = "https://app.plurality.local:443/crm/client"
    const clientId = localStorage.getItem("clientId")
    const stytchToken = localStorage.getItem("stytchToken");

    if (!clientId) {
      setError("Client ID not found. Please log in again.")
      setIsLoading(false)
      localStorage.clear();
      router.push("/")

      return
    }

    try {
      const response = await axios.get(`${url}/${clientId}`,{
        headers:{
          Authorization: `Bearer ${stytchToken}`
        }
      })
      console.log(response)
      if (response.data && Array.isArray(response.data.apps)) {
        setClientApps(response.data.apps)
      } else {
        setError("Unexpected data format received from server")
      }
    } catch (err) {
      setError("You are not authorize please login again")
      console.error("Error fetching client apps:", err)
      router.push("/")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getClientApps()
  }, []) //Fixed useEffect dependency issue


  const logout = () =>{
    localStorage.clear();
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Developer Dashboard</h1>
      <Button onClick={()=>{logout()}}>Logout</Button>
       <Button onClick={() => router.push("/add-app")} className="mb-4 rounded-full">
        <PlusCircle className="mr-2 h-4 w-4" /> Add App
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
     { clientApps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  )
}

