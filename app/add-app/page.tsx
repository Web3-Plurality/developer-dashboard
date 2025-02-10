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
import NextImage from "next/image"
import { Plus, X } from "lucide-react"

export default function AddProjectPage() {
  const [logo, setLogo] = useState<File | null>(null)
  const [logoFile, setLogoFile] = useState<string | ''>("")
  const [profileName, setProfileName] = useState("")
  const [isLoading, setIsLoading] = useState(false) // Added loading state
  const [profileDescription, setProfileDescription] = useState("")
  const [appUrls, setAppUrls] = useState<string[]>([""])
  const [error, setError] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const router = useRouter()
  const { addProject } = useProjects()

  // const platforms = [
  //   { platform: "Instagram", authentication: false },
  //   { platform: "Meta", authentication: false },
  //   { platform: "Twitter", authentication: true },
  //   { platform: "TikTok", authentication: true },
  //   { platform: "Roblox", authentication: true },
  //   { platform: "Snapchat", authentication: true },
  // ];

  // const selectedPlatforms = watch("selectedPlatforms");

  // const toggleSelection = (platform: string) => {
  //   setValue(
  //     "selectedPlatforms",
  //     selectedPlatforms.includes(platform)
  //       ? selectedPlatforms.filter((p) => p !== platform)
  //       : [...selectedPlatforms, platform]
  //   );
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const clientId = localStorage.getItem("clientId");
    const url = "https://app.plurality.local:443/crm/client-app/"
    const stytchToken = localStorage.getItem("stytchToken");


    // Remove the last URL if it's empty
    if (appUrls[appUrls.length - 1] === "") {
      appUrls.pop();
    }

    const urlRegex = /^(https?:\/\/)?(localhost(:\d+)?|([\da-zA-Z.-]+\.[a-zA-Z]{2,6})(:\d+)?)([/\w .-]*)*\/?$/;
    
    // Check if all URLs in the appUrls array are valid
    const invalidUrl = appUrls.find((url) => !urlRegex.test(url));

    if (invalidUrl) {
      // If any URL is invalid, show an error and stop submission
      setError("Please enter a valid URL for all fields.");
      setIsLoading(false);
      console.log("Please add valid URLs.");
      return;
    }

    const response = await axios.post(url, {
      profileName,
      profileDescription,
      clientId,
      domains: appUrls,
      img: logoFile,
    }, {
      headers: {
        Authorization: `Bearer ${stytchToken}`
      }
    });

    if (response?.data) {
      addProject(response?.data?.data)
      setIsLoading(false)
      router.push("/dashboard")
      setError("")
      setIsError(false)
    }
    else {
      console.log("something went wrong with the request")
      setIsLoading(false)
      setIsError(false)
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

  const handleAppUrlChange = (index: number, value: string) => {
    setIsError(false);
    const newAppUrls = [...appUrls]
    newAppUrls[index] = value
    setAppUrls(newAppUrls)
  }

  const addAppUrlField = () => {

    const urlRegex = /^(https?:\/\/)?(localhost(:\d+)?|([\da-zA-Z.-]+\.[a-zA-Z]{2,6})(:\d+)?)([/\w .-]*)*\/?$/;
    const lastUrl = appUrls.length - 1;

    // Replace `appUrl` with the new URL you want to validate.
    const isValidUrl = urlRegex.test(appUrls[lastUrl]); // assuming `appUrl` is the current input URL


    if (isValidUrl) {

      setAppUrls([...appUrls, ""])
      setError("");
      setIsError(false)
    }
    else {
      setIsError(true);
      setError("Please enter a valid Url")
      // console.log("Please enter a valid Url");
    }

  }

  const removeAppUrlField = (index: number) => {
    const newAppUrls = appUrls.filter((_, i) => i !== index)
    setAppUrls(newAppUrls)
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add New App</CardTitle>
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
                  <p className="text-sm text-gray-500">
                    Your logo will be displayed like this in the sign up/login workflow
                  </p>
                  <NextImage src={"/pluralirty-wid-logo.png"} width={200} height={200} alt="your logo at plutrality widget" />
                  <Input id="logo" type="file" onChange={handleLogoUpload} accept="image/*" />
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="profileName">Profile Name</Label>
                <p className="text-sm text-gray-500">Your profile name will be displayed in place of the highlighted text</p>
                <NextImage src={"/fwc.png"} width={200} height={200} alt="your profile name in plutrality widget" />
                <Input id="profileName" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="profileDescription">Profile Description</Label>
                <p className="text-sm text-gray-500">Your profile description will be displayed in place of the highlighted text</p>
                <NextImage src={"/fwc-description.png"} width={200} height={200} alt="your profile description in plutrality widget" />
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
                {appUrls.map((url, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Input
                      type="url"
                      id={`appUrl-${index}`}
                      value={url}
                      onChange={(e) => handleAppUrlChange(index, e.target.value)}
                      placeholder="https://example.com"
                    />
                    {appUrls.length > 1 && (
                      <Button type="button" variant="outline" size="icon" onClick={() => removeAppUrlField(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
                <Button type="button" variant="outline" size="sm" onClick={addAppUrlField} className="mt-2">
                  <Plus className="h-4 w-4 mr-2" /> Add URL
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          {
            <Button type="submit" onClick={handleSubmit} disabled={isError} >
              {isLoading ? "Submiting..." : "Submit"}
            </Button>
          }

        </CardFooter>
      </Card>
    </div>
  )
}

