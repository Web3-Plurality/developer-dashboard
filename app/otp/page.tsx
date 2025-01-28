"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import axios from "axios"

export default function OTPPage() {
  const [otp, setOtp] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would verify the OTP here
    // For now, we'll just navigate to the dashboard
    const website = localStorage.getItem("website");
    const projectName = localStorage.getItem("projectName");
    const emailId = localStorage.getItem("emailId");


    const url = "https://app.plurality.local:443/crm/client/authenticate"
    const response = await axios.post(url,{
      code : otp,
      projectName : projectName,
      projectWebsite: website,
      emailId : emailId
    });

    if (response?.data?.success) {
      console.log("response otp", response)
      localStorage.setItem("clientId", response.data.client.id);
      router.push("/dashboard")
    }
    else{
      console.log("something went wrong with the request")
    }


  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Enter OTP</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="otp">OTP</Label>
              <Input id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter your OTP" />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" onClick={handleSubmit}>
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

