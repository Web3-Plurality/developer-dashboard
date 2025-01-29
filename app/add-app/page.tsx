"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useProjects } from "@/contexts/ProjectContext"
import axios from "axios"

export default function AddProjectPage() {
  const [logo, setLogo] = useState<File | null>(null)
  const [logoFile, setLogoFile] = useState<string | ''>("")
  const [profileName, setProfileName] = useState("")
  const [isLoading, setIsLoading] = useState(false) // Added loading state
  const [profileDescription, setProfileDescription] = useState("")
  const [appUrls, setAppUrls] = useState("")
  const router = useRouter()
  const { addProject } = useProjects()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const clientId = localStorage.getItem("clientId");
    const url = "https://app.plurality.local:443/crm/client-app/"
    const stytchToken = localStorage.getItem("stytchToken");
    
      const response = await axios.post(url,{
        profileName,
        profileDescription,
        clientId,
        domains: appUrls.split(",").map((url) => url.trim()),
        img: logoFile,
      },{
        headers:{
          Authorization: `Bearer ${stytchToken}`
        }
      });

      if (response?.data) {
        addProject(response?.data?.data)
        setIsLoading(false)
        router.push("/dashboard")
      }
      else{
        console.log("something went wrong with the request")
        setIsLoading(false)
      }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const img = new Image()
      img.onload = () => {
        if (img.width === img.height) {
          setLogo(file)
        } else {
          alert("Please upload a square image")
        }
      }
      img.src = URL.createObjectURL(file)

      const reader = new FileReader();
      reader.onloadend = function () {
          if (typeof reader.result === 'string') {
              setLogoFile(reader.result);
          }
      };
      reader.readAsDataURL(file);

    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="logo">Logo (Square)</Label>
                <div className="flex items-center space-x-4">
                  {logo && (
                    <img
                      src={URL.createObjectURL(logo) || "/placeholder.svg"}
                      alt="Logo preview"
                      className="w-16 h-16 object-cover"
                    />
                  )}
                  <Input id="logo" type="file" onChange={handleLogoUpload} accept="image/*" />
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="profileName">Profile Name</Label>
                <Input id="profileName" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="profileDescription">Profile Description</Label>
                <Textarea
                  id="profileDescription"
                  value={profileDescription}
                  onChange={(e) => setProfileDescription(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="appUrls">App URLs</Label>
                <p className="text-sm text-gray-500">
                  Add comma separated URLs of the app that would integrate with Plurality's Modal Box (E.g.
                  http://localhost:3000, https://abc.com etc.)
                </p>
                <Input id="appUrls" value={appUrls} onChange={(e) => setAppUrls(e.target.value)} />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Submiting..." : "Submit"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

