"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function OTPPage() {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [isLogin, setIsLogin] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // Added loading state
  const router = useRouter()

  useEffect(() => {
    // Check if we're coming from login or registration
    const website = localStorage.getItem("website")
    setIsLogin(!website)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true) // Set loading to true

    const website = localStorage.getItem("website")
    const projectName = localStorage.getItem("projectName")
    const emailId = localStorage.getItem("emailId")

    const url = "https://app.plurality.local:443/crm/client/authenticate"

    try {
      const response = await axios.post(url, {
        code: otp,
        projectName: isLogin ? undefined : projectName,
        projectWebsite: isLogin ? undefined : website,
        emailId: emailId,
      })

      if (response?.data?.success) {
        console.log("response otp", response)
        localStorage.setItem("clientId", response.data.client.id)
        localStorage.setItem("stytchToken", response.data.stytchToken);
        router.push("/dashboard")
      } else {
        setError("Authentication failed. Please try again.")
      }
    } catch (error) {
      console.error("Error during OTP verification:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false) // Set loading to false after request completes
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
            {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

