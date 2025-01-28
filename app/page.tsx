"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import  axios from "axios"

export default function LoginPage() {
  const [projectName, setProjectName] = useState("")
  const [website, setWebsite] = useState("")
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const router = useRouter()

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (!projectName) newErrors.projectName = "Project name is required"
    if (!website) {
      newErrors.website = "Website is required"
    } else if (!/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(website)) {
      newErrors.website = "Please enter a valid URL"
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
      // In a real application, you would send this data to your backend
      // For now, we'll just navigate to the OTP page
      console.log(email)
      console.log(website)
      console.log(projectName)



      const url = "https://app.plurality.local:443/crm/client/login"
      const response = await axios.post(url,{
        email,
      });

      if (response?.data?.success) {
        localStorage.setItem("website",website);
        localStorage.setItem("projectName",projectName);
        localStorage.setItem("emailId", response.data.emailId);
        router.push("/otp")
      }
      else{
        console.log("something went wrong with the request")
      }
      
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" onClick={handleSubmit}>
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

