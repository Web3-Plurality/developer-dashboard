import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function AddProjectForm({ onSubmit }: { onSubmit: (project: any) => void }) {
  const [logo, setLogo] = useState<File | null>(null)
  const [profileName, setProfileName] = useState("")
  const [profileDescription, setProfileDescription] = useState("")
  const [appUrls, setAppUrls] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      logo,
      profileName,
      profileDescription,
      appUrls: appUrls.split(",").map((url) => url.trim()),
    })
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
    }
  }

  return (
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
        <Button type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </CardFooter>
    </Card>
  )
}

