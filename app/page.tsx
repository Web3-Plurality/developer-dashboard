"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("register")
  const [projectName, setProjectName] = useState("")
  const [website, setWebsite] = useState("")
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false) // Added loading state
  const router = useRouter()

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (activeTab === "register") {
      if (!projectName) newErrors.projectName = "Project name is required"
      if (!website) {
        newErrors.website = "Website is required"
      } else if (!/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(website)) {
        newErrors.website = "Please enter a valid URL"
      }
    }
    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsLoading(true) // Set loading to true
      console.log(email)
      if (activeTab === "register") {
        console.log(website)
        console.log(projectName)
      }

      const url = "https://app.plurality.local:443/crm/client/login"
      try {
        const response = await axios.post(url, { email })

        if (response?.data?.success) {
          if (activeTab === "register") {
            localStorage.setItem("website", website)
            localStorage.setItem("projectName", projectName)
          }
          localStorage.setItem("emailId", response.data.emailId)
          router.push("/otp")
        } else {
          console.log("Something went wrong with the request")
          setErrors({ ...errors, submit: "Login failed. Please try again." })
        }
      } catch (error) {
        console.error("Error during submission:", error)
        setErrors({ ...errors, submit: "An error occurred. Please try again." })
      } finally {
        setIsLoading(false) // Set loading to false
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Developer Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="register">Register</TabsTrigger>
              <TabsTrigger value="login">Login</TabsTrigger>
            </TabsList>
            <TabsContent value="register">
              <form onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="projectName">Name of your project</Label>
                    <Input id="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                    {errors.projectName && <span className="text-red-500 text-sm">{errors.projectName}</span>}
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} />
                    {errors.website && <span className="text-red-500 text-sm">{errors.website}</span>}
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Business Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                  </div>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="login">
              <form onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="loginEmail">Business Email</Label>
                    <Input id="loginEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                  </div>
                </div>
              </form>
            </TabsContent>
          </Tabs>
          {errors.submit && <div className="mt-4 text-red-500 text-sm">{errors.submit}</div>}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {" "}
            {/* Updated button */}
            {isLoading ? "Processing..." : activeTab === "register" ? "Register" : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

